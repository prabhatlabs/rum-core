"use client";

import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { BackgroundVideo } from "./_components/BackgroundVideo";
import Navbar from "./_components/Navbar";

export default function Home() {
    const { setTheme, resolvedTheme } = useTheme();
    const previousTheme = useRef<string | undefined>(undefined);

    useEffect(() => {
        previousTheme.current = resolvedTheme;
        setTheme("dark");

        return () => {
            setTheme(previousTheme.current ?? "system");
        };
    }, []);
    return (
        <>
            <BackgroundVideo />
            <Navbar />
            <div className="relative z-10 min-h-dvh max-w-7xl mx-auto mt-30 md:mt-45">
                <Link
                    href="/login"
                    className="px-6 py-3 bg-background/80 backdrop-blur-sm border rounded-md text-sm font-medium hover:bg-background/90 transition-colors"
                >
                    Get Started
                </Link>
            </div>
        </>
    );
}
