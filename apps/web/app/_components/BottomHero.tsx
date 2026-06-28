import { TextAnimate } from "@/components/ui/text-animate";
import CtaButton from "./CtaButton";

export default function BottomHero() {
    return (
        <div className="relative border-y-2 px-4 sm:px-6 py-22 md:py-26">
            <div className="flex flex-col gap-1 md:gap-2 lg:gap-4 items-center justify-center md:mb-2">
                <TextAnimate
                    animation="blurInDown"
                    by="word"
                    once
                    className="text-2xl md:text-4xl lg:text-5xl"
                >
                    {"Your users aren't browsing in a lab."}
                </TextAnimate>
                <TextAnimate
                    animation="blurIn"
                    by="word"
                    once
                    className="text-xs md:text-sm lg:text-base max-w-4xl"
                >
                    Lab tests hide real-world lag. rum-core captures the truth
                    of every ISP, every 3G connection, and every regional
                    outage. Stop optimizing for robots and start building for
                    people.
                </TextAnimate>
                <CtaButton />
            </div>
        </div>
    );
}
