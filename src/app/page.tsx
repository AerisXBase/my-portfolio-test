"use client";

import { useEffect, useState } from "react";
import Butterfly from "@/components/ui/Butterfly";
import Hero from "@/components/Hero";
import About from "@/components/About";
import ProjectsPreview from "@/components/ProjectsPreview";

export default function Home() {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 4000); // 4 sec animation time for butterfly
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full h-full bg-black">
      {!showContent ? (
        <Butterfly />
      ) : (
        <>
          <Hero />
          <About />
          <ProjectsPreview />
        </>
      )}
    </div>
  );
}
