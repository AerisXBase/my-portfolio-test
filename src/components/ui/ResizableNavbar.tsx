"use client";
import { cn } from "@/lib/utils";
import { IconMenu2, IconX } from "@tabler/icons-react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "motion/react";
import Image from "next/image";
import Link from "next/link";
import React, { useRef, useState } from "react";

// Interfaces...
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
  visible?: boolean;
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
  const { scrollY } = useScroll({ target: ref });
  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setVisible(latest > 100);
  });

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

export const NavBody = ({ children, className, visible }: NavBodyProps) => (
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
      "relative z-[60] mx-auto hidden w-full max-w-7xl flex-row items-center justify-between self-start px-4 lg:px-16 lg:flex",
      !visible
        ? "mt-4 rounded-full bg-gradient-to-r from-white via-gray-100 to-gray-300 shadow-lg backdrop-blur-md dark:bg-white/10"
        : "rounded-full bg-gradient-to-r from-cyan-700/50 via-purple-800/50 to-indigo-900/50",
      className
    )}
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

export const NavItems = ({
  items,
  className,
  onItemClick,
  visible,
}: NavItemsProps) => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <motion.div
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "absolute inset-0 hidden flex-1 items-center justify-center space-x-4 lg:flex",
        "text-sm font-medium",
        visible ? "text-white" : "text-black/90",
        className
      )}
    >
      {items.map((item, idx) => (
        <a
          key={idx}
          href={item.link}
          onMouseEnter={() => setHovered(idx)}
          onClick={onItemClick}
          className="relative px-4 py-2"
        >
          {hovered === idx && (
            <motion.div
              layoutId="hovered"
              className="absolute inset-0 rounded-full bg-black/20 dark:bg-neutral-300"
            />
          )}
          <span className="relative z-10">{item.name}</span>
        </a>
      ))}
    </motion.div>
  );
};

export const MobileNav = ({ children, className, visible }: MobileNavProps) => (
  <motion.div
    animate={{
      backdropFilter: visible ? "blur(10px)" : "none",
      boxShadow: visible ? "0 0 24px rgba(34, 42, 53, 0.06)" : "none",
      y: visible ? 20 : 0,
    }}
    transition={{ type: "spring", stiffness: 200, damping: 50 }}
    className={cn(
      "relative z-50 mx-auto flex w-full max-w-[calc(100vw-2rem)] flex-col items-center justify-between px-6 lg:hidden",
      visible ? "bg-white/90 dark:bg-black/80" : "bg-white dark:bg-black/80",
      className
    )}
  >
    {children}
  </motion.div>
);

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
          "rounded-lg absolute inset-x-0 top-16 z-50 flex w-full flex-col items-center gap-4 bg-white px-4 py-6 shadow-lg dark:bg-black/90",
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
      isOpen ? "bg-white text-black" : "bg-transparent text-white"
    )}
  >
    {isOpen ? <IconX size={24} /> : <IconMenu2 size={24} />}
  </button>
);

export const NavbarLogo = () => (
  <Link href="/" className="relative z-20 flex items-center px-2">
    <Image src="/images/logo/logo-4.png" alt="logo" width={40} height={40} />
  </Link>
);

interface NavbarButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string; // <== this must exist
  variant?: "primary" | "secondary" | "dark" | "gradient";
  visible?: boolean;
  onClickAction?: () => void;
}

export const NavbarButton: React.FC<NavbarButtonProps> = ({
  href,
  children,
  className,
  variant = "primary",
  visible = true,
  onClickAction,
}) => {
  if (!visible) return null;

  const baseStyles =
    "px-4 py-2 rounded-full bg-white text-black/60 text-sm font-bold relative cursor-pointer transition-transform duration-300 hover:-translate-y-1 inline-block text-center";

  const variantStyles: Record<string, string> = {
    primary: "shadow-lg",
    secondary: "bg-transparent shadow-none dark:text-white",
    dark: "bg-black text-white",
    gradient: "bg-gradient-to-b from-blue-500 to-blue-700 text-white",
  };

  return (
    <a
      href={href}
      onClick={onClickAction}
      className={`${baseStyles} ${variantStyles[variant]} ${className ?? ""}`}
    >
      {children}
    </a>
  );
};
