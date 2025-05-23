"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function About() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const darkGradient = "bg-dark-gradient";
  const lightGradient = "bg-light-gradient";
  const bgClass = theme === "dark" ? darkGradient : lightGradient;

  return (
    <section
      className={`relative min-h-screen flex items-center justify-center py-12 px-4 ${bgClass}`}
    >
      {/* Glass background layer */}

      {/* Content goes on top */}
      <div className="relative z-10 text-center text-white">
        <h1 className="text-4xl font-bold">About Us</h1>
        <p className="mt-4">Some content goes here...</p>
      </div>
    </section>
  );
}
