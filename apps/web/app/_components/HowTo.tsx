import { Highlighter } from "@/components/ui/highlighter";

export default function HowTo() {
    return (
        <div className="max-w-7xl mx-auto">
            <div className="space-y-2 relative h-fit px-6 pt-30 lg:pt-40">
                <h3 className="text-xl sm:text-3xl lg:text-5xl max-w-md md:max-w-xl lg:max-w-2xl leading-tight">
                    Integrated in{" "}
                    <Highlighter
                        action="underline"
                        color="color-mix(in oklab, var(--primary) 50%, transparent)"
                    >
                        60 seconds.
                    </Highlighter>{" "}
                    <br />{" "}
                    <Highlighter
                        action="underline"
                        color="color-mix(in oklab, var(--primary) 50%, transparent)"
                    >
                        No SDK required.
                    </Highlighter>
                </h3>
                <p className="text-xs md:text-sm lg:text-base text-muted-foreground max-w-lg leading-tight">
                    Stop wrestling with complex configurations. rum-core is a
                    drop-in solution that works with any framework.
                </p>
            </div>
        </div>
    );
}
