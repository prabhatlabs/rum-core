"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useDialog } from "@/hooks/use-dialog";

export default function UpgradeDialog() {
    const {
        closeUpgrade,
        upgrade: { isOpen, reason },
    } = useDialog();

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && closeUpgrade()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Upgrade Required</DialogTitle>
                    <DialogDescription>
                        {reason ?? "This feature is not available on your current plan."}
                    </DialogDescription>
                </DialogHeader>
                <p className="text-sm text-muted-foreground">
                    Upgrade your plan to unlock this feature and more.
                </p>
            </DialogContent>
        </Dialog>
    );
}
