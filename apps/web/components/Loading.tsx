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
    message?: string;
}

export function LoadingPage({ className, message }: LoadingPageProps) {
    return (
        <div
            className={cn(
                "flex h-dvh w-screen items-center justify-center gap-2",
                className,
            )}
        >
            <LoadingSpinner />
            {message && (
                <span className="text-muted-foreground">{message}</span>
            )}
        </div>
    );
}
