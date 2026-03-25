"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useDialog } from "@/hooks/use-dialog";
import Image from "next/image";

export default function UpgradeDialog() {
    const {
        closeUpgrade,
        upgrade: { isOpen, reason },
    } = useDialog();

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && closeUpgrade()}>
            <DialogContent className="sm:max-w-md overflow-hidden block! p-0">
                <div className="flex flex-col lg:flex-row">
                    <div className="w-full lg:w-1/3 lg:shrink-0 overflow-hidden">
                        <Image
                            src="/dialog-upgrade.webp"
                            alt="Upgrade Required"
                            width={300}
                            height={600}
                            className="w-full h-48 lg:h-full object-cover"
                        />
                    </div>
                    <div className="w-full lg:w-2/3 min-w-0 p-6 flex flex-col">
                        <DialogHeader>
                            <DialogTitle>Upgrade Required</DialogTitle>
                            <DialogDescription>
                                {reason ??
                                    "This feature is not available on your current plan."}
                            </DialogDescription>
                        </DialogHeader>
                        <p className="text-sm text-muted-foreground">
                            Upgrade your plan to unlock this feature and more.
                        </p>
                        <DialogFooter className="mt-auto pt-4">
                            <Button variant="outline" onClick={closeUpgrade}>
                                Close
                            </Button>
                        </DialogFooter>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
