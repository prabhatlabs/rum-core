import { ThemeToggle } from "@/components/ui/theme-toggle";
import Image from "next/image";
import SideArea from "./_components/SideArea";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative grid xl:grid-cols-2">
            <div className="relative">
                <div>
                    <Image
                        src={"/login-bg.webp"}
                        className="absolute inset-0 w-full h-full object-cover opacity-80"
                        priority
                        width={800}
                        height={1080}
                        alt="login-bg"
                    />
                </div>
                <div className="max-w-7xl mx-auto px-6 min-h-dvh h-full flex items-center justify-center">
                    {children}
                </div>
            </div>

            <SideArea />
            <ThemeToggle className="absolute bottom-0 right-0 m-4 md:m-6" />
        </div>
    );
}
