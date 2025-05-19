"use client";

import { useState, useEffect } from "react";
import {
  Navbar as ResizableNavbar,
  NavBody,
  NavItems,
  NavbarLogo,
  MobileNav,
  MobileNavToggle,
  MobileNavHeader,
  MobileNavMenu,
} from "@/components/ui/ResizableNavbar";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = [
    { name: "Home", link: "/" },
    { name: "About", link: "/about" },
    { name: "Projects", link: "/projects" },
    { name: "Contact", link: "/contact" },
  ];

  const toggleTheme = () => {
    console.log("Toggling theme, current:", resolvedTheme);
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  if (!mounted) return null;

  return (
    <ResizableNavbar>
      {/* Desktop Nav */}
      <NavBody>
        <NavbarLogo />
        <NavItems items={navLinks} />
        <button
          onClick={() => {
            console.log("Desktop theme button clicked");
            toggleTheme();
          }}
          className="ml-4 rounded-full p-2 transition hover:bg-black/10 dark:hover:bg-white/10 z-50 pointer-events-auto"
          aria-label="Toggle Theme"
        >
          {resolvedTheme === "dark" ? (
            <Sun className="h-5 w-5 text-white" />
          ) : (
            <Moon className="h-5 w-5 text-black" />
          )}
        </button>
      </NavBody>

      {/* Mobile Nav */}
      <MobileNav visible={isMenuOpen}>
        <MobileNavHeader>
          <NavbarLogo />
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="rounded-full p-2 transition hover:bg-black/10 dark:hover:bg-white/10"
              aria-label="Toggle Theme"
            >
              {resolvedTheme === "dark" ? (
                <Sun className="h-5 w-5 text-white" />
              ) : (
                <Moon className="h-5 w-5 text-black" />
              )}
            </button>
            <MobileNavToggle
              isOpen={isMenuOpen}
              onClickAction={() => setIsMenuOpen((prev) => !prev)}
            />
          </div>
        </MobileNavHeader>

        <MobileNavMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)}>
          {navLinks.map((item, idx) => (
            <a
              key={`mobile-link-${idx}`}
              href={item.link}
              onClick={() => setIsMenuOpen(false)}
              className="w-full px-2 py-2 text-center text-sm font-medium text-black dark:text-white border border-transparent hover:border-gray-500/20 rounded-lg transition-all duration-200 hover:-translate-y-0.5"
            >
              {item.name}
            </a>
          ))}
        </MobileNavMenu>
      </MobileNav>
    </ResizableNavbar>
  );
}
