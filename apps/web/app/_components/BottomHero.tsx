import { VideoText } from "@/components/ui/video-text";
import CtaButton from "./CtaButton";

export default function BottomHero() {
    return (
        <div className="max-w-7xl mx-auto px-6 pt-30 lg:pt-40">
            <div className="flex flex-col gap-2 items-center justify-center">
                <h4 className="text-xl sm:text-2xl lg:text-3xl text-center leading-tight">
                    Your users
                </h4>
                <div className="relative h-[12vw] w-full overflow-hidden ">
                    <VideoText src="/ocean-wave.mp4">aren't</VideoText>
                </div>
                <h4 className="text-xl sm:text-2xl lg:text-3xl text-center leading-tight">
                    browsing in a lab.
                </h4>
            </div>
            <p className="mt-2 mx-auto max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-5xl text-xs md:text-sm lg:text-base text-center text-muted-foreground">
                Lab tests hide real-world lag. rum-core captures the truth of
                every ISP, every 3G connection, and every regional outage.{" "}
                <br /> Stop optimizing for robots and start building for people.
            </p>
            <CtaButton />
        </div>
    );
}
