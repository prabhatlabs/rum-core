import { Logo } from "@/components/Logo";
import { cn } from "@/lib/utils";
import { Rubik } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import ResetForm from "./_components/ResetForm";
import { BackgroundVideo } from "@/app/_components/BackgroundVideo";

const rubik = Rubik({
    subsets: ["latin"],
    variable: "--font-rubik",
});

export default function ResetPasswordPage() {
    return (
        <div
            className={cn(
                rubik.className,
                "relative w-full h-dvh flex items-center justify-center gap-6 p-6 max-w-480 mx-auto",
            )}
        >
            <BackgroundVideo
                src="/glass.mp4"
                className="object-bottom fixed top-0 left-0 inset-0 w-screen h-full max-h-dvh -z-10"
            />
            <div className="relative sm:max-w-md sm:max-h-150 w-full h-full flex items-center justify-center p-6 rounded-2xl bg-background/30 backdrop-blur-md border">
                <div className="absolute top-0 left-0 p-6 w-full flex justify-between items-center">
                    <Link href="/" className="group">
                        <Logo mode="transparent" />
                    </Link>
                    <h4 className="text-foreground/20 text-2xl">rum core</h4>
                </div>
                <ResetForm />
                {/* quick links */}
                <div className="absolute bottom-0 left-0 p-4 w-full text-foreground/60 space-y-2">
                    <div className="flex justify-center items-center gap-1 text-xs">
                        <Link href="/privacy" className="hover:underline">
                            privacy policy
                        </Link>
                        <span>•</span>
                        <Link href="/terms" className="hover:underline">
                            terms of service
                        </Link>
                    </div>
                    <h3 className="text-center text-[10px]">
                        rum-core.prabhatlabs.dev
                    </h3>
                </div>
            </div>
        </div>
    );
}
