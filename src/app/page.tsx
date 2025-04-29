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
    const timer = setTimeout(() => setShowIntro(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  if (showIntro) {
    return (
      <div className="fixed inset-0 bg-[#f5f5dc] flex items-center justify-center z-50">
        <Butterfly />
      </div>
    );
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
