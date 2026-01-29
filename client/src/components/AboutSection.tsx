import img1 from "../assets/mainImage.jpg";
import img2 from "../assets/mainImage_2.jpg";
import img3 from "../assets/mainImage_3.jpg";

type Card = { img: string; title: string; body: React.ReactNode };

export default function AboutSection() {
    const cards: Card[] = [
        {
            img: img1,
            title: "How Does It Work?",
            body: (
                <>
                <p>
                    Irrigator Pro calculates the available water in the soil and the daily water
                    needs of the crop based on its growth stage...
                </p>
                <p>
                    If the water needs exceed the available water in the soil, irrigation is recommended.
                </p>
                </>
            ),
        },
        {
            img: img2,
            title: "Supported Crops",
            body: (
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                <li>Corn</li>
                <li>Cotton</li>
                <li>Peanuts</li>
                </ul>
            ),
        },
        {
            img: img3,
            title: "Data Sources",
            body: (
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                <li>Manually entered rainfall and irrigation data</li>
                <li>Soil water sensors (potential / volumetric)</li>
                <li>Wireless soil moisture systems</li>
                </ul>
            ),
        },
    ];

    return (
        <section id="about" style={styles.section}>
        <div style={styles.container}>
            <h2 style={styles.h2}>
            Irrigator Pro provides growers of peanuts, cotton, and corn with a simple tool to
            determine when to irrigate...
            </h2>

            <div style={styles.grid}>
            {cards.map((c, i) => (
                <div key={i} style={styles.card}>
                <div style={{ ...styles.cardImg, backgroundImage: `url(${c.img})` }} />
                <div style={styles.cardBody}>
                    <h3 style={styles.h3}>{c.title}</h3>
                    <div style={styles.p}>{c.body}</div>
                </div>
                </div>
            ))}
            </div>
        </div>
        </section>
    );
}

const styles: Record<string, React.CSSProperties> = {
    section: {
        background: "#f4f6f8",
        padding: "56px 0",
    },
    container: {
        width: "min(1200px, calc(100% - 48px))",
        margin: "0 auto",
    },
    h2: {
        textAlign: "center",
        margin: "0 0 28px",
        fontSize: 20,
        fontWeight: 600,
        color: "#5b6775",
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        gap: 20,
    },
    card: {
        background: "white",
        borderRadius: 10,
        overflow: "hidden",
        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
    },
    cardImg: {
        height: 240,
        backgroundSize: "cover",
        backgroundPosition: "center",
    },
    cardBody: {
        padding: 18,
    },
    h3: {
        margin: "0 0 10px",
        fontSize: 20,
        fontWeight: 700,
        color: "#5b6775",
    },
    p: {
        color: "#6c7786",
        fontSize: 14,
        lineHeight: 1.6,
    },
};
