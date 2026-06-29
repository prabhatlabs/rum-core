"use client";

import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { AnimatePresence, motion } from "framer-motion";
import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const links = [
    { name: "Home", href: "#home", target: "_self" },
    { name: "Features", href: "#features", target: "_self" },
    { name: "How to use?", href: "#how-to-use", target: "_self" },
    { name: "Pricing", href: "#pricing", target: "_self" },
    { name: "Contact", href: "https://prabhatlabs.dev", target: "_blank" },
];

function LgNavItems() {
    return (
        <div className="hidden lg:flex items-center gap-4">
            {links.map((link) => (
                <Link
                    key={link.name}
                    className="px-2 py-1"
                    href={link.href}
                    target={link.target}
                >
                    {link.name}
                </Link>
            ))}
        </div>
    );
}

function NavItems() {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <>
            <Button
                variant={"outline"}
                size="icon"
                onClick={() => setIsOpen((p) => !p)}
            >
                <MenuIcon />
            </Button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 w-full flex flex-col justify-center items-center gap-4 py-4 bg-background/90 border-b"
                    >
                        {links.map((link) => (
                            <Link
                                key={link.name}
                                className="px-2 py-1"
                                href={link.href}
                                target={link.target}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

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
                    <LgNavItems />
                    <NavItems />
                    <Link href={"/dashboard"}>
                        <Button variant={"outline"}>Login</Button>
                    </Link>
                    <ThemeToggle />
                </div>
            </div>
        </motion.nav>
    );
}
