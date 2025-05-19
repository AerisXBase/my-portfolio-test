"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { Typewriter } from "react-simple-typewriter";
import { WavyBackground } from "./ui/wavy-background";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { GlobeMethods } from "react-globe.gl";
import * as d3 from "d3-geo";

// Dynamic import for react-globe.gl to disable SSR
const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

export default function Hero() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const globeRef = useRef<GlobeMethods | undefined>(undefined);

  // Generate hexagonal grid using d3-geo
  const hexPolygonsData = useMemo(() => {
    const numCells = 100; // Number of hexagons
    const points = Array.from({ length: numCells }, () => [
      Math.random() * 360 - 180, // lng
      Math.random() * 180 - 90, // lat
    ]);

    const voronoi = d3.geoVoronoi().polygons(points);
    const polygons = voronoi.polygons.features.map((feature, i) => ({
      points: feature.geometry.coordinates[0].map(([lng, lat]) => [lat, lng]),
      color:
        theme === "dark"
          ? i % 2 === 0
            ? "#6b21a8"
            : "#1e3a8a" // Galaxy purple/blue
          : i % 4 === 0
          ? "#f9a8d4"
          : i % 4 === 1
          ? "#c4b5fd"
          : i % 4 === 2
          ? "#a5f3fc"
          : "#99f6e4", // Pastel pink, purple, blue, green
    }));

    return polygons;
  }, [theme]);

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
        speed="fast" // Lively animation
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
        <div className="w-full max-w-[500px] lg:max-w-[800px] aspect-square mx-auto lg:mx-0 lg:mt-8">
          <div
            className={`animate-float ${
              isVisible ? "scale-110" : "scale-100"
            } transition-transform duration-500 w-full h-full`}
          >
            <Globe
              ref={globeRef}
              pointsData={[]} // Remove points
              hexPolygonsData={hexPolygonsData}
              hexPolygonColor="color"
              hexPolygonResolution={3}
              hexPolygonMargin={0.5}
              globeImageUrl={
                theme === "dark"
                  ? "//unpkg.com/three-globe/example/img/earth-night.jpg"
                  : "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
              }
              backgroundColor="rgba(0,0,0,0)"
              showAtmosphere={true}
              atmosphereColor={theme === "dark" ? "#6b21a8" : "#f9a8d4"} // Galaxy purple for dark, pastel pink for light
              atmosphereAltitude={0.15}
              width={theme === "lg" ? 800 : 500} // Larger on large screens
              height={theme === "lg" ? 800 : 500}
            />
          </div>
        </div>
      </WavyBackground>
    </div>
  );
}
