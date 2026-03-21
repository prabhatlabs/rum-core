"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useProjects } from "@/hooks/api/use-projects";
import { useDialog } from "@/hooks/use-dialog";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ConnectProject() {
    const {
        closeConnectProject,
        connectProject: { isOpen },
    } = useDialog();
    const { currentProject } = useProjects();
    const [copied, setCopied] = useState(false);

    const scriptUrl = process.env.NEXT_PUBLIC_CLIENT_SCRIPT_URL ?? "";
    const workerUrl = process.env.NEXT_PUBLIC_WORKER_URL ?? "";
    const projectKey = currentProject?.project_key ?? "";

    const codeSnippet = [
        '<script',
        `  src="${scriptUrl}"`,
        `  data-worker="${workerUrl}"`,
        `  data-key="${projectKey}"`,
        '/>',
    ].join('\n');

    async function copy() {
        await navigator.clipboard.writeText(codeSnippet);
        toast.info("Code copied to clipboard");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    return (
            <Dialog open={isOpen} onOpenChange={(open) => !open && closeConnectProject()}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Connect Your Site</DialogTitle>
                    <DialogDescription>
                        Add this script tag to your website to start tracking.
                    </DialogDescription>
                </DialogHeader>
                <div className="relative rounded-md bg-muted p-4 overflow-hidden">
                    <pre className="text-xs overflow-x-scroll pb-1">
                        <code className="whitespace-pre">{codeSnippet}</code>
                    </pre>
                    <Button
                        onClick={copy}
                        variant="ghost"
                        size={"icon-sm"}
                        className="absolute top-2 right-2"
                    >
                        {copied ? (
                            <Check className="size-4 text-success" />
                        ) : (
                            <Copy className="size-4 text-muted-foreground" />
                        )}
                    </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                    Place this script in the{" "}
                    <code className="text-foreground">&lt;head&gt;</code>{" "}
                    section of your HTML, before any other scripts.
                </p>
            </DialogContent>
        </Dialog>
    );
}
