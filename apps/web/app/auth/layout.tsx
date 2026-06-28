import BackgroundPattern from "@/app/_components/BackroundPattern";
import { HeroImage } from "@/app/_components/HeroImage";
import { Logo } from "@/components/Logo";
import { TextAnimate } from "@/components/ui/text-animate";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import Image from "next/image";

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
                        src={"/login-bg.jpg"}
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

            <div className="hidden xl:block relative">
                <BackgroundPattern className="absolute" />
                <div className="absolute bottom-0 left-0 max-w-4xl mr-auto px-6 py-10">
                    <Logo mode="transparent" />
                    <TextAnimate
                        animation="blurInDown"
                        by="word"
                        once
                        className="text-xl md:text-3xl lg:text-5xl my-4"
                    >
                        Monitor What Matters Most
                    </TextAnimate>
                    <TextAnimate
                        animation="blurIn"
                        by="word"
                        once
                        className="text-xs md:text-sm lg:text-base max-w-4xl"
                    >
                        Your dashboard is ready. Dive straight into deep
                        insights on page performance, request success rates, and
                        user entry speeds the moment you sign in.
                    </TextAnimate>
                </div>
                <HeroImage
                    srcDark="/overview-dark.png"
                    srcLight="/overview-light.png"
                    imageClassName="w-fit h-dvh"
                    width={800}
                    height={800}
                />
            </div>
            <ThemeToggle className="absolute bottom-0 right-0 m-4 md:m-6" />
        </div>
    );
}
