import { Highlighter } from "@/components/ui/highlighter";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { TextAnimate } from "@/components/ui/text-animate";
import Link from "next/link";
import { BackgroundVideo } from "./BackgroundVideo";

export default function HeroSection() {
    return (
        <div className="h-dvh" id="home">
            <BackgroundVideo src="/bg.mp4" className="absolute top-0 left-0 inset-0 w-full h-full max-h-dvh -z-10 mask-b-from-10%" />

            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col items-center justify-center pt-50 sm:pt-70">
                    <TextAnimate
                        animation="blurInDown"
                        by="character"
                        once
                        className="text-5xl sm:text-7xl lg:text-8xl text-center whitespace-pre"
                    >
                        Stop guessing!
                    </TextAnimate>
                    <h3
                        className="text-xl sm:text-3xl lg:text-5xl mt-2 md:mt-3 lg:mt-4 text-center"
                    >
                        See exactly what your users experience.
                    </h3>
                    <p className="max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-5xl text-xs md:text-sm text-center mt-2 md:mt-3 lg:mt-4">
                        Go beyond Lighthouse scores. Monitor{" "}
                        <Highlighter action="underline" color="var(--primary)">
                            real-world interactions
                        </Highlighter>{" "}
                        across every ISP, region, and device. Get deep
                        visibility into broken APIs and slow page loads with{" "}
                        <Highlighter
                            action="highlight"
                            color="color-mix(in oklab, var(--primary) 50%, transparent)"
                        >
                            one simple script.
                        </Highlighter>
                    </p>
                </div>

                <div className="flex items-center justify-center py-15">
                    <Link href={"/login"}>
                        <ShimmerButton
                            background="color-mix(in oklab, var(--foreground) 5%, transparent)"
                            shimmerColor="color-mix(in oklab, var(--foreground) 10%, transparent)"
                            className="backdrop-blur-lg border"
                        >
                            Start Tracking
                        </ShimmerButton>
                    </Link>
                </div>
            </div>
        </div>
    );
}
