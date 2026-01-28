import Navbar from "../components/Navbar";
import MainImage from "../components/MainImage";

export default function Home() {
    return (
        <div>
        <Navbar />
        <MainImage />

        {/* placeholder sections để scroll */}
        <div id="about" style={{ padding: 24 }}>About section...</div>
        <div id="tutorials" style={{ padding: 24 }}>Tutorials section...</div>
        <div id="methods" style={{ padding: 24 }}>Methods section...</div>
        <div id="download" style={{ padding: 24 }}>Download section...</div>
        </div>
    );
}
