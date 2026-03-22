import { Highlighter } from "@/components/ui/highlighter";

export default function SecondaryHeroSection() {
    return (
        <div className="max-w-7xl mx-auto">
            <div className="space-y-2 relative h-fit px-6 pt-20 pb-10 lg:pb-20">
                <h3 className="text-xl sm:text-3xl lg:text-5xl max-w-md md:max-w-xl lg:max-w-3xl leading-tight">
                    Performance monitoring that does'nt cost you <Highlighter action="underline" color="color-mix(in oklab, var(--primary) 50%, transparent)">performance.</Highlighter>
                </h3>
                <p className="text-xs md:text-sm lg:text-base text-muted-foreground max-w-lg leading-tight">
                    A ~5kb heartbeat for your web app. Capture Web Vitals, API
                    latencies, and user environment data with zero
                    overhead—enriched at the edge and built for the modern
                    developer.
                </p>
            </div>
        </div>
    );
}
