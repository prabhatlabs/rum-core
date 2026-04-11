"use client";

import { LoadingPage } from "@/components/Loading";
import { fetcher } from "@/lib/fetcher";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthSessionCallback() {
    const router = useRouter();

    useEffect(() => {
        const ref = new URLSearchParams(window.location.search).get("ref");
        if (!ref) return;

        // this fetch sets the cookie properly — credentialed, same flow as all other requests
        fetcher(`/auth/session?ref=${ref}`, { method: "GET" })
            .then(() => router.replace("/dashboard"))
            .catch(() => router.replace("/login"));
    }, []);

    return <LoadingPage message="redirecting..." />;
}
