"use client";

import { LoadingSpinner } from "@/components/Loading";
import { fetcher } from "@/lib/fetcher";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthSessionCallback() {
    const router = useRouter();

    useEffect(() => {
        const token = new URLSearchParams(window.location.search).get("token");
        if (!token) return;

        // this fetch sets the cookie properly — credentialed, same flow as all other requests
        fetcher(`/auth/session?token=${token}`, { method: "GET" }).then(() =>
            router.replace("/dashboard"),
        );
    }, []);

    return (
        <div
            className={"flex h-dvh w-screen items-center justify-center gap-2"}
        >
            <LoadingSpinner />
            <span className="text-muted-foreground">redirecting...</span>
        </div>
    );
}
