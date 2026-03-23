"use client";

import { LoadingPage } from "@/components/Loading";
import { fetcher } from "@/lib/fetcher";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthSessionCallback() {
    const router = useRouter();

    useEffect(() => {
        // this fetch sets the cookie properly — credentialed, same flow as all other requests
        fetcher(`/auth/session`, { method: "GET" }).then(() =>
            router.replace("/dashboard"),
        );
    }, []);

    return <LoadingPage message="redirecting..." />;
}
