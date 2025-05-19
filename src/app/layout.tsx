import "../styles/globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "next-themes";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

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
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, "m-0 p-0")}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
