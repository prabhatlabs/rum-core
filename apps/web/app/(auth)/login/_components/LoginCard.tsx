"use client";

import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { useLogin } from "@/hooks/use-auth";
import Link from "next/link";
import { FaGithub, FaGoogle } from "react-icons/fa";

export default function LoginCard() {
    const { loginWithGithub, loginWithGoogle } = useLogin();

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
            <CardContent className="flex flex-col gap-8 px-7">
                <div className="text-center">
                    <h5 className="text-lg">Welcom back</h5>
                    <p className="text-xs text-foreground/60">
                        Sign in to your account to continue
                    </p>
                </div>

                <div className="flex flex-col gap-3">
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
