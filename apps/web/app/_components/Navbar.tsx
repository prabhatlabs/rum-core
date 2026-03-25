import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 z-50 w-full pt-4 pb-20 md:pb-25 bg-foreground/10 mask-b-from-30% backdrop-blur-lg">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-6 gap-4 relative">
                <div className="flex items-center gap-3">
                    <Logo />
                </div>

                <div className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] hidden md:flex w-full items-center justify-center gap-2 md:gap-4 text-xs md:text-sm">
                    <Link
                        href={"#home"}
                        className="hover:border-b border-foreground"
                    >
                        Home
                    </Link>
                    <Link
                        href={"#features"}
                        className="hover:border-b border-foreground"
                    >
                        Features
                    </Link>
                    <Link
                        href={"#pricing"}
                        className="hover:border-b border-foreground"
                    >
                        Pricing
                    </Link>
                </div>

                <div className="flex items-center justify-center gap-2 z-10 text-xs md:text-sm">
                    <Link href={"#how-to-use"}>How to use?</Link>

                    <Link href={"/dashboard"}>
                        <Button variant={"outline"} size="lg">
                            Login
                        </Button>
                    </Link>
                </div>
            </div>
        </nav>
    );
}
