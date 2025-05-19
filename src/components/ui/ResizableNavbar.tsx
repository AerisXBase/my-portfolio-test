"use client";

import { cn } from "@/lib/utils";
import { IconMenu2, IconX } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import React, { useRef, useState, useEffect } from "react";
import { useTheme } from "next-themes";

// Interfaces
interface NavbarProps {
  children: React.ReactNode;
  className?: string;
}

interface NavBodyProps {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
}

interface NavItemsProps {
  items: { name: string; link: string }[];
  className?: string;
  onItemClick?: () => void;
}

interface MobileNavProps {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
}

interface MobileNavHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface MobileNavMenuProps {
  children: React.ReactNode;
  className?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const Navbar = ({ children, className }: NavbarProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <motion.div
      ref={ref}
      className={cn("fixed inset-x-0 top-0 z-40 w-full", className)}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(
              child as React.ReactElement<{ visible?: boolean }>,
              { visible }
            )
          : child
      )}
    </motion.div>
  );
};

export const NavBody = ({ children, className, visible }: NavBodyProps) => {
  const { resolvedTheme } = useTheme();

  return (
    <motion.div
      animate={{
        backdropFilter: visible ? "blur(10px)" : "none",
        boxShadow: visible
          ? "0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset"
          : "none",
        width: visible ? "40%" : "100%",
        y: visible ? 20 : 0,
      }}
      transition={{ type: "spring", stiffness: 200, damping: 50 }}
      style={{ minWidth: "800px" }}
      className={cn(
        "mt-4 relative z-[60] mx-auto hidden w-full max-w-7xl flex-row items-center justify-between self-start pl-8 pr-16 lg:flex",
        "rounded-full shadow-lg backdrop-blur-md",
        resolvedTheme === "dark"
          ? "bg-gradient-to-r from-cyan-700/50 via-purple-800/50 to-indigo-900/50"
          : "bg-gradient-to-r from-[#f0f0ff] via-[#e3d7f9] to-[#d2e3ff]",
        className
      )}
    >
      {children}
    </motion.div>
  );
};

// export const NavItems = ({ items, className, onItemClick }: NavItemsProps) => {
//   const [hovered, setHovered] = useState<number | null>(null);
//   const { resolvedTheme } = useTheme();

//   return (
//     <motion.div
//       onMouseLeave={() => setHovered(null)}
//       className={cn(
//         "relative flex flex-1 flex-row items-center justify-center space-x-2 text-sm font-medium transition duration-300 lg:space-x-12",
//         className
//       )}
//     >
//       {items.map((item, idx) => (
//         <a
//           key={idx}
//           href={item.link}
//           onMouseEnter={() => setHovered(idx)}
//           onClick={onItemClick}
//           className={cn(
//             resolvedTheme === "light" ? "text-black" : "dark:text-white",
//             "relative px-4 py-2"
//           )}
//         >
//           {hovered === idx && (
//             <motion.div
//               layoutId="hovered"
//               className="absolute inset-0 h-full w-full rounded-full bg-black/20 dark:bg-black/30"
//             />
//           )}
//           <span className="relative z-20">{item.name}</span>
//         </a>
//       ))}
//     </motion.div>
//   );
// };

export const NavItems = ({ items, className, onItemClick }: NavItemsProps) => {
  const [hovered, setHovered] = useState<number | null>(null);
  const [hoverStyle, setHoverStyle] = useState({ left: 0, width: 0 });
  const navItemsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (
      hovered !== null &&
      containerRef.current &&
      navItemsRef.current[hovered]
    ) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const itemRect = navItemsRef.current[hovered]!.getBoundingClientRect();
      setHoverStyle({
        left: itemRect.left - containerRect.left,
        width: itemRect.width,
      });
    }
  }, [hovered]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex flex-1 flex-row items-center justify-center space-x-2 text-sm font-medium lg:space-x-12",
        className
      )}
      onMouseLeave={() => setHovered(null)}
    >
      {/* Hover Background */}
      <div
        className={cn(
          "absolute h-full rounded-full bg-black/10 dark:bg-white/10 transition-all duration-300 ease-in-out pointer-events-none",
          hovered === null ? "opacity-0" : "opacity-100"
        )}
        style={{
          left: hoverStyle.left,
          width: hoverStyle.width,
          top: 0,
        }}
      />

      {/* Nav Links */}
      {items.map((item, idx) => (
        <a
          key={idx}
          href={item.link}
          ref={(el) => {
            navItemsRef.current[idx] = el;
          }}
          onMouseEnter={() => setHovered(idx)}
          onClick={onItemClick}
          className={cn(
            resolvedTheme === "light" ? "text-black" : "text-white",
            "relative px-4 py-2 transition-colors duration-200 z-10"
          )}
        >
          <span>{item.name}</span>
        </a>
      ))}
    </div>
  );
};

export const MobileNav = ({ children, className, visible }: MobileNavProps) => {
  const { resolvedTheme } = useTheme();

  return (
    <motion.div
      animate={{
        backdropFilter: visible ? "blur(10px)" : "none",
        boxShadow: visible
          ? "0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset"
          : "none",
        width: visible ? "90%" : "100%",
        paddingRight: visible ? "12px" : "0px",
        paddingLeft: visible ? "12px" : "0px",
        y: visible ? 20 : 0,
      }}
      transition={{ type: "spring", stiffness: 200, damping: 50 }}
      className={cn(
        "relative mt-4 z-50 mx-auto flex w-full max-w-[calc(100vw-2rem)] flex-col items-center justify-between px-6 lg:hidden",
        "rounded-md shadow-md backdrop-blur-md",
        resolvedTheme === "dark"
          ? "bg-gradient-to-r from-cyan-700/50 via-purple-800/50 to-indigo-900/50"
          : "bg-gradient-to-r from-[#f0f0ff] via-[#e3d7f9] to-[#d2e3ff]",
        className
      )}
    >
      {children}
    </motion.div>
  );
};

export const MobileNavHeader = ({
  children,
  className,
}: MobileNavHeaderProps) => (
  <div
    className={cn("flex w-full items-center justify-between px-4", className)}
  >
    {children}
  </div>
);

export const MobileNavMenu = ({
  children,
  className,
  isOpen,
}: MobileNavMenuProps) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={cn(
          "rounded-lg absolute inset-x-0 top-[5rem] z-50 flex w-full flex-col items-center justify-start gap-4 bg-white px-4 py-4 pb-6 shadow-lg dark:bg-zinc-900",
          className
        )}
      >
        {children}
      </motion.div>
    )}
  </AnimatePresence>
);

export const MobileNavToggle = ({
  isOpen,
  onClickAction,
}: {
  isOpen: boolean;
  onClickAction: () => void;
}) => (
  <button
    onClick={onClickAction}
    className={cn(
      "p-2 rounded-md focus:outline-none transition-colors duration-200",
      isOpen ? "text-[#800020]" : "bg-transparent text-[#800020]"
    )}
  >
    {isOpen ? <IconX size={24} /> : <IconMenu2 size={24} />}
  </button>
);

export const NavbarLogo = () => (
  <Link
    href="/"
    className="relative z-20 flex items-center space-x-2 px-2 text-sm font-normal text-black"
  >
    <Image
      src="/images/logo/logo-4.png"
      alt="logo"
      width={100}
      height={100}
      priority
      className="object-contain"
      style={{ width: "100px", height: "auto" }}
    />
  </Link>
);
