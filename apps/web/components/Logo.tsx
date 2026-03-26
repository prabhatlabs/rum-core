import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
    return (
        <div
            className={cn(
                "bg-primary text-primary-foreground size-10 flex flex-col items-center justify-center leading-0.5 select-none",
                className,
            )}
        >
            <span className="text-sm">rum</span>
            <span className="text-[8px] mb-1.5 ml-0.5">CORE°</span>
        </div>
    );
}
