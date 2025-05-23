"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import Tilt from "react-parallax-tilt";
import { ArrowDown } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const video = videoRef.current;

    const handleCanPlay = () => setLoading(false);
    if (video) {
      video.addEventListener("canplaythrough", handleCanPlay);
    }

    // Fallback in case video never loads
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 3000); // fallback to hide loader after 3 seconds

    return () => {
      video?.removeEventListener("canplaythrough", handleCanPlay);
      clearTimeout(timeout);
    };
  }, []);

  useGSAP(() => {
    if (!containerRef.current) return;

    gsap.set(containerRef.current, {
      clipPath: "polygon(14% 0, 72% 0, 88% 90%, 0 95%)",
      borderRadius: "0% 0% 40% 10%",
    });

    gsap.from(containerRef.current, {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      borderRadius: "0% 0% 0% 0%",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
      ease: "power1.inOut",
    });
  }, [mounted]);

  if (!mounted) return null;

  const videoSrc =
    theme === "dark" ? "/videos/bg-dark.mp4" : "/videos/bg-light.mp4";

  const overlay = (
    <div className="absolute top-0 left-0 w-full h-full bg-black/50 dark:bg-black/60 z-10" />
  );

  return (
    <div className="relative w-full h-screen font-space-grotesk overflow-hidden">
      {/* Loading animation */}
      {loading && (
        <div className="absolute z-[100] flex items-center justify-center w-full h-screen bg-black">
          <div className="three-body">
            <div className="three-body__dot"></div>
            <div className="three-body__dot"></div>
            <div className="three-body__dot"></div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div
        ref={containerRef}
        className="relative w-full h-screen overflow-hidden"
      >
        <video
          ref={videoRef}
          key={videoSrc}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute top-0 left-0 w-full h-full object-cover scale-[1] z-0"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
        {overlay}

        <div className="relative z-20 w-full h-full flex flex-col justify-center items-center text-center px-4">
          <Tilt
            tiltMaxAngleX={10}
            tiltMaxAngleY={10}
            glareEnable={true}
            glareMaxOpacity={0.3}
          >
            <div className="w-full h-full flex flex-col justify-center md:justify-start px-8 md:px-20 text-left">
              <h1 className="text-white/90 text-[5rem] sm:text-[7rem] font-extrabold uppercase leading-[1]">
                REDEFINE
                <br />
                FRONT-END
              </h1>
              <p className="text-white/80 text-xl max-w-lg mt-4 font-grotesk">
                I build interfaces that feel fast, fluid, and alive.
              </p>
              <div className="mt-8 flex gap-4">
                <button className="group bg-black flex items-center gap-2 text-white px-6 py-2 rounded-full backdrop-blur-md border border-white/30 hover:bg-white/20 hover:scale-105 transition-all duration-300 shadow-md">
                  View Projects
                  <ArrowDown className="w-5 h-5 transition-transform duration-300 group-hover:translate-y-1" />
                </button>

                <button className="glass-button text-white px-6 py-2 rounded-full backdrop-blur-md bg-white/10 border hover:text-black border-white/30 hover:bg-white/90 hover:scale-105 transition-all duration-300 shadow-md">
                  Contact Me
                </button>
              </div>
            </div>
          </Tilt>
        </div>
      </div>
    </div>
  );
}
