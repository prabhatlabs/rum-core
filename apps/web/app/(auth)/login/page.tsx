import { BackgroundVideo } from "@/app/_components/BackgroundVideo";
import ForceDark from "@/app/_components/ForceDark";
import { Rubik } from "next/font/google";
import LoginCard from "./_components/LoginCard";

const rubik = Rubik({
    subsets: ["latin"],
    variable: "--font-rubik",
});

export default function Login() {
    return (
        <div className={rubik.className}>
            <ForceDark />
            <div className="relative z-10 min-h-dvh">
                <BackgroundVideo
                    src="/ocean-wave.mp4"
                    className="absolute top-0 left-0 inset-0 w-full h-full max-h-dvh -z-10 mask-b-from-10% opacity-90"
                />
                <div className="max-w-7xl mx-auto min-h-dvh h-full flex items-center justify-center">
                    <LoginCard />
                </div>
            </div>
        </div>
    );
}
