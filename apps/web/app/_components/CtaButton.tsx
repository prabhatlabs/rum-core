"use client";

import Link from "next/link";
import { BsArrowRight } from "react-icons/bs";
import { motion } from "motion/react";

export default function CtaButton() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 80, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ amount: 0.4, once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex items-center sm:justify-center"
        >
            <Link href="/dashboard">
                <button
                    className={`px-4 py-2 w-fit flex items-center justify-center gap-2 border border-primary bg-primary/10 hover:bg-primary/20 text-sm md:text-base lg:text-lg`}
                >
                    <span>Start Tracking</span>
                    <BsArrowRight />
                </button>
            </Link>
        </motion.div>
    );
}
