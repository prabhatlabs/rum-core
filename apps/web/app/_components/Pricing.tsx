"use client";
import { TextAnimate } from "@/components/ui/text-animate";
import { motion } from "motion/react";
import { FaRegCircleCheck } from "react-icons/fa6";

const plans = [
    {
        name: "Free",
        price: 0,
        activeProjects: 2,
        callsPerDay: "50,000",
        dataRetentionDays: "7 Days",
        coreWebVitals: true,
        apiInterception: true,
        advancedGeo: true,
        fullEnvironment: true,
        emailSupport: false,
        buttonText: "Get Started for Free",
    },
    {
        name: "Pro",
        price: 9,
        activeProjects: 8,
        callsPerDay: "500,000",
        dataRetentionDays: "30 Days",
        coreWebVitals: true,
        apiInterception: true,
        advancedGeo: true,
        fullEnvironment: true,
        emailSupport: true,
        buttonText: "Contact Us",
    },
];

function PriceCard({
    plan,
    index,
}: {
    plan: (typeof plans)[number];
    index: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 80, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ amount: 0.4, once: true }}
            transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.15 }}
            className={`p-6 border w-full max-w-xs sm:max-w-sm ${plan.name === "Pro" ? "bg-primary/20 border-primary" : "bg-secondary/20"}`}
        >
            <div className="flex items-end justify-between gap-2">
                <h4 className="relative text-center">
                    <span className="text-5xl lg:text-7xl">${plan.price}</span>
                    <span className="text-muted-foreground absolute bottom-0">
                        /month
                    </span>
                </h4>
                <h5 className={`text-center text-xl lg:text-3xl`}>
                    {plan.name}
                </h5>
            </div>

            <div className="font-thin text-sm text-foreground space-y-2 py-6">
                <div className="w-full flex items-center justify-between gap-4">
                    <span>No. of Projects</span>
                    <span>{plan.activeProjects}</span>
                </div>
                <div className="w-full flex items-center justify-between gap-4">
                    <span>Daily Calls Limit</span>
                    <span>{plan.callsPerDay}</span>
                </div>
                <div className="w-full flex items-center justify-between gap-4">
                    <span>Data Retention</span>
                    <span>{plan.dataRetentionDays}</span>
                </div>
                <div className="w-full flex items-center justify-between gap-4">
                    <span>Core Web Vitals</span>
                    <FaRegCircleCheck
                        className={
                            plan.coreWebVitals
                                ? "text-success"
                                : "text-muted-foreground"
                        }
                    />
                </div>
                <div className="w-full flex items-center justify-between gap-4">
                    <span>API & Network Interception</span>
                    <FaRegCircleCheck
                        className={
                            plan.apiInterception
                                ? "text-success"
                                : "text-muted-foreground"
                        }
                    />
                </div>
                <div className="w-full flex items-center justify-between gap-4">
                    <span>Advanced Geo & ISP Breakdown</span>
                    <FaRegCircleCheck
                        className={
                            plan.advancedGeo
                                ? "text-success"
                                : "text-muted-foreground"
                        }
                    />
                </div>
                <div className="w-full flex items-center justify-between gap-4">
                    <span className="w-60">
                        Full Environment drill-down (OS/Browser/Connection)
                    </span>
                    <FaRegCircleCheck
                        className={
                            plan.fullEnvironment
                                ? "text-success"
                                : "text-muted-foreground"
                        }
                    />
                </div>
                <div className="w-full flex items-center justify-between gap-4">
                    <span>Email Support</span>
                    <FaRegCircleCheck
                        className={
                            plan.emailSupport
                                ? "text-success"
                                : "text-muted-foreground"
                        }
                    />
                </div>
            </div>

            <div className="">
                <button
                    className={`px-4 py-2 w-full flex items-center justify-center border ${plan.name === "Pro" ? "border-primary bg-primary/10 hover:bg-primary/20" : "bg-border/20 hover:bg-border/30"} `}
                >
                    {plan.buttonText}
                </button>
            </div>
        </motion.div>
    );
}

export default function Pricing() {
    return (
        <div
            className="relative border-y-2 px-4 sm:px-6 py-22 md:py-26"
            id="pricing"
        >
            <TextAnimate
                animation="blurInDown"
                by="word"
                once
                className="text-xl md:text-3xl lg:text-5xl"
            >
                Simple, transparent pricing.
            </TextAnimate>
            <TextAnimate
                animation="blurIn"
                by="word"
                once
                className="mt-1 md:mt-2 lg:mt-4 text-xs md:text-sm lg:text-base max-w-4xl"
            >
                Scale your monitoring as you grow.
            </TextAnimate>

            <div className="mt-6 md:mt-8 lg:mt-10 flex flex-col gap-6 md:flex-row md:gap-8 lg:gap-10 items-center justify-center">
                {plans.map((plan, i) => (
                    <PriceCard key={i} plan={plan} index={i} />
                ))}
            </div>
        </div>
    );
}
