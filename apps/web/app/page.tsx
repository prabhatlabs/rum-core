import BackgroundPattern from "./_components/BackroundPattern";
import BottomHero from "./_components/BottomHero";
import Footer from "./_components/Footer";
import HeroSection from "./_components/HeroSection";
import HowToUse from "./_components/HowToUse";
import Navbar from "./_components/Navbar";
import Pricing from "./_components/Pricing";
import SecondaryHeroSection from "./_components/SecondaryHeroSection";

export default function Home() {
    return (
        <div className="relative">
            <BackgroundPattern direction="up" className="hidden lg:block" />
            <div className="relative shrink-0 z-10 min-h-dvh md:border-x max-w-7xl mx-auto bg-background">
                <Navbar />
                <div className="space-y-20 md:space-y-28 lg:space-y-44">
                    <HeroSection />
                    <SecondaryHeroSection />
                    <HowToUse />
                    <Pricing />
                    <BottomHero />
                    <Footer />
                </div>
            </div>
        </div>
    );
}
