import BackgroundPattern from "@/app/_components/BackroundPattern";
import { Logo } from "@/components/Logo";
import { TextAnimate } from "@/components/ui/text-animate";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import Image from "next/image";
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

function FeatureCard({ feat }: { feat: (typeof loginFeatures)[0] }) {
    return (
        <div className="bg-background border p-4 flex gap-4">
            <feat.Icon className="size-10 text-foreground/80 shrink-0" />
            <div>
                <p className="text-lg">{feat.title}</p>
                <p className="text-xs text-muted-foreground">{feat.description}</p>
            </div>
        </div>
    );
}

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative grid xl:grid-cols-2">
            <div className="relative">
                <div>
                    <Image
                        src={"/login-bg.jpg"}
                        className="absolute inset-0 w-full h-full object-cover opacity-80"
                        priority
                        width={800}
                        height={1080}
                        alt="login-bg"
                    />
                </div>
                <div className="max-w-7xl mx-auto px-6 min-h-dvh h-full flex items-center justify-center">
                    {children}
                </div>
            </div>

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
                        Your dashboard is ready. Dive straight into deep
                        insights on page performance, request success rates, and
                        user entry speeds the moment you sign in.
                    </TextAnimate>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                        {loginFeatures.map((feat) => (
                            <FeatureCard key={feat.id} feat={feat} />
                        ))}
                    </div>
                </div>
            </div>
            <ThemeToggle className="absolute bottom-0 right-0 m-4 md:m-6" />
        </div>
    );
}
