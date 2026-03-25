import { LoadingSpinner } from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface RefreshButtonProps {
    onRefresh: () => void;
    isRefreshing: boolean;
}

export function RefreshButton({ onRefresh, isRefreshing }: RefreshButtonProps) {
    return (
        <Button
            variant="outline"
            size="icon"
            onClick={onRefresh}
            disabled={isRefreshing}
        >
            {isRefreshing ? (
                <LoadingSpinner className="size-4" />
            ) : (
                <RefreshCw className="size-4" />
            )}
        </Button>
    );
}
