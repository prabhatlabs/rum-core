import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 z-50 w-full pt-4 pb-15 md:pb-20 bg-foreground/10 mask-b-from-40% backdrop-blur-sm">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4 gap-4">
                <div className="flex items-center gap-3">
                    <Logo />
                    <h3 className="font-bold text-xl">RUM CORE</h3>
                </div>

                <div className="flex items-center justify-center gap-2 md:gap-4 text-xs md:text-sm">
                    <Link href={"#home"} className="hover:border-b border-foreground">
                        Home
                    </Link>
                    <Link href={"#features"} className="hover:border-b border-foreground">
                        Features
                    </Link>
                    <Link href={"#pricing"} className="hover:border-b border-foreground">
                        Pricing
                    </Link>
                </div>

                <Link href={"/login"}>
                    <Button variant={"outline"}>Login</Button>
                </Link>
            </div>
        </nav>
    );
}
