"use client";

import { Providers } from "@/app/dashboard/layout";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useAuth, useLogin } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { FaGithub, FaGoogle } from "react-icons/fa";

export default function Login() {
    return (
        <Providers>
            <LoginCard />
        </Providers>
    );
}

export function LoginCard() {
    const { loginWithGithub, loginWithGoogle } = useLogin();
    const { user, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    function handleLogin(cb: () => void) {
        if (isAuthenticated && user) {
            router.push("/dashboard");
        } else {
            cb();
        }
    }

    return (
        <div className="flex min-h-dvh w-screen items-center justify-center bg-background p-4">
            <Card className="w-full max-w-sm">
                <CardHeader className="text-center">
                    <CardTitle>Welcome back</CardTitle>
                    <CardDescription>
                        Sign in to your account to continue
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => handleLogin(loginWithGoogle)}
                        disabled={isLoading}
                    >
                        <FaGoogle />
                        <span>Continue with Google</span>
                    </Button>
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => handleLogin(loginWithGithub)}
                        disabled={isLoading}
                    >
                        <FaGithub />
                        <span>Continue with GitHub</span>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
