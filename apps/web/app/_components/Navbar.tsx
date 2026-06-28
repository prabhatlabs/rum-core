"use client";

import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Navbar() {
    return (
        <motion.nav
            initial={{
                opacity: 0,
                filter: "blur(10px)",
            }}
            animate={{
                opacity: 1,
                filter: "blur(0px)",
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="sticky top-0 z-50 w-full border-b-2 bg-background/10 backdrop-blur-sm"
        >
            <div className="flex items-center justify-between px-4 py-2 md:px-6 md:py-4 gap-4 relative">
                <div className="flex items-center gap-3">
                    <Logo />
                </div>

                <div className="flex items-center justify-center gap-4 z-10 text-xs md:text-sm">
                    <Link className="px-2 py-1" href={"#home"}>
                        Home
                    </Link>
                    <Link className="px-2 py-1" href={"#features"}>
                        Features
                    </Link>
                    <Link className="px-2 py-1" href={"#how-to-use"}>
                        How to use?
                    </Link>
                    <Link className="px-2 py-1" href={"#pricing"}>
                        Pricing
                    </Link>
                    <Link
                        className="px-2 py-1"
                        href={"https://prabhatlabs.dev"}
                        target="_blank"
                    >
                        Contact
                    </Link>

                    <Link href={"/dashboard"}>
                        <Button variant={"outline"}>Login</Button>
                    </Link>
                    <ThemeToggle />
                </div>
            </div>
        </motion.nav>
    );
}
