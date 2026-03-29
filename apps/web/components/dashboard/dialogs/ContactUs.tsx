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
import { EnvelopeSimpleIcon } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { FaXTwitter } from "react-icons/fa6";

export default function ContactUs() {
    const { closeContactUs, contactUs } = useDialog();

    return (
        <Dialog
            open={contactUs.isOpen}
            onOpenChange={(open) => !open && closeContactUs()}
        >
            <DialogContent className="sm:max-w-md overflow-hidden block! p-0">
                <div className="flex flex-col lg:flex-row">
                    <div className="w-full lg:w-1/3 lg:shrink-0 overflow-hidden">
                        <Image
                            src="/dialog-upgrade.webp"
                            alt="Contact Us"
                            width={300}
                            height={600}
                            className="w-full h-48 lg:h-full object-cover"
                        />
                    </div>
                    <div className="w-full lg:w-2/3 min-w-0 p-6 flex flex-col">
                        <DialogHeader>
                            <DialogTitle>Contact Us</DialogTitle>
                            <DialogDescription>
                                Get in touch with us through the following
                                channels.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col gap-3 mt-4">
                            <Link
                                href="mailto:workforprabhat1254@gmail.com"
                                className="flex items-center gap-3 p-3 border text-muted-foreground hover:bg-muted transition-colors"
                            >
                                <EnvelopeSimpleIcon className="size-6" />
                                <div className="flex flex-col">
                                    <span className="text-sm text-foreground">
                                        Email
                                    </span>
                                    <span className="text-xs">
                                        workforprabhat1254@gmail.com
                                    </span>
                                </div>
                            </Link>
                            <Link
                                href="https://x.com/prabhatlabs"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-3 border text-muted-foreground hover:bg-muted transition-colors"
                            >
                                <FaXTwitter className="size-6" />
                                <div className="flex flex-col">
                                    <span className="text-sm text-foreground">
                                        X (Twitter)
                                    </span>
                                    <span className="text-xs">
                                        @prabhatlabs
                                    </span>
                                </div>
                            </Link>
                        </div>
                        <DialogFooter className="mt-auto pt-4">
                            <Button variant="outline" onClick={closeContactUs}>
                                Close
                            </Button>
                        </DialogFooter>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
