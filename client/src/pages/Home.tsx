import { useState } from "react";
import Navbar from "../components/Navbar";
import MainCarousel from "../components/MainCarousel";
import AboutSection from "../components/AboutSection";
import TutorialModal from "../components/TutorialModal";
import MethodsModal from "../components/MethodsModal";
import BasinSection from "../components/BasinSection";

export default function Home() {
    const [openTut, setOpenTut] = useState(false);
    const [openMethods, setOpenMethods] = useState(false);

    return (
        <>
        <Navbar
            onOpenTutorials={() => setOpenTut(true)}
            onOpenMethods={() => setOpenMethods(true)}
        />

        <MainCarousel />
        <AboutSection />

        {/* Tutorials modal */}
        <TutorialModal
            open={openTut}
            onClose={() => setOpenTut(false)}
            youtubeId="HEyFQo9RUWQ"
            title="Web System Tutorials"
        />

        {/* Methods modal */}
        <MethodsModal
            open={openMethods}
            onClose={() => setOpenMethods(false)}
        />

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: 24 }}>
            <div id="methods" style={{ marginTop: 24 }} />
            <div id="download" style={{ marginTop: 24 }}>
                Download section...
            </div>
            <div id="basins" style={{ marginTop: 24 }}>
                <BasinSection />
            </div>
        </div>
        </>
    );
}
