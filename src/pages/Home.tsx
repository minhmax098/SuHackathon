import { useState } from "react";
import Navbar from "../components/Navbar";
import MainCarousel from "../components/MainCarousel";
import AboutSection from "../components/AboutSection";
import TutorialSection from "../components/TutorialSection";
import TutorialModal from "../components/TutorialModal";

export default function Home() {
    const [openTut, setOpenTut] = useState(false);

    return (
        <>
        <Navbar onOpenTutorials={() => setOpenTut(true)} />

        <MainCarousel />
        <AboutSection />
        <TutorialSection />

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: 24 }}>
            <div id="methods" style={{ marginTop: 24 }}>Methods section...</div>
            <div id="download" style={{ marginTop: 24 }}>Download section...</div>
        </div>

        <TutorialModal
            open={openTut}
            onClose={() => setOpenTut(false)}
            youtubeId="HEyFQo9RUWQ"
            title="Web System Tutorials"
        />
        </>
    );
}
