import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-mono",
});

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

const URL = "https://rum-core.prabhatlabs.dev";

export const metadata: Metadata = {
    title: "RUM Core — Real User Monitoring for the Modern Web",
    description:
        "Track Core Web Vitals, API latency, and real user sessions. See performance by country, ISP, device, and browser — all from a single lightweight script.",
    keywords: [
        "RUM",
        "Real User Monitoring",
        "web performance",
        "Core Web Vitals",
        "LCP",
        "CLS",
        "INP",
        "API monitoring",
        "performance monitoring",
        "Geo enrichment",
        "ISP breakdown",
    ],
    authors: [{ name: "prabhatlabs" }],
    creator: "prabhatlabs",
    openGraph: {
        type: "website",
        locale: "en_US",
        url: URL,
        title: "RUM Core - Real User Monitoring for the Modern Web",
        description:
            "Track Core Web Vitals, API latency, and real user sessions. See performance by country, ISP, device, and browser — all from a single lightweight script.",
        siteName: "RUM Core",
        images: [
            {
                url: `${URL}/preview.webp`,
                width: 1200,
                height: 630,
                alt: "RUM Core — Real User Monitoring",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "RUM Core - Real User Monitoring for the Modern Web",
        description:
            "Track Core Web Vitals, API latency, and real user sessions. See performance by country, ISP, device, and browser — all from a single lightweight script.",
        images: [`${URL}/preview.webp`],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={jetbrainsMono.variable}
            suppressHydrationWarning
        >
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased transition-all duration-300`}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    {children}
                    <Toaster />
                </ThemeProvider>
            </body>
        </html>
    );
}
