"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { TbCircleHalf2 } from "react-icons/tb";
import { Button } from "./button";

export function ThemeToggle({ className }: { className?: string }) {
    const { setTheme, theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    const handleToggle = () => {
        if (theme === "light") {
            setTheme("dark");
        } else {
            setTheme("light");
        }
    };

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;
        const handleListener = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key === "m") handleToggle();
        };
        addEventListener("keydown", handleListener);
        return () => {
            removeEventListener("keydown", handleListener);
        };
    }, [mounted, theme, handleToggle]);

    if (!mounted) {
        return null;
    }

    return (
        <Button
            size={"icon"}
            variant={"ghost"}
            title="Ctrl + m"
            className={className}
            onClick={handleToggle}
        >
            <TbCircleHalf2 className="size-5" />
        </Button>
    );
}
