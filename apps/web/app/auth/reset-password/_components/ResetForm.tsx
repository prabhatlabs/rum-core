"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetcher } from "@/lib/fetcher";
import { Check } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ResetForm() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [onSuccess, setOnSuccess] = useState(false);

    async function handleReset() {
        const ref = new URLSearchParams(window.location.search).get("ref");
        if (!ref) return;

        const result = await fetcher<{ status: string }>(
            `/auth/reset-password?ref=${ref}`,
            {
                method: "POST",
                body: {
                    password,
                    confirmPassword,
                },
            },
        );

        if (result.status === "success") {
            setOnSuccess(true);
        }
    }

    if (onSuccess) {
        return (
            <div className="flex flex-col items-center justify-center">
                <Check className="size-10" />
                <div className="flex flex-col items-center justify-center mt-2 mb-4">
                    <h1 className="text-lg">Reset Successful!</h1>
                    <p className="text-xs text-muted-foreground">
                        Your password has been reset successfully.
                    </p>
                </div>
                <Link href="/login">
                    <Button
                        className="w-full rounded-md dark:bg-foreground/5 dark:hover:bg-foreground/10 group"
                        variant={"outline"}
                    >
                        Login
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <form
            className="space-y-8"
            onSubmit={(e) => {
                e.preventDefault();
                handleReset();
            }}
        >
            <div className="text-center">
                <h1 className="text-lg">Password Reset</h1>
                <p className="text-xs text-muted-foreground">
                    Enter your new password below.
                </p>
            </div>
            <div className="space-y-4">
                <Input
                    className="w-full rounded-md dark:bg-foreground/5 dark:hover:bg-foreground/10 lg:text-sm"
                    placeholder="New Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Input
                    className="w-full rounded-md dark:bg-foreground/5 dark:hover:bg-foreground/10 lg:text-sm"
                    placeholder="Confirm Password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
            </div>
            <Button
                variant="outline"
                type="submit"
                className="w-full rounded-md dark:bg-foreground/5 dark:hover:bg-foreground/10 group"
            >
                <span>Reset</span>
            </Button>
        </form>
    );
}
