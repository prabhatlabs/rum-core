import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { LightRays } from "@/components/ui/light-rays";
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
        description: "Provide your unique project API key.",
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
        description: "Get insights and analytics for events.",
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

export default function Steps() {
    return (
        <div className="relative max-w-7xl mx-auto px-6 pt-10 lg:pt-20">
            <BentoGrid>
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
