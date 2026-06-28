import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FaEarthAsia, FaGithub, FaXTwitter } from "react-icons/fa6";

export default function Footer() {
    return (
        <footer className="border-t-2 relative p-6">
            <div className="flex items-end justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <Logo mode="transparent" />
                    <span className="text-muted-foreground text-[10px] md:text-xs">
                        rum-core.prabhatlabs.dev &copy; 2026
                    </span>
                </div>

                <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-center gap-2">
                        <Link href={"https://x.com/prabhatlabs"}>
                            <Button size="icon-sm" variant="ghost">
                                <FaXTwitter />
                            </Button>
                        </Link>
                        <Link href={"https://github.com/prabhatlabs"}>
                            <Button size="icon-sm" variant="ghost">
                                <FaGithub />
                            </Button>
                        </Link>
                        <Link href={"https://prabhatlabs.dev"}>
                            <Button size="icon-sm" variant="ghost">
                                <FaEarthAsia />
                            </Button>
                        </Link>
                    </div>
                    <span className="text-muted-foreground text-[10px] md:text-xs">
                        Built by{" "}
                        <Link
                            href={"https://prabhatlabs.dev"}
                            className="hover:underline"
                        >
                            prabhatlabs
                        </Link>
                    </span>
                </div>
            </div>
        </footer>
    );
}
