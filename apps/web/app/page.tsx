import Link from "next/link";
import { BackgroundVideo } from "./_components/BackgroundVideo";

export default function Home() {
    return (
        <>
            <BackgroundVideo />
            <div className="relative z-10 flex min-h-screen items-center justify-center">
                <Link
                    href="/login"
                    className="px-6 py-3 bg-background/80 backdrop-blur-sm border rounded-md text-sm font-medium hover:bg-background/90 transition-colors"
                >
                    Get Started
                </Link>
            </div>
        </>
    );
}
