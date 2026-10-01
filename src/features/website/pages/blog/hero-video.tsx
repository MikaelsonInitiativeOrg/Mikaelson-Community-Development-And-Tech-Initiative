"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

/**
 * The Blog hero's looping video (a session clip, silent so browsers allow
 * autoplay; playsInline so iPhones play it in place). It plays constantly,
 * with a small pause/play button, since anything moving for more than five
 * seconds needs one (WCAG 2.2.2). Visitors who prefer reduced motion get
 * it paused on its poster until they press play.
 */
export function HeroVideo({ label }: { label: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.pause();
      setPlaying(false);
      return;
    }
    // Some browsers need an explicit play() even with autoPlay muted.
    video.play().catch(() => setPlaying(false));
  }, []);

  const toggle = () => {
    const video = ref.current;
    if (!video) return;
    if (video.paused) {
      video.play().then(() => setPlaying(true)).catch(() => {});
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  return (
    <>
      <video
        ref={ref}
        className="absolute inset-0 h-full w-full object-cover"
        src="/assets/videos/blog-hero.mp4"
        poster="/assets/videos/blog-hero-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-label={label}
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause video" : "Play video"}
        className="absolute right-3 bottom-3 flex size-11 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm transition-[background-color,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-black/60 active:scale-[0.95] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5ce1e6]"
      >
        {playing ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
      </button>
    </>
  );
}
