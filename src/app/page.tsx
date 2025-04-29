// src/app/page.tsx
"use client";

import { useState, useEffect } from "react";
import Butterfly from "@/components/ui/Butterfly";
import { Navbar } from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import ProjectsPreview from "@/components/ProjectsPreview";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    const hasSeenIntro = localStorage.getItem("seenIntro");

    if (!hasSeenIntro) {
      setShowIntro(true);
      localStorage.setItem("seenIntro", "true");

      const timeout = setTimeout(() => setShowIntro(false), 8000);
      return () => clearTimeout(timeout);
    }
  }, []);

  if (showIntro) {
    return <Butterfly />;
  }

  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <ProjectsPreview />
      <Footer />
    </>
  );
}
