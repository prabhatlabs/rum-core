"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function BackgroundPattern({
    className,
}: {
    className?: string;
}) {
    return (
        <motion.div
            initial={{
                "--tw-mask-bottom-to-position": "0%",
                filter: "blur(10px)",
                backgroundPosition: "0px 0px",
            }}
            animate={{
                "--tw-mask-bottom-to-position": "90%",
                filter: "blur(0px)",
                backgroundPosition: "-10px -10px",
            }}
            transition={{
                default: {
                    duration: 0.3,
                    delay: 0.3,
                    ease: "easeOut",
                },
                backgroundPosition: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                    delay: 0.6,
                },
            }}
            className={cn(
                "fixed w-full h-full min-h-dvh bg-fixed bg-[repeating-linear-gradient(315deg,var(--border)_0,var(--border)_1px,transparent_0,transparent_50%)] bg-size-[10px_10px] mask-b-to-90%",
                className,
            )}
        ></motion.div>
    );
}
