"use client";
import {
  Navbar as ResizableNavbar,
  NavBody,
  NavItems,
  NavbarLogo,
  NavbarButton,
  MobileNav,
  MobileNavToggle,
  MobileNavHeader,
  MobileNavMenu,
} from "@/components/ui/ResizableNavbar";
import { useState } from "react";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", link: "/" },
    { name: "About", link: "/about" },
    { name: "Projects", link: "/projects" },
    { name: "Contact", link: "/contact" },
  ];

  return (
    <ResizableNavbar>
      {/* Desktop Nav */}
      <NavBody>
        <NavbarLogo />
        <NavItems items={navLinks} /> {/* ← Remove visible */}
        <NavbarButton
          href="/about"
          className="ml-4"
          variant="secondary"
          onClickAction={() => console.log("clicked")}
        >
          About
        </NavbarButton>
      </NavBody>

      {/* Mobile Nav */}
      <MobileNav>
        <MobileNavHeader>
          <NavbarLogo />
          <MobileNavToggle
            isOpen={isMenuOpen}
            onClickAction={() => setIsMenuOpen((prev) => !prev)}
          />
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
          <NavbarButton
            href="/about"
            className="ml-4"
            variant="secondary"
            onClickAction={() => setIsMenuOpen(false)}
          >
            About
          </NavbarButton>
        </MobileNavMenu>
      </MobileNav>
    </ResizableNavbar>
  );
}
