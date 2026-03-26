"use client";

import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import Link from "next/link";

export default function CtaButton() {
    return (
        <Link href="/dashboard">
            <motion.div
                initial={{
                    y: 60,
                    opacity: 0,
                    filter: "blur(10px)",
                }}
                animate={{
                    y: 0,
                    opacity: 1,
                    filter: "blur(0px)",
                }}
            >
                <Button
                    variant="outline"
                    className="w-full h-fit rounded-full backdrop-blur-lg dark:bg-foreground/5 dark:hover:bg-foreground/10 group md:text-base px-6 pt-3 pb-3"
                    size={"lg"}
                >
                    Start Tracking
                </Button>
            </motion.div>
        </Link>
    );
}
