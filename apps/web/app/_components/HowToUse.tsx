import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { Highlighter } from "@/components/ui/highlighter";
import { LightRays } from "@/components/ui/light-rays";
import { TextAnimate } from "@/components/ui/text-animate";
import Image from "next/image";
import { RiNumber1, RiNumber2, RiNumber3 } from "react-icons/ri";

const bento = [
    {
        Icon: RiNumber1,
        name: "The Script",
        description: "Add our ~5kb vanilla JS snippet to your <head>.",
        href: "#",
        background: (
            <div className="h-full w-full absolute -z-10 top-0 right-0 mask-l-from-50% mask-b-from-20% opacity-75">
                <LightRays color="#3949ABA6" />
                <Image
                    src={"/step-1.webp"}
                    loading="eager"
                    width={700}
                    height={500}
                    alt="Lightweight Script (~5kb)"
                    className="h-full object-cover"
                />
            </div>
        ),
    },
    {
        Icon: RiNumber2,
        name: "The Key",
        description: "Provide your unique project API key to initialize.",
        href: "#",
        background: (
            <div className="h-full w-full absolute -z-10 top-0 right-0 mask-l-from-50% mask-b-from-20% opacity-75">
                <LightRays color="#AD1457A6" />
                <Image
                    src={"/step-2.webp"}
                    loading="eager"
                    width={700}
                    height={500}
                    alt="Project API Key"
                    className="h-full object-cover"
                />
            </div>
        ),
    },
    {
        Icon: RiNumber3,
        name: "The Insight",
        description: "Track your custom user events in real time.",
        href: "#",
        background: (
            <div className="h-full w-full absolute -z-10 top-0 right-0 mask-l-from-50% mask-b-from-20% opacity-75">
                <LightRays color="#0097A7A6" />
                <Image
                    src={"/step-3.webp"}
                    loading="eager"
                    width={700}
                    height={500}
                    alt="Analytics & Insights"
                    className="h-full object-cover"
                />
            </div>
        ),
    },
];

export default function HowToUse() {
    return (
        <div
            className="relative border-y-2 px-4 sm:px-6 py-22 md:py-26"
            id="how-to-use"
        >
            <div className="flex flex-wrap items-center gap-x-2 md:gap-x-4 lg:gap-x-6">
                <TextAnimate
                    animation="blurInDown"
                    by="word"
                    once
                    className="text-xl md:text-3xl lg:text-5xl"
                >
                    Integrated in
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
                        60 seconds.
                    </TextAnimate>
                </Highlighter>
            </div>
            <div className="my-1 md:my-2 lg:my-4 flex flex-wrap items-center gap-x-2 md:gap-x-4 lg:gap-x-6">
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
                        No SDK
                    </TextAnimate>
                </Highlighter>{" "}
                <TextAnimate
                    animation="blurInDown"
                    by="word"
                    once
                    className="text-xl md:text-3xl lg:text-5xl"
                >
                    required.
                </TextAnimate>
            </div>
            <TextAnimate
                animation="blurIn"
                by="word"
                once
                className="text-xs md:text-sm lg:text-base max-w-4xl"
            >
                Stop wrestling with complex configurations. rum-core is a
                drop-in solution that works with any framework.
            </TextAnimate>

            <BentoGrid className="mt-6 md:mt-8 lg:mt-10">
                {bento.map((card) => (
                    <BentoCard
                        key={card.name}
                        {...card}
                        className="col-span-3 md:col-span-1"
                    />
                ))}
            </BentoGrid>
        </div>
    );
}
