"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useLogin } from "@/hooks/use-auth";
import { FaGithub, FaGoogle } from "react-icons/fa";

export default function Login() {
    return <LoginCard />;
}

export function LoginCard() {
    const { loginWithGithub, loginWithGoogle } = useLogin();

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
                        onClick={loginWithGoogle}
                    >
                        <FaGoogle />
                        <span>Continue with Google</span>
                    </Button>
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={loginWithGithub}
                    >
                        <FaGithub />
                        <span>Continue with GitHub</span>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
