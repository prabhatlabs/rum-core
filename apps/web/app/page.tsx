import { Rubik } from "next/font/google";
import BottomHero from "./_components/BottomHero";
import FeaturesSection from "./_components/FeaturesSection";
import Footer from "./_components/Footer";
import ForceDark from "./_components/ForceDark";
import HeroSection from "./_components/HeroSection";
import HowTo from "./_components/HowTo";
import Navbar from "./_components/Navbar";
import Pricing from "./_components/Pricing";
import SecondaryHeroSection from "./_components/SecondaryHeroSection";
import Steps from "./_components/Steps";

const rubik = Rubik({
    subsets: ["latin"],
    variable: "--font-rubik",
});

export default function Home() {
    return (
        <div className={rubik.className}>
            <ForceDark />
            <Navbar />
            <div className="relative z-10 min-h-dvh">
                <HeroSection />
                <SecondaryHeroSection />
                <FeaturesSection />
                <HowTo />
                <Steps />
                <Pricing />
                <BottomHero />
                <Footer />
            </div>
        </div>
    );
}
