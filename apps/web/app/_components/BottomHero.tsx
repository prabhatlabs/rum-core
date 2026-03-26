import { VideoText } from "@/components/ui/video-text";
import CtaButton from "./CtaButton";

export default function BottomHero() {
    return (
        <div className="max-w-7xl mx-auto px-6 pt-30 lg:pt-40">
            <div className="flex flex-col gap-2 items-center justify-center md:mb-2">
                <h4 className="text-3xl lg:text-5xl text-center">
                    {"Your users aren't browsing in a"}
                </h4>
                <div className="relative h-[22vw] w-full overflow-hidden md:mt-2 lg:mt-4 xl:mt-6">
                    <VideoText fontSize={32} src="/ocean-wave.mp4">
                        lab
                    </VideoText>
                </div>
            </div>
            <div className="md:-mt-2 lg:-mt-4 xl:-mt-6 flex flex-col w-full items-center justify-center gap-4 md:gap-6">
                <p className="text-xs md:text-sm lg:text-base text-center w-full md:max-w-2xl lg:max-w-3xl xl:max-w-5xl leading-tight">
                    Lab tests hide real-world lag. rum-core captures the truth
                    of every ISP, every 3G connection, and every regional
                    outage. Stop optimizing for robots and start building for
                    people.
                </p>
                <div className="flex justify-center">
                    <CtaButton />
                </div>
            </div>
        </div>
    );
}
