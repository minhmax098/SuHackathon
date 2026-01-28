import Navbar from "../components/Navbar";
import MainCarousel from "../components/MainCarousel";

export default function Home() {
    return (
        <>
        <Navbar />
        <MainCarousel />

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: 24 }}>
            <div id="about">About section...</div>
            <div id="tutorials" style={{ marginTop: 24 }}>Tutorials section...</div>
            <div id="methods" style={{ marginTop: 24 }}>Methods section...</div>
            <div id="download" style={{ marginTop: 24 }}>Download section...</div>
        </div>
        </>
    );
}
