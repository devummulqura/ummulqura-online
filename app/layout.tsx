import type { Metadata } from "next";
import { Poppins, Amiri } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

const amiri = Amiri({
  variable: "--font-heading",
  weight: ["400", "700"],
  subsets: ["arabic", "latin"],
});

export const metadata: Metadata = {
  title: "Ummul | Modern Islamic Institute",
  description: "A premium modern Islamic educational institution offering comprehensive Islamic education.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${amiri.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-islamic-pattern font-sans text-foreground">
        <TooltipProvider>
          {children}
        </TooltipProvider>
      </body>
    </html>
  );
}
