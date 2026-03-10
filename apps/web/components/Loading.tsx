import { cn } from "@/lib/utils";
import { PiSpinnerGap } from "react-icons/pi";

interface LoadingSpinnerProps {
    className?: string;
}

export function LoadingSpinner({ className }: LoadingSpinnerProps) {
    return <PiSpinnerGap className={cn("animate-spin size-5", className)} />;
}

interface LoadingPageProps {
    className?: string;
}

export function LoadingPage({ className }: LoadingPageProps) {
    return (
        <div
            className={cn(
                "flex h-dvh w-screen items-center justify-center",
                className,
            )}
        >
            <LoadingSpinner className="size-5 text-foreground" />
        </div>
    );
}
