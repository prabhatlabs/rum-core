import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { Highlighter } from "@/components/ui/highlighter";
import { TextAnimate } from "@/components/ui/text-animate";
import Image from "next/image";
import { BiStopwatch } from "react-icons/bi";
import { BsFillLightningFill } from "react-icons/bs";
import { FaEarthAsia } from "react-icons/fa6";
import { RiGitBranchLine } from "react-icons/ri";

const features = [
    {
        Icon: BsFillLightningFill,
        name: "Lightweight Script (~5kb)",
        description:
            "Our tracking script is optimized for performance. It wont affect your Lighthouse scores or LCP.",
        className: "col-span-3 md:col-span-2",
        href: "#",
        background: (
            <Image
                src={"/code-snippet.png"}
                loading="eager"
                width={700}
                height={500}
                alt="Lightweight Script (~5kb)"
                className="absolute invert dark:invert-0 -z-10 top-0 right-0 h-full object-cover mask-l-from-90% mask-r-from-80% mask-b-from-50% opacity-75"
            />
        ),
    },
    {
        Icon: BiStopwatch,
        name: "Core Web Vitals",
        description:
            "Capture LCP, CLS, and INP from actual user sessions to see your site's true performance floor.",
        className: "col-span-3 md:col-span-1",
        href: "#",
        background: (
            <Image
                src={"/earth.jpg"}
                loading="eager"
                width={500}
                height={500}
                alt="Lightweight Script (~5kb)"
                className="absolute invert dark:invert-0 -z-10 top-0 right-0 object-cover mask-l-from-40% mask-b-from-50% opacity-70"
            />
        ),
    },
    {
        Icon: RiGitBranchLine,
        name: "Request Interception",
        description:
            "Automatically intercept fetch and XHR calls, capturing API latency, status codes, and payload sizes without manual instrumenting.",
        className: "col-span-3 md:col-span-1",
        href: "#",
        background: (
            <Image
                src={"/flow-line.jpg"}
                loading="eager"
                width={500}
                height={500}
                alt="Geo & ISP Enrichment"
                className="absolute invert dark:invert-0 -z-10 top-0 right-0 h-full object-cover mask-l-from-40% mask-b-from-50% opacity-70"
            />
        ),
    },
    {
        Icon: FaEarthAsia,
        name: "Geo & ISP Enrichment",
        description:
            "Analyze performance by country, city, and ISP. Understand how global network conditions impact your app.",
        className: "col-span-3 md:col-span-2",
        href: "#",
        background: (
            <Image
                src={"/gta-map.jpg"}
                loading="eager"
                width={500}
                height={500}
                alt="Geo & ISP Enrichment"
                className="absolute invert dark:invert-0 -z-10 top-0 right-0 h-full object-cover mask-l-from-60% mask-b-from-50%"
            />
        ),
    },
];

export default function SecondaryHeroSection() {
    return (
        <div
            id="features"
            className="relative border-y-2 px-4 sm:px-6 py-22 md:py-26"
        >
            <div className="inline-flex flex-wrap items-center gap-x-2 md:gap-x-4 lg:gap-x-6">
                <TextAnimate
                    animation="blurInDown"
                    by="word"
                    once
                    className="text-xl md:text-3xl lg:text-5xl"
                >
                    Performance monitoring that you
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
                        does&apos;nt cost
                    </TextAnimate>
                </Highlighter>
                <TextAnimate
                    animation="blurInDown"
                    by="word"
                    once
                    className="text-xl md:text-3xl lg:text-5xl"
                >
                    performance.
                </TextAnimate>
            </div>
            <TextAnimate
                animation="blurIn"
                by="word"
                once
                className="mt-1 md:mt-2 lg:mt-4 text-xs md:text-sm lg:text-base max-w-4xl"
            >
                A ~5kb heartbeat for your web app. Capture Web Vitals, API
                latencies, and user environment data with zero overhead—enriched
                at the edge and built for the modern developer.
            </TextAnimate>

            <BentoGrid className="mt-6 md:mt-8 lg:mt-10">
                {features.map((card) => (
                    <BentoCard key={card.name} {...card} />
                ))}
            </BentoGrid>
        </div>
    );
}
