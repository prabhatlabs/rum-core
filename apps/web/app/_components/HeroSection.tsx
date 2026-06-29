import { Highlighter } from "@/components/ui/highlighter";
import { TextAnimate } from "@/components/ui/text-animate";
import { HeroImage } from "./HeroImage";

export default function HeroSection() {
    return (
        <div
            id="home"
            className="aspect-square lg:aspect-auto lg:min-h-[calc(100dvh-88px)] px-6 relative border-b border-t lg:border-t-0 mt-8 md:mt-16 lg:mt-0"
        >
            <HeroImage
                srcDark="/dashboard-dark.webp"
                srcLight="/dashboard-light.webp"
                width={1920}
                height={1080}
                className="top-4 lg:top-0 mask-t-from-90% lg:mask-t-from-100%"
            />
            <div className="absolute bottom-0 left-0 w-full px-4 sm:px-6 py-6 md:py-8 lg:py-10">
                <TextAnimate
                    animation="blurInDown"
                    by="word"
                    once
                    className={`text-5xl md:text-6xl lg:text-7xl xl:text-8xl`}
                >
                    Stop guessing!
                </TextAnimate>
                <div className="my-1 md:my-2 lg:my-4 inline-flex flex-wrap items-center gap-x-2 md:gap-x-4 lg:gap-x-6">
                    <TextAnimate
                        animation="blurInDown"
                        by="word"
                        once
                        className="text-xl md:text-3xl lg:text-5xl"
                    >
                        See exactly what your
                    </TextAnimate>{" "}
                    <Highlighter
                        action="underline"
                        color="color-mix(in oklab, var(--primary) 50%, transparent)"
                    >
                        <TextAnimate
                            animation="blurInDown"
                            by="word"
                            once
                            className="text-xl md:text-3xl lg:text-5xl"
                        >
                            users experience.
                        </TextAnimate>
                    </Highlighter>
                </div>
                <TextAnimate
                    animation="blurIn"
                    by="word"
                    once
                    className="text-xs md:text-sm lg:text-base max-w-4xl"
                >
                    Go beyond Lighthouse scores. Monitor real-world interactions
                    across every ISP, region, and device. Get deep visibility
                    into broken APIs and slow page loads with one simple script.
                </TextAnimate>
            </div>
        </div>
    );
}
