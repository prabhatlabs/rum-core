import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import Image from "next/image";
import { BiStopwatch } from "react-icons/bi";
import { BsFillLightningFill } from "react-icons/bs";
import { FaEarthAsia } from "react-icons/fa6";
import { RiGitBranchLine } from "react-icons/ri";

const bento = [
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
                className="absolute -z-10 top-0 right-0 h-full object-cover mask-l-from-90% mask-r-from-80% mask-b-from-50% opacity-75"
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
                className="absolute -z-10 top-0 right-0 object-cover"
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
                className="absolute -z-10 top-0 right-0 h-full object-cover mask-l-from-40% mask-b-from-50% opacity-70"
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
                className="absolute -z-10 top-0 right-0 h-full object-cover mask-l-from-60% mask-b-from-50%"
            />
        ),
    },
];

export default function FeaturesSection() {
    return (
        <div className="max-w-7xl mx-auto px-6">
            <BentoGrid>
                {bento.map((card) => (
                    <BentoCard key={card.name} {...card} />
                ))}
            </BentoGrid>
        </div>
    );
}
