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
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowIntro(false), 5000);
    return () => clearTimeout(t);
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
