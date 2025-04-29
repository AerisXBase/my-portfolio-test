import "../styles/globals.css";
import { Inter } from "next/font/google";

import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Your Portfolio",
  description: "Award-winning digital experience",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "m-0 p-0")}>{children}</body>
    </html>
  );
}
