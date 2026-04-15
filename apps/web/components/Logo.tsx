import { cn } from "@/lib/utils";

export function Logo({
    className,
    mode,
}: {
    className?: string;
    mode?: "default" | "transparent";
}) {
    let modeClassName = "";
    if (mode === "transparent") {
        modeClassName =
            "bg-foreground/10 text-foreground/80 group-hover:text-foreground backdrop-blur-lg";
    }
    return (
        <div
            className={cn(
                "bg-primary text-primary-foreground size-10 flex flex-col items-center justify-center leading-0.5 select-none",
                modeClassName,
                className,
            )}
        >
            <span className="text-sm">rum</span>
            <span className="text-[8px] mb-1.5 ml-0.5">CORE°</span>
        </div>
    );
}
