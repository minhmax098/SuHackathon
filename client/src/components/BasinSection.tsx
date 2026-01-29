import { useEffect, useMemo, useState } from "react";
import type React from "react";
import { GeoJSON, MapContainer, TileLayer } from "react-leaflet";
import type { FeatureCollection, Geometry, GeoJsonProperties, Feature } from "geojson";
import type { Layer } from "leaflet";

type BasinFC = FeatureCollection<Geometry, GeoJsonProperties>;

export default function BasinSection() {
    const [data, setData] = useState<BasinFC | null>(null);
    const [err, setErr] = useState<string | null>(null);

    useEffect(() => {
        fetch("/data/havza-sinirlari.geojson")
        .then((r) => {
            if (!r.ok) throw new Error(`HTTP ${r.status}`);
            return r.json();
        })
        .then((json: BasinFC) => setData(json))
        .catch((e) => setErr(String(e)));
    }, []);

    const center = useMemo<[number, number]>(() => [38.0, 32.5], []);

    return (
        <div style={{ width: "100%", height: 520 }}>
        {err && <div style={{ padding: 12 }}>Error: {err}</div>}

        <MapContainer center={center} zoom={7} style={{ width: "100%", height: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {data && (
            <GeoJSON
                data={data}
                style={() => ({ weight: 2, opacity: 1, fillOpacity: 0.08 })}
                onEachFeature={(feature: Feature<Geometry, GeoJsonProperties>, layer: Layer) => {
                const props = feature.properties ?? {};
                const label =
                    (props as Record<string, unknown>).name ??
                    (props as Record<string, unknown>).NAME ??
                    (props as Record<string, unknown>).havza ??
                    (props as Record<string, unknown>).id ??
                    "Basin";

                layer.bindPopup(String(label));
                }}
            />
            )}
        </MapContainer>
        </div>
    );
}

// const styles: Record<string, React.CSSProperties> = {
//     wrap: {
//         background: "#fff",
//         border: "1px solid #E5E7EB",
//         borderRadius: 12,
//         padding: 18,
//     },
//     h2: { margin: "0 0 6px", fontSize: 18, color: "#111827" },
//     p: { margin: "0 0 14px", color: "#6B7280" },
//     err: {
//         background: "#FEF2F2",
//         border: "1px solid #FCA5A5",
//         color: "#991B1B",
//         padding: 10,
//         borderRadius: 10,
//         marginBottom: 12,
//     },
//     mapWrap: {
//         height: 520,
//         borderRadius: 12,
//         overflow: "hidden",
//         border: "1px solid #E5E7EB",
//     },
//     map: { width: "100%", height: "100%" },
// };
