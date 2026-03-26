"use client";

export function BackgroundVideo({
    src,
    className,
}: {
    src: string;
    className?: string;
}) {
    return (
        <video
            src={src}
            autoPlay
            muted
            loop
            playsInline
            className={className}
            style={{ objectFit: "cover" }}
        />
    );
}
