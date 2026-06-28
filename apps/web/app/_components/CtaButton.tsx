"use client";

import Link from "next/link";
import { BsArrowRight } from "react-icons/bs";
import { motion } from "framer-motion";

export default function CtaButton() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.3, delay: 0.3 }}
        >
            <Link href="/dashboard">
                <button
                    className={`px-4 py-2 w-fit flex items-center justify-center gap-2 border border-primary bg-primary/10 hover:bg-primary/20`}
                >
                    <span>Start Tracking</span>
                    <BsArrowRight />
                </button>
            </Link>
        </motion.div>
    );
}
