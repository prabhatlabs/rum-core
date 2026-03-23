import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CtaButton() {
    return (
        <div className="flex items-center justify-center py-15">
            <Link href="/dashboard">
                <Button
                    variant="outline"
                    className="w-full h-fit rounded-full backdrop-blur-lg dark:bg-foreground/5 dark:hover:bg-foreground/10 group text-base px-6 pt-3 pb-3"
                    size={"lg"}
                >
                    Start Tracking
                </Button>
            </Link>
        </div>
    );
}
