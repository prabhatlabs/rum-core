"use client";
import BackgroundPattern from "@/app/_components/BackroundPattern";
import { Logo } from "@/components/Logo";
import { TextAnimate } from "@/components/ui/text-animate";
import { motion } from "framer-motion";
import {
    RiAlertLine,
    RiDashboard3Line,
    RiGlobalLine,
    RiTerminalBoxLine,
    RiTimeLine,
} from "react-icons/ri";

const loginFeatures = [
    {
        id: "core-web-vitals",
        Icon: RiDashboard3Line,
        title: "Core Web Vitals",
        description:
            "Capture LCP, CLS, and INP directly from live user sessions to pinpoint true performance.",
    },
    {
        id: "request-interception",
        Icon: RiTerminalBoxLine,
        title: "Request Interception",
        description:
            "Automatically track fetch/XHR latency, status codes, and payload sizes with zero code.",
    },
    {
        id: "geo-isp-enrichment",
        Icon: RiGlobalLine,
        title: "Geo & ISP Enrichment",
        description:
            "Analyze performance by country, city, and ISP to see how network conditions impact users.",
    },
    {
        id: "error-tracking",
        Icon: RiAlertLine,
        title: "Error & Failure Tracking",
        description:
            "Instantly catch broken API endpoints, failed logins, and client-side exceptions.",
    },
    {
        id: "session-timelines",
        Icon: RiTimeLine,
        title: "Session Timelines",
        description:
            "Map performance metrics to real user journeys to isolate exact authentication friction points.",
    },
];

function FeatureCard({ feat, index }: { feat: (typeof loginFeatures)[0]; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -40, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.5, delay: 0.3 * (index + 1), ease: "easeOut" }}
            className="bg-background border p-4 w-150 flex items-center gap-4"
        >
            <feat.Icon className="size-10 text-foreground/80 shrink-0" />
            <div>
                <p className="text-lg">{feat.title}</p>
                <p className="text-xs text-muted-foreground">
                    {feat.description}
                </p>
            </div>
        </motion.div>
    );
}

export default function SideArea() {
    return (
        <div className="hidden xl:block relative">
            <BackgroundPattern className="absolute" />
            <div className="absolute top-0 left-0 max-w-4xl mr-auto px-6 py-10">
                <Logo mode="transparent" />
                <TextAnimate
                    animation="blurInDown"
                    by="word"
                    once
                    className="text-xl md:text-3xl lg:text-5xl my-4"
                >
                    Monitor What Matters Most
                </TextAnimate>
                <TextAnimate
                    animation="blurIn"
                    by="word"
                    once
                    className="text-xs md:text-sm lg:text-base max-w-4xl"
                >
                    Your dashboard is ready. Dive straight into deep insights on
                    page performance, request success rates, and user entry
                    speeds the moment you sign in.
                </TextAnimate>
                <div className="grid grid-cols-1 gap-6 mt-8">
                    {loginFeatures.map((feat, index) => (
                        <FeatureCard key={feat.id} feat={feat} index={index} />
                    ))}
                </div>
            </div>
        </div>
    );
}
