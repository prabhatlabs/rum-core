"use client";

import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLogin } from "@/hooks/use-auth";
import { validateLoginForm, validateSignupForm } from "@rum-core/shared";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { toast } from "sonner";

export default function LoginCard() {
    const { loginWithGithub, loginWithGoogle } = useLogin();
    const [mode, setMode] = useState("login");

    // Form states
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState<Record<string, string> | null>(null);

    function toggleLoginForm() {
        setMode(mode === "login" ? "signup" : "login");
        setErrors(null);
    }

    const handleSubmit = useCallback(() => {
        if (mode === "login") {
            const result = validateLoginForm({ email, password });
            if (!result.isValid) {
                setErrors(result.errors);
                return;
            }
            setErrors(null);
            console.log("Login:", { email, password });
        } else {
            const result = validateSignupForm({
                name,
                email,
                password,
                confirmPassword,
            });
            if (!result.isValid) {
                setErrors(result.errors);
                return;
            }
            setErrors(null);
            console.log("Sign Up:", { name, email, password });
        }
    }, [confirmPassword, email, mode, name, password]);

    useEffect(() => {
        if (!errors) return;
        toast.error("Error ", {
            description: () => {
                return Object.entries(errors).map(([key, value]) => (
                    <p key={key}>{value}</p>
                ));
            },
        });
    }, [errors]);

    useEffect(() => {
        function handleEnter(event: KeyboardEvent) {
            if (event.key !== "Enter") return;
            handleSubmit();
        }
        window.addEventListener("keydown", handleEnter);
        return () => {
            window.removeEventListener("keydown", handleEnter);
        };
    }, [handleSubmit]);

    return (
        <Card className="w-full max-w-sm py-7 bg-foreground/5 rounded-lg backdrop-blur-lg gap-8">
            <CardHeader className="px-7">
                <div className="flex justify-between items-center">
                    <Link href="/" className="group">
                        <Logo className="bg-foreground/10 text-foreground/80 group-hover:text-foreground backdrop-blur-lg" />
                    </Link>
                    <h4 className="text-foreground/20 text-2xl">rum core</h4>
                </div>
            </CardHeader>
            <CardContent className="flex flex-col px-7">
                {/* welcome */}
                <div className="text-center mb-10">
                    <h5 className="text-lg">
                        {mode === "login" ? "Welcome back" : "Sign Up"}
                    </h5>
                    <p className="text-xs text-foreground/60">
                        {mode === "login"
                            ? "Sign in to your account to continue"
                            : "Create a new account to get started"}
                    </p>
                </div>

                {/* form */}
                <div className="flex flex-col gap-3 mb-3">
                    {mode === "login" ? (
                        <>
                            <Input
                                className="w-full rounded-md dark:bg-foreground/5 dark:hover:bg-foreground/10 text-lg"
                                placeholder="Email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <Input
                                className="w-full rounded-md dark:bg-foreground/5 dark:hover:bg-foreground/10 text-lg"
                                placeholder="Password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <Button
                                variant="outline"
                                onClick={handleSubmit}
                                className="w-full rounded-md dark:bg-foreground/5 dark:hover:bg-foreground/10 group"
                            >
                                <span>Login</span>
                            </Button>
                        </>
                    ) : (
                        <>
                            <Input
                                className="w-full rounded-md dark:bg-foreground/5 dark:hover:bg-foreground/10 text-lg"
                                placeholder="Name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <Input
                                className="w-full rounded-md dark:bg-foreground/5 dark:hover:bg-foreground/10 text-lg"
                                placeholder="Email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <Input
                                className="w-full rounded-md dark:bg-foreground/5 dark:hover:bg-foreground/10 text-lg"
                                placeholder="Password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <Input
                                className="w-full rounded-md dark:bg-foreground/5 dark:hover:bg-foreground/10 text-lg"
                                placeholder="Confirm Password"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                            />
                            <Button
                                variant="outline"
                                onClick={handleSubmit}
                                className="w-full rounded-md dark:bg-foreground/5 dark:hover:bg-foreground/10 group"
                            >
                                <span>Sign Up</span>
                            </Button>
                        </>
                    )}
                    <div className="flex justify-between items-center gap-1 text-foreground/60 text-xs mt-1">
                        <Button
                            variant={"ghost"}
                            className="hover:underline h-fit w-fit px-1 rounded"
                            onClick={toggleLoginForm}
                            type="button"
                        >
                            {mode === "login" ? "Sign Up" : "Login"}
                        </Button>
                        {mode === "login" && (
                            <Button
                                variant={"ghost"}
                                className="hover:underline h-fit w-fit px-1 rounded"
                            >
                                Forgot Password
                            </Button>
                        )}
                    </div>
                </div>

                {/* separator */}
                <div className="w-full border-t mb-8" />

                {/* oauth */}
                <div className="flex flex-col gap-3 mb-6">
                    <Button
                        variant="outline"
                        onClick={loginWithGoogle}
                        className="w-full rounded-md dark:bg-foreground/5 dark:hover:bg-foreground/10 group"
                    >
                        <FaGoogle className="text-foreground/60 group-hover:text-foreground/80" />
                        <span>Continue with Google</span>
                    </Button>
                    <Button
                        variant="outline"
                        onClick={loginWithGithub}
                        className="w-full rounded-md dark:bg-foreground/5 dark:hover:bg-foreground/10 group"
                    >
                        <FaGithub className="text-foreground/60 group-hover:text-foreground/80" />
                        <span>Continue with GitHub</span>
                    </Button>
                </div>

                {/* quick links */}
                <div className="flex justify-center items-center gap-1 text-foreground/60 text-xs">
                    <Link href="/privacy" className="hover:underline">
                        privacy policy
                    </Link>
                    <span>•</span>
                    <Link href="/terms" className="hover:underline">
                        terms of service
                    </Link>
                </div>
            </CardContent>
            <CardFooter className="flex flex-col items-center gap-2 px-7">
                <h3 className="text-[10px] text-foreground/60">
                    rum-core.prabhatlabs.dev
                </h3>
            </CardFooter>
        </Card>
    );
}
