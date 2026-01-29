import { useEffect, useMemo, useState } from "react";
import { GeoJSON, MapContainer, TileLayer } from "react-leaflet";
import type { Feature, FeatureCollection, Geometry, GeoJsonProperties } from "geojson";
import type { Layer as LeafletLayer } from "leaflet";

// Types
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

// Helpers
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

// Crop Kc (ini/mid/end)
type CropKey =
    | "SUGAR_BEET"
    | "MAIZE"
    | "WINTER_WHEAT"
    | "SUNFLOWER"
    | "POTATO"
    | "ALFALFA"
    | "DRY_BEANS"
    | "TOMATO"
    | "BARLEY"
    | "COTTON";

type CropStage = "INITIAL" | "MID" | "LATE";

type CropOption = {
    key: CropKey;
    label: string;
    kc_ini: number;
    kc_mid: number;
    kc_end: number;
};

const CROPS: CropOption[] = [
    { key: "SUGAR_BEET", label: "Sugar Beet", kc_ini: 0.35, kc_mid: 1.2, kc_end: 0.7 },
    { key: "MAIZE", label: "Maize/Corn (Field)", kc_ini: 0.3, kc_mid: 1.2, kc_end: 0.6 },
    { key: "WINTER_WHEAT", label: "Winter Wheat", kc_ini: 0.4, kc_mid: 1.15, kc_end: 0.25 },
    { key: "SUNFLOWER", label: "Sunflower", kc_ini: 0.35, kc_mid: 1.1, kc_end: 0.35 },
    { key: "POTATO", label: "Potato", kc_ini: 0.5, kc_mid: 1.15, kc_end: 0.75 },
    { key: "ALFALFA", label: "Alfalfa (Hay)", kc_ini: 0.4, kc_mid: 0.95, kc_end: 0.9 },
    { key: "DRY_BEANS", label: "Dry Beans", kc_ini: 0.4, kc_mid: 1.15, kc_end: 0.35 },
    { key: "TOMATO", label: "Tomato", kc_ini: 0.6, kc_mid: 1.15, kc_end: 0.8 },
    { key: "BARLEY", label: "Barley", kc_ini: 0.3, kc_mid: 1.15, kc_end: 0.25 },
    { key: "COTTON", label: "Cotton", kc_ini: 0.35, kc_mid: 1.2, kc_end: 0.6 },
];

function kcFrom(crop: CropOption, stage: CropStage) {
    if (stage === "INITIAL") return crop.kc_ini;
    if (stage === "MID") return crop.kc_mid;
    return crop.kc_end;
}

//  Soil Sf (range)
type SoilKey =
    | "SAND"
    | "LOAMY_SAND"
    | "SANDY_LOAM"
    | "LOAM"
    | "CLAY_LOAM"
    | "SILTY_CLAY"
    | "CLAY"
    | "PEAT";

type SoilOption = { key: SoilKey; label: string; min: number; max: number };

const SOILS: SoilOption[] = [
    { key: "SAND", label: "Sand", min: 1.2, max: 1.3 },
    { key: "LOAMY_SAND", label: "Loamy Sand", min: 1.15, max: 1.2 },
    { key: "SANDY_LOAM", label: "Sandy Loam", min: 1.1, max: 1.15 },
    { key: "LOAM", label: "Loam", min: 1.05, max: 1.1 },
    { key: "CLAY_LOAM", label: "Clay Loam", min: 1.02, max: 1.05 },
    { key: "SILTY_CLAY", label: "Silty Clay", min: 1.01, max: 1.03 },
    { key: "CLAY", label: "Clay", min: 1.0, max: 1.02 },
    { key: "PEAT", label: "Peat (Organic)", min: 1.0, max: 1.0 },
];

type SfLevel = "LOW" | "TYPICAL" | "HIGH";

function sfFrom(soil: SoilOption, level: SfLevel) {
    if (level === "LOW") return soil.min;
    if (level === "HIGH") return soil.max;
    return Number(((soil.min + soil.max) / 2).toFixed(2));
}

// Component
export default function BasinSection() {
    const [data, setData] = useState<BasinFC | null>(null);
    const [err, setErr] = useState<string | null>(null);

    const [selectedId, setSelectedId] = useState("");
    const [selectedName, setSelectedName] = useState("");

    // month + area
    const [month, setMonth] = useState<number>(7);
    const [areaHa, setAreaHa] = useState<number>(5);

    // crop + stage -> kc auto
    const [cropKey, setCropKey] = useState<CropKey>("MAIZE");
    const [stage, setStage] = useState<CropStage>("MID");

    const crop = useMemo(() => CROPS.find((c) => c.key === cropKey) ?? CROPS[0], [cropKey]);
    const kc = useMemo(() => kcFrom(crop, stage), [crop, stage]);

    // soil + level -> sf auto
    const [soilKey, setSoilKey] = useState<SoilKey>("SANDY_LOAM");
    const [sfLevel, setSfLevel] = useState<SfLevel>("TYPICAL");

    const soil = useMemo(() => SOILS.find((s) => s.key === soilKey) ?? SOILS[0], [soilKey]);
    const sf = useMemo(() => sfFrom(soil, sfLevel), [soil, sfLevel]);

    // result
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
            kc: String(kc),
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

        {/* Panel */}
        <div
            style={{
            padding: 12,
            border: "1px solid #E5E7EB",
            borderRadius: 12,
            marginBottom: 12,
            background: "white",
            }}
        >
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "flex-start" }}>
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
                <span style={hint}>Month (1-12)</span>
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
                <span style={hint}>Area (ha)</span>
                <input
                    type="number"
                    min={0.01}
                    step={0.01}
                    value={areaHa}
                    onChange={(e) => setAreaHa(Number(e.target.value))}
                    style={inputStyle}
                />
                </label>

                {/* Crop */}
                <label style={{ display: "grid", gap: 4 }}>
                <span style={hint}>Crop</span>
                <select value={cropKey} onChange={(e) => setCropKey(e.target.value as CropKey)} style={inputStyle}>
                    {CROPS.map((c) => (
                    <option key={c.key} value={c.key}>
                        {c.label}
                    </option>
                    ))}
                </select>
                </label>

                {/* Stage */}
                <label style={{ display: "grid", gap: 4 }}>
                <span style={hint}>Stage</span>
                <select value={stage} onChange={(e) => setStage(e.target.value as CropStage)} style={inputStyle}>
                    <option value="INITIAL">Initial stage</option>
                    <option value="MID">Mid-season</option>
                    <option value="LATE">Late season</option>
                </select>
                </label>

                {/* Kc auto */}
                <label style={{ display: "grid", gap: 4 }}>
                <span style={hint}>Kc (auto)</span>
                <input
                    value={kc.toFixed(2)}
                    readOnly
                    style={{ ...inputStyle, background: "#F9FAFB", fontWeight: 700 }}
                />
                </label>

                {/* Soil texture */}
                <label style={{ display: "grid", gap: 4 }}>
                <span style={hint}>Soil texture</span>
                <select value={soilKey} onChange={(e) => setSoilKey(e.target.value as SoilKey)} style={inputStyle}>
                    {SOILS.map((s) => (
                    <option key={s.key} value={s.key}>
                        {s.label} ({s.min.toFixed(2)}–{s.max.toFixed(2)})
                    </option>
                    ))}
                </select>
                </label>

                {/* Sf level */}
                <label style={{ display: "grid", gap: 4 }}>
                <span style={hint}>Sf level</span>
                <select value={sfLevel} onChange={(e) => setSfLevel(e.target.value as SfLevel)} style={inputStyle}>
                    <option value="LOW">Low ({soil.min.toFixed(2)})</option>
                    <option value="TYPICAL">Typical ({sfFrom(soil, "TYPICAL").toFixed(2)})</option>
                    <option value="HIGH">High ({soil.max.toFixed(2)})</option>
                </select>
                </label>

                {/* Sf auto */}
                <label style={{ display: "grid", gap: 4 }}>
                <span style={hint}>Sf (auto)</span>
                <input
                    value={sf.toFixed(2)}
                    readOnly
                    style={{ ...inputStyle, background: "#F9FAFB", fontWeight: 700 }}
                />
                </label>

                <button onClick={onCalculate} disabled={loading} style={btnStyle}>
                {loading ? "Calculating..." : "Calculate quota"}
                </button>
            </div>
            </div>

            {quotaErr && (
            <div style={errBox}>
                <b style={{ color: "#991B1B" }}>Error:</b> {quotaErr}
            </div>
            )}

            {quota && (
            <div style={okBox}>
                <div style={{ fontWeight: 800, marginBottom: 6 }}>
                Monthly quota: {quota.quota_m3.toFixed(2)} m³
                </div>
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

        {/* Map */}
        <div
            style={{
            height: 520,
            borderRadius: 12,
            overflow: "hidden",
            border: "1px solid #E5E7EB",
            background: "#fff",
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

// Styles
const hint: React.CSSProperties = { fontSize: 12, color: "#6B7280" };

const inputStyle: React.CSSProperties = {
    padding: "8px 10px",
    borderRadius: 10,
    border: "1px solid #E5E7EB",
    outline: "none",
    minWidth: 140,
    background: "white",
};

const btnStyle: React.CSSProperties = {
    padding: "10px 14px",
    borderRadius: 12,
    border: "1px solid #111827",
    background: "#111827",
    color: "white",
    cursor: "pointer",
    fontWeight: 800,
    minWidth: 160,
    height: 44,
};

const errBox: React.CSSProperties = {
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    background: "#FEF2F2",
    border: "1px solid #FCA5A5",
};

const okBox: React.CSSProperties = {
    marginTop: 10,
    padding: 12,
    borderRadius: 10,
    background: "#F0FDF4",
    border: "1px solid #86EFAC",
};


