"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { Typewriter } from "react-simple-typewriter";
import { WavyBackground } from "./ui/wavy-background";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { GlobeMethods } from "react-globe.gl";

// Dynamic import for react-globe.gl to disable SSR
const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

export default function Hero() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const globeRef = useRef<GlobeMethods | undefined>(undefined);

  // Memoized sample points data
  const initialPointsData = useMemo(
    () => [
      { lat: 40.7128, lng: -74.006, size: 0.1 }, // New York
      { lat: 51.5074, lng: -0.1278, size: 0.08 }, // London
      { lat: 35.6762, lng: 139.6503, size: 0.12 }, // Tokyo
      { lat: -23.5505, lng: -46.6333, size: 0.07 }, // São Paulo
      { lat: 28.7041, lng: 77.1025, size: 0.09 }, // Delhi
    ],
    []
  );

  const [pointsData, setPointsData] = useState(initialPointsData);

  useEffect(() => {
    setMounted(true);

    // Scroll animation setup
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.5 }
    );

    const heroSection = document.querySelector(".hero-section");
    if (heroSection) observer.observe(heroSection);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (globeRef.current) {
      // Auto-rotate
      globeRef.current.controls().autoRotate = true;
      globeRef.current.controls().autoRotateSpeed = 0.5;
      globeRef.current.controls().enableZoom = false; // Disable zoom
      globeRef.current.controls().minDistance = 250; // Lock zoom distance
      globeRef.current.controls().maxDistance = 250; // Lock zoom distance
      // Initial point of view
      globeRef.current.pointOfView(
        {
          lat: 0,
          lng: 0,
          altitude: 2.5,
        },
        0
      );
    }
  }, [mounted]);

  // Update points color when theme changes
  useEffect(() => {
    setPointsData(
      initialPointsData.map((point) => ({
        ...point,
        color: theme === "dark" ? "#6b21a8" : "#c4b5fd", // Deep purple for dark, pastel violet for light
      }))
    );
  }, [theme, initialPointsData]);

  if (!mounted) return null;

  return (
    <div className="relative w-full font-space-grotesk pt-28 hero-section">
      <WavyBackground
        className="
          flex 
          flex-col 
          lg:flex-row 
          items-center 
          justify-between 
          w-full 
          px-4 
          md:px-12 
          gap-6 
          py-4
        "
        speed="fast" // Restore lively animation
      >
        {/* Text Section */}
        <div className="w-full max-w-[600px] flex flex-col items-center text-center space-y-4 lg:items-start lg:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-light text-white w-full">
            <Typewriter
              words={["Hey, I’m Isra.", "I build smooth UIs."]}
              loop
              cursor
              cursorStyle="_"
              typeSpeed={60}
              deleteSpeed={40}
              delaySpeed={1500}
            />
          </h1>

          <p className="text-white/90 text-xl sm:text-2xl md:text-3xl font-thin w-full z-50">
            Front-End Developer focused on animations, performance, and good
            code.
          </p>

          <div className="flex gap-4 flex-wrap justify-center md:justify-start">
            <button className="bg-white text-black px-6 py-2 rounded-full hover:bg-gray-100 hover:-translate-y-1 transition-all duration-300">
              View Projects
            </button>
            <button className="border border-white text-white px-6 py-2 rounded-full hover:bg-white hover:text-black hover:-translate-y-1 transition-all duration-300">
              Contact Me
            </button>
          </div>
        </div>

        {/* Globe Section */}
        <div className="w-full max-w-[400px] lg:max-w-[700px] aspect-square mx-auto lg:mx-0">
          <div
            className={`animate-float ${
              isVisible ? "scale-110" : "scale-100"
            } transition-transform duration-500 w-full h-full`}
          >
            <Globe
              ref={globeRef}
              pointsData={pointsData}
              pointAltitude="size"
              pointRadius={0.5}
              pointColor="color"
              pointsMerge={true}
              pointResolution={8}
              globeImageUrl={
                theme === "dark"
                  ? "//unpkg.com/three-globe/example/img/earth-night.jpg"
                  : "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
              }
              backgroundColor="rgba(0,0,0,0)"
              showAtmosphere={true}
              atmosphereColor={theme === "dark" ? "#6b21a8" : "#c4b5fd"} // Deep purple for dark, pastel violet for light
              atmosphereAltitude={0.15}
              width={theme === "lg" ? 700 : 400} // Larger on large screens, smaller on medium/small
              height={theme === "lg" ? 700 : 400}
            />
          </div>
        </div>
      </WavyBackground>
    </div>
  );
}
