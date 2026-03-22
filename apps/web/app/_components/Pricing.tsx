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

export default function Pricing() {
    return (
        <div className="max-w-7xl mx-auto px-6 pt-30 lg:pt-40" id="pricing">
            <div className="space-y-2 relative h-fit">
                <h3 className="text-xl sm:text-3xl lg:text-5xl max-w-md md:max-w-xl lg:max-w-3xl leading-tight">
                    Simple, transparent pricing.
                </h3>
                <p className="text-xs md:text-sm lg:text-base text-muted-foreground max-w-lg leading-tight">
                    Scale your monitoring as you grow.
                </p>
            </div>

            <div className="flex flex-col gap-6 md:flex-row md:gap-8 lg:gap-10 items-center justify-center pt-10 lg:pt-20">
                {plans.map((plan, i) => (
                    <div
                        key={i}
                        className={`rounded-xl p-6 border w-full max-w-xs sm:max-w-sm ${plan.name === "Pro" ? "bg-primary/20 border-primary scale-105" : "bg-secondary/20"}`}
                    >
                        <div className="flex items-end justify-between gap-2">
                            <h4 className="relative text-center">
                                <span className="text-5xl lg:text-7xl">
                                    ${plan.price}
                                </span>
                                <span className="text-muted-foreground absolute bottom-0">
                                    /month
                                </span>
                            </h4>
                            <h5 className={`text-center text-xl lg:text-3xl`}>
                                {plan.name}
                            </h5>
                        </div>

                        <div className="font-thin text-sm text-foreground/70 space-y-2 py-6">
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
                                    Full Environment drill-down
                                    (OS/Browser/Connection)
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
                                className={`rounded-md px-4 py-2 w-full flex items-center justify-center border ${plan.name === "Pro" ? "border-primary bg-primary/10 hover:bg-primary/20" : "bg-border/20 hover:bg-border/30"} `}
                            >
                                {plan.buttonText}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
