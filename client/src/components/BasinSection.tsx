import { useEffect, useMemo, useState } from "react";
import { GeoJSON, MapContainer, TileLayer } from "react-leaflet";
import type { Feature, FeatureCollection, Geometry, GeoJsonProperties } from "geojson";
import type { Layer as LeafletLayer } from "leaflet";

type BasinFC = FeatureCollection<Geometry, GeoJsonProperties>;

type QuotaResult = {
    ok: boolean;
    month: number;
    year: number;
    days: number;
    areaHa: number;
    kc: number;
    sf: number;
    et0Daily_mm_per_day: number;
    peffMonthly_mm: number;
    etcMonthly_mm: number;
    netMm: number;
    quota_m3: number;
};

const API_BASE = "http://localhost:3001";

/** Kc table */
type Stage = "initial" | "mid" | "late";
type CropKey =
    | "sugar_beet"
    | "maize"
    | "winter_wheat"
    | "sunflower"
    | "potato"
    | "alfalfa"
    | "dry_beans"
    | "tomato"
    | "barley"
    | "cotton";

const CROPS: Record<CropKey, { label: string; kc: Record<Stage, number> }> = {
    sugar_beet: { label: "Sugar Beet", kc: { initial: 0.35, mid: 1.2, late: 0.7 } },
    maize: { label: "Maize/Corn (Field)", kc: { initial: 0.3, mid: 1.2, late: 0.6 } },
    winter_wheat: { label: "Winter Wheat", kc: { initial: 0.4, mid: 1.15, late: 0.25 } },
    sunflower: { label: "Sunflower", kc: { initial: 0.35, mid: 1.1, late: 0.35 } },
    potato: { label: "Potato", kc: { initial: 0.5, mid: 1.15, late: 0.75 } },
    alfalfa: { label: "Alfalfa (Hay)", kc: { initial: 0.4, mid: 0.95, late: 0.9 } },
    dry_beans: { label: "Dry Beans", kc: { initial: 0.4, mid: 1.15, late: 0.35 } },
    tomato: { label: "Tomato", kc: { initial: 0.6, mid: 1.15, late: 0.8 } },
    barley: { label: "Barley", kc: { initial: 0.3, mid: 1.15, late: 0.25 } },
    cotton: { label: "Cotton", kc: { initial: 0.35, mid: 1.2, late: 0.6 } },
    };

const STAGES: { key: Stage; label: string }[] = [
    { key: "initial", label: "Initial" },
    { key: "mid", label: "Mid-season" },
    { key: "late", label: "Late season" },
];

function toRecord(props: GeoJsonProperties | null | undefined): Record<string, unknown> {
    return (props ?? {}) as Record<string, unknown>;
}

function getLabel(feature: Feature<Geometry, GeoJsonProperties>) {
    const p = toRecord(feature.properties);
    return String(p.name ?? p.NAME ?? p.havza ?? feature.id ?? "Basin");
}

function getId(feature: Feature<Geometry, GeoJsonProperties>) {
    const p = toRecord(feature.properties);
    return String(feature.id ?? p.id ?? p.ID ?? p.havza_id ?? p.NAME ?? p.name ?? "");
}

export default function BasinSection() {
    const [data, setData] = useState<BasinFC | null>(null);
    const [err, setErr] = useState<string | null>(null);

    const [selectedId, setSelectedId] = useState("");
    const [selectedName, setSelectedName] = useState("");

    // form inputs
    const [month, setMonth] = useState<number>(7);
    const [areaHa, setAreaHa] = useState<number>(5);

    // kc from dropdowns
    const [cropKey, setCropKey] = useState<CropKey>("maize");
    const [stage, setStage] = useState<Stage>("mid");
    const kc = CROPS[cropKey].kc[stage];

    const [sf, setSf] = useState<number>(1.2);

    // result states
    const [quota, setQuota] = useState<QuotaResult | null>(null);
    const [quotaErr, setQuotaErr] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch("/data/basins.geojson")
        .then((r) => {
            if (!r.ok) throw new Error(`HTTP ${r.status}`);
            return r.json();
        })
        .then((json: BasinFC) => setData(json))
        .catch((e) => setErr(String(e)));
    }, []);

    const center = useMemo<[number, number]>(() => [38.0, 32.5], []);

    async function onCalculate() {
        setLoading(true);
        setQuotaErr(null);
        setQuota(null);

        try {
        if (!selectedId && !selectedName) {
            throw new Error("Please select a basin on the map first.");
        }

        const qs = new URLSearchParams({
            month: String(month),
            areaHa: String(areaHa),
            kc: String(kc), // auto kc
            sf: String(sf),
        });

        const res = await fetch(`${API_BASE}/quota?${qs.toString()}`);
        const json = (await res.json()) as QuotaResult | { error: string };

        if (!res.ok) {
            throw new Error("error" in json ? json.error : `HTTP ${res.status}`);
        }

        setQuota(json as QuotaResult);
        } catch (e) {
        setQuotaErr(String((e as Error).message ?? e));
        } finally {
        setLoading(false);
        }
    }

    return (
        <div style={{ width: "100%" }}>
        {err && <div style={{ padding: 12 }}>Error: {err}</div>}

        {/* PANEL */}
        <div
            style={{
            padding: 12,
            border: "1px solid #E5E7EB",
            borderRadius: 12,
            marginBottom: 12,
            }}
        >
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <div style={{ minWidth: 260 }}>
                <div>
                <b>Selected basin:</b> {selectedName || "(none)"}
                </div>
                <div>
                <b>ID:</b> {selectedId || "-"}
                </div>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "end" }}>
                <label style={{ display: "grid", gap: 4 }}>
                <span style={{ fontSize: 12, color: "#6B7280" }}>Month (1-12)</span>
                <input
                    type="number"
                    min={1}
                    max={12}
                    value={month}
                    onChange={(e) => setMonth(Number(e.target.value))}
                    style={inputStyle}
                />
                </label>

                <label style={{ display: "grid", gap: 4 }}>
                <span style={{ fontSize: 12, color: "#6B7280" }}>Area (ha)</span>
                <input
                    type="number"
                    min={0.01}
                    step={0.01}
                    value={areaHa}
                    onChange={(e) => setAreaHa(Number(e.target.value))}
                    style={inputStyle}
                />
                </label>

                {/* Crop dropdown */}
                <label style={{ display: "grid", gap: 4 }}>
                <span style={{ fontSize: 12, color: "#6B7280" }}>Crop</span>
                <select value={cropKey} onChange={(e) => setCropKey(e.target.value as CropKey)} style={inputStyle}>
                    {Object.entries(CROPS).map(([key, v]) => (
                    <option key={key} value={key}>
                        {v.label}
                    </option>
                    ))}
                </select>
                </label>

                {/* Stage dropdown */}
                <label style={{ display: "grid", gap: 4 }}>
                <span style={{ fontSize: 12, color: "#6B7280" }}>Stage</span>
                <select value={stage} onChange={(e) => setStage(e.target.value as Stage)} style={inputStyle}>
                    {STAGES.map((s) => (
                    <option key={s.key} value={s.key}>
                        {s.label}
                    </option>
                    ))}
                </select>
                </label>

                {/* Show Kc */}
                <div style={{ display: "grid", gap: 4, minWidth: 120 }}>
                <span style={{ fontSize: 12, color: "#6B7280" }}>Kc (auto)</span>
                <div style={{ ...inputStyle, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <b>{kc.toFixed(2)}</b>
                </div>
                </div>

                <label style={{ display: "grid", gap: 4 }}>
                <span style={{ fontSize: 12, color: "#6B7280" }}>Soil factor (Sf)</span>
                <input
                    type="number"
                    min={0.5}
                    step={0.01}
                    value={sf}
                    onChange={(e) => setSf(Number(e.target.value))}
                    style={inputStyle}
                />
                </label>

                <button onClick={onCalculate} disabled={loading} style={btnStyle}>
                {loading ? "Calculating..." : "Calculate quota"}
                </button>
            </div>
            </div>

            {quotaErr && (
            <div
                style={{
                marginTop: 10,
                padding: 10,
                borderRadius: 10,
                background: "#FEF2F2",
                border: "1px solid #FCA5A5",
                }}
            >
                <b style={{ color: "#991B1B" }}>Error:</b> {quotaErr}
            </div>
            )}

            {quota && (
            <div
                style={{
                marginTop: 10,
                padding: 10,
                borderRadius: 10,
                background: "#F0FDF4",
                border: "1px solid #86EFAC",
                }}
            >
                <div style={{ fontWeight: 700, marginBottom: 6 }}>Monthly quota: {quota.quota_m3.toFixed(2)} m³</div>
                <div style={{ color: "#374151", fontSize: 14, display: "grid", gap: 2 }}>
                <div>
                    ET₀: {quota.et0Daily_mm_per_day} mm/day × {quota.days} days
                </div>
                <div>ETc = ET₀ × days × Kc = {quota.etcMonthly_mm.toFixed(2)} mm</div>
                <div>P_eff = {quota.peffMonthly_mm} mm/month</div>
                <div>Net = max(0, ETc − P_eff) = {quota.netMm.toFixed(2)} mm</div>
                <div>Quota = Net(mm) × area(ha) × 10 × Sf</div>
                </div>
            </div>
            )}
        </div>

        {/* MAP */}
        <div
            style={{
            height: 520,
            borderRadius: 12,
            overflow: "hidden",
            border: "1px solid #E5E7EB",
            }}
        >
            <MapContainer center={center} zoom={7} style={{ width: "100%", height: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {data && (
                <GeoJSON
                data={data}
                style={(f) => {
                    const feature = f as unknown as Feature<Geometry, GeoJsonProperties>;
                    const id = getId(feature);
                    const isSel = id !== "" && id === selectedId;

                    return {
                    weight: isSel ? 4 : 2,
                    opacity: 1,
                    fillOpacity: isSel ? 0.18 : 0.08,
                    };
                }}
                onEachFeature={(feature, layer: LeafletLayer) => {
                    const id = getId(feature);
                    const name = getLabel(feature);

                    layer.bindPopup(name);

                    layer.on("click", () => {
                    setSelectedId(id || name);
                    setSelectedName(name);
                    setQuota(null);
                    setQuotaErr(null);
                    });
                }}
                />
            )}
            </MapContainer>
        </div>
        </div>
    );
}

const inputStyle: React.CSSProperties = {
    padding: "8px 10px",
    borderRadius: 8,
    border: "1px solid #E5E7EB",
    outline: "none",
    minWidth: 110,
};

const btnStyle: React.CSSProperties = {
    padding: "10px 14px",
    borderRadius: 10,
    border: "1px solid #111827",
    background: "#111827",
    color: "white",
    cursor: "pointer",
    fontWeight: 700,
};
