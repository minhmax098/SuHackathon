import img from "../assets/mainImage.jpg";

export default function MainImage() {
    return (
        <section style={{ ...styles.image, backgroundImage: `url(${img})` }}>
        <div style={styles.overlay} />
        <div style={styles.textWrap}>
            <h1 style={styles.h1}>
            Based on research performed by the <br />
            ARS National Peanut Research <br />
            Laboratory
            </h1>
        </div>
        </section>
    );
}

const styles: Record<string, React.CSSProperties> = {
    image: {
        width: "100vw",
        height: "calc(100vh - 120px)",
        minHeight: 520,
        position: "relative",
        display: "block",

        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
    },
    overlay: {
        position: "absolute",
        inset: 0,
        background: "rgba(0,0,0,0.25)",
    },
    textWrap: {
        position: "absolute",
        inset: 0,
        display: "grid",
        placeItems: "center",
        padding: 24,
        textAlign: "center",
    },
    h1: {
        color: "white",
        fontSize: "clamp(28px, 4vw, 54px)",
        fontWeight: 800,
        lineHeight: 1.15,
        margin: 0,
        textShadow: "0 2px 12px rgba(0,0,0,0.35)",
    },
};
