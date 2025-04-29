import "../styles/globals.css";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { cn } from "@/lib/utils";
import { ReactNode } from "react"; // 👈 Import ReactNode for typing

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Your Portfolio",
  description: "Award-winning digital experience",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  // 👈 Add explicit type
  return (
    <html lang="en">
      <body className={cn(inter.className, "m-0 p-0")}>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
