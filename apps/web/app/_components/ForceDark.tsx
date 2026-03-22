"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";

export default function ForceDark() {
    const { setTheme, resolvedTheme } = useTheme();
    const previousTheme = useRef<string | undefined>(undefined);

    useEffect(() => {
        previousTheme.current = resolvedTheme;
        setTheme("dark");

        return () => {
            setTheme(previousTheme.current ?? "system");
        };
    }, []);

    return null;
}
