import { TextAnimate } from "@/components/ui/text-animate";
import { Poiret_One } from "next/font/google";
import { BackgroundVideo } from "./BackgroundVideo";
import CtaButton from "./CtaButton";

const poiret = Poiret_One({
    subsets: ["latin"],
    variable: "--font-poiret",
    weight: "400",
});

export default function HeroSection() {
    return (
        <div className="h-dvh" id="home">
            <BackgroundVideo
                src="/ocean-wave.mp4"
                className="absolute top-0 left-0 inset-0 w-full h-full max-h-dvh -z-10 mask-b-from-10% opacity-90"
            />

            <div className="max-w-7xl min-h-dvh mx-auto px-6 relative">
                <div className="absolute top-1/2 -translate-y-[50%] left-0 md:left-1/2 md:-translate-x-[50%] w-full px-6">
                    <TextAnimate
                        animation="blurInDown"
                        by="word"
                        once
                        className={`${poiret.className} text-[84px] leading-[0.8] sm:text-9xl lg:text-[150px] sm:text-center`}
                    >
                        Stop guessing!
                    </TextAnimate>
                    <TextAnimate
                        animation="blurInDown"
                        by="word"
                        once
                        className="text-3xl lg:text-5xl sm:text-center mt-6 sm:mt-8 md:mt-10 lg:mt-12"
                    >
                        See exactly what your users experience.
                    </TextAnimate>
                    <div className="mt-2 md:mt-4 flex flex-col w-full sm:items-center justify-center gap-4 md:gap-6">
                        <TextAnimate
                            animation="blurIn"
                            by="word"
                            once
                            className="text-xs md:text-sm lg:text-base sm:text-center w-full md:max-w-2xl lg:max-w-3xl leading-tight"
                        >
                            Go beyond Lighthouse scores. Monitor real-world
                            interactions across every ISP, region, and device.
                            Get deep visibility into broken APIs and slow page
                            loads with one simple script.
                        </TextAnimate>
                        <div className="flex sm:justify-center">
                            <CtaButton />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
