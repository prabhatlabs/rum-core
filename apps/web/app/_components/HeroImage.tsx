"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import Image from "next/image";

export const HeroImage = ({
    srcDark,
    srcLight,
    width,
    height,
    className,
    imageClassName,
}: {
    srcDark: string;
    srcLight: string;
    width: number;
    height: number;
    className?: string;
    imageClassName?: string;
}) => {
    const { resolvedTheme } = useTheme();
    const src = resolvedTheme === "light" ? srcLight : srcDark;
    return (
        <motion.div
            className={cn(
                "absolute top-0 left-0 w-full h-full mask-b-to-85%",
                className,
            )}
            initial={{
                "--tw-mask-bottom-to-position": "0%",
                filter: "blur(10px)",
            }}
            animate={{
                "--tw-mask-bottom-to-position": "85%",
                filter: "blur(0px)",
            }}
            transition={{ duration: 0.3, delay: 0.3, ease: "easeOut" }}
        >
            <Image
                src={src}
                width={width}
                height={height}
                alt="hero-image"
                className={cn("object-cover", imageClassName)}
            />
        </motion.div>
    );
};
