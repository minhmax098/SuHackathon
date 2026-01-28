import { useEffect, useMemo, useState } from "react";
import mainImage from "../assets/mainImage.jpg";
import mainImage_2 from "../assets/mainImage_2.jpg";
import mainImage_3 from "../assets/mainImage_3.jpg";

type Slide = {
    image: string;
    text: string;
};

export default function MainCarousel() {
    const slides: Slide[] = useMemo(
        () => [
        {
            image: mainImage,
            text: "Based on research performed by the\nCtrl + S Team Research",
        },
        {
            image: mainImage_2,
            text: "Real-time irrigation recommendations",
        },
        {
            image: mainImage_3,
            text: "Notifies users on irrigation needs and crop\nphenological changes",
        },
        ],
        []
    );

    const [idx, setIdx] = useState(0);

    // auto-play
    useEffect(() => {
        const t = setInterval(() => {
        setIdx((p) => (p + 1) % slides.length);
        }, 5000);
        return () => clearInterval(t);
    }, [slides.length]);

    const goPrev = () => setIdx((p) => (p - 1 + slides.length) % slides.length);
    const goNext = () => setIdx((p) => (p + 1) % slides.length);

    return (
        <section style={styles.wrap}>
        {/* Track */}
        <div
            style={{
            ...styles.track,
            width: `${slides.length * 100}%`,
            transform: `translateX(-${idx * (100 / slides.length)}%)`,
            }}
        >
            {slides.map((s, i) => (
            <div
                key={i}
                style={{
                ...styles.slide,
                width: `${100 / slides.length}%`,
                backgroundImage: `url(${s.image})`,
                }}
            >
                <div style={styles.overlay} />
                <div style={styles.textWrap}>
                <h1 style={styles.h1}>
                    {s.text.split("\n").map((line, k) => (
                    <span key={k}>
                        {line}
                        <br />
                    </span>
                    ))}
                </h1>
                </div>
            </div>
            ))}
        </div>

        {/* Arrows */}
        <button aria-label="Previous" onClick={goPrev} style={{ ...styles.arrow, left: 16 }}>
            ‹
        </button>
        <button aria-label="Next" onClick={goNext} style={{ ...styles.arrow, right: 16 }}>
            ›
        </button>

        {/* Dots */}
        <div style={styles.dots}>
            {slides.map((_, i) => (
            <button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setIdx(i)}
                style={{
                ...styles.dot,
                opacity: i === idx ? 1 : 0.45,
                transform: i === idx ? "scale(1.15)" : "scale(1)",
                }}
            />
            ))}
        </div>
        </section>
    );
}

const styles: Record<string, React.CSSProperties> = {
    wrap: {
        position: "relative",
        width: "100vw",
        height: "calc(100vh - 120px)",
        minHeight: 520,
        overflow: "hidden",

        /* full-bleed trick */
        left: "50%",
        right: "50%",
        marginLeft: "-50vw",
        marginRight: "-50vw",
    },
    track: {
        display: "flex",
        height: "100%",
        transition: "transform 600ms ease",
    },
    slide: {
        position: "relative",
        height: "100%",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        flexShrink: 0,
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
        textAlign: "center",
        padding: 24,
    },
    h1: {
        color: "white",
        fontSize: "clamp(28px, 4vw, 54px)",
        fontWeight: 800,
        lineHeight: 1.15,
        margin: 0,
        textShadow: "0 2px 12px rgba(0,0,0,0.35)",
        maxWidth: 1000,
    },
    arrow: {
        padding: 0,
        border: "none",
        outline: "none",
        appearance: "none",
        WebkitAppearance: "none",

        boxSizing: "border-box",
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        width: 44,
        height: 44,
        borderRadius: 999,
        background: "rgba(0,0,0,0.25)",
        color: "white",

        /* icon/text */
        fontSize: 28,
        lineHeight: "44px",
        textAlign: "center",

        cursor: "pointer",
        display: "grid",
        placeItems: "center",
        userSelect: "none",
    },
    dots: {
        position: "absolute",
        left: "50%",
        bottom: 18,
        transform: "translateX(-50%)",
        display: "flex",
        gap: 10,
        alignItems: "center",
    },
    dot: {
        padding: 0,
        border: "none",
        outline: "none",
        appearance: "none",
        WebkitAppearance: "none",

        boxSizing: "border-box",
        width: 22,
        height: 6,         
        borderRadius: 999,
        background: "white",
        cursor: "pointer",
    },
};
