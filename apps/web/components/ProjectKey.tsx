"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { LoadingSpinner } from "./Loading";
import { Button } from "./ui/button";

export default function ProjectKey({
    projectKey,
    className,
}: {
    projectKey: string;
    className?: string;
}) {
    const [isLoading, setLoading] = useState<boolean>(false);
    const [copied, setCopied] = useState<boolean>(false);

    async function copy() {
        setLoading(true);
        await navigator.clipboard.writeText(projectKey);
        toast.info("Project key copied to clipboard");
        setLoading(false);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    return (
        <Button
            className={className}
            variant={"ghost"}
            onClick={copy}
            disabled={isLoading}
        >
            <span>
                {projectKey.slice(0, 8)}
                {new Array(projectKey.length - 8).fill("*").join("")}
            </span>
            {isLoading ? (
                <LoadingSpinner />
            ) : copied ? (
                <Check className="text-success" />
            ) : (
                <Copy />
            )}
        </Button>
    );
}
