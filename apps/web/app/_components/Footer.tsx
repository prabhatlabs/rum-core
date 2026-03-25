import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FaEarthAsia, FaGithub, FaXTwitter } from "react-icons/fa6";
import { BackgroundVideo } from "./BackgroundVideo";

export default function Footer() {
    return (
        <footer className="mask-t-from-70% md:mask-t-from-60% lg:mask-t-from-50% h-[30dvh] relative">
            <BackgroundVideo
                src="/purple-arura.mp4"
                className="absolute top-0 left-0 inset-0 w-full h-full -z-10 rotate-180"
            />

            <div className="xl:max-w-7xl w-full mx-auto flex items-end justify-between px-6 gap-4 absolute bottom-10 left-0 right-0">
                <div className="flex flex-col gap-1">
                    <Logo />
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
