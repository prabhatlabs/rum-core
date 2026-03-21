"use client";

import { useEffect, useRef } from "react";

export function BackgroundVideo() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const video = document.createElement("video");
        video.src = "/bg.mp4";
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        videoRef.current = video;

        let rafId: number;

        function resize() {
            canvas!.width = window.innerWidth;
            canvas!.height = window.innerHeight;
        }

        function draw() {
            if (video.paused || video.ended) return;

            const vw = video.videoWidth;
            const vh = video.videoHeight;
            const cw = canvas!.width;
            const ch = canvas!.height;

            const videoAspect = vw / vh;
            const canvasAspect = cw / ch;

            let sx = 0, sy = 0, sw = vw, sh = vh;

            if (videoAspect > canvasAspect) {
                sw = vh * canvasAspect;
                sx = (vw - sw) / 2;
            } else {
                sh = vw / canvasAspect;
                sy = (vh - sh) / 2;
            }

            ctx!.drawImage(video, sx, sy, sw, sh, 0, 0, cw, ch);
            rafId = requestAnimationFrame(draw);
        }

        video.addEventListener("loadeddata", () => {
            resize();
            video.play();
            draw();
        });

        window.addEventListener("resize", resize);

        return () => {
            cancelAnimationFrame(rafId);
            video.pause();
            video.src = "";
            window.removeEventListener("resize", resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 w-full h-full -z-10 scale-110"
        />
    );
}
