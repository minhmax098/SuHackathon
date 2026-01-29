import React from "react";
import Modal from "./Modal";

type Props = {
    open: boolean;
    onClose: () => void;
};

export default function MethodsModal({ open, onClose }: Props) {
    return (
        <Modal open={open} onClose={onClose} title="Methods & Calculations">
        <div style={styles.wrap}>
            <h3 style={styles.h3}>Available Water Content (AWC)</h3>
            <p style={styles.p}>
            The Available Water Content (AWC) is calculated using soil humidity probe readings, if present,
            otherwise it is calculated using a checkbook method based on rainfall, irrigation, and expected crop water use.
            </p>

            <h4 style={styles.h4}>AWC from Rainfall and Irrigation</h4>
            <p style={styles.p}>
            AWC(today) = AWC(yesterday) - DWU(today) + rainfall(today) + irrigation(today)
            </p>
            <pre style={styles.code}>
    AWC(today) = AWC(yesterday) - DWU(today) + rainfall(today) + irrigation(today)
            </pre>

            <h4 style={styles.h4}>AWC from Probe Readings</h4>
            <p style={styles.p}>
            Example formulas: 
            </p>

            <pre style={styles.code}>
    TWC(probe) = [b0 + b1*ln(probe)]*24
    TWC(40)    = [b0 + b1*ln(40)]*24
    AWC        = TWC(probe) - TWC(40)
            </pre>
        </div>
        </Modal>
    );
}

const styles: Record<string, React.CSSProperties> = {
    wrap: { color: "#111827" },
    h3: { margin: "0 0 8px", fontSize: 16 },
    h4: { margin: "16px 0 8px", fontSize: 14 },
    p: { margin: "0 0 10px", color: "#4b5563", fontSize: 13, lineHeight: 1.6 },
    code: {
        margin: 0,
        padding: 12,
        background: "#f8fafc",
        border: "1px solid #e5e7eb",
        borderRadius: 6,
        fontSize: 12,
        overflow: "auto",
    },
};
