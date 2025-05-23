"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Hero from "@/components/Hero";
import About from "@/components/About";
import ProjectsPreview from "@/components/ProjectsPreview";

export default function HomePage() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // Prevent hydration mismatch
  }, []);

  if (!mounted) return null;

  return (
    <div
      className={`min-h-screen w-full ${
        theme === "dark" ? "bg-dark-gradient" : "bg-light-gradient"
      }`}
    >
      <Hero />
      <About />
      <ProjectsPreview />
    </div>
  );
}
