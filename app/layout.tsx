import type { Metadata } from "next";
import { Suspense } from "react";
import { Schibsted_Grotesk, Martian_Mono, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import ParticleBackground from "@/components/ParticleBackground.tsx";
import NavbarWrapper from "./NavbarWrapper";
import { PostHogProvider } from "./providers";
import { ClerkProvider } from "@clerk/nextjs";
import Footer from "@/components/Footer";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const schibstedGrotesk = Schibsted_Grotesk({
  variable: "--font-schibsted-grotesk",
  subsets: ["latin"],
});

const martianMono = Martian_Mono({
  variable: "--font-martian-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dev Events — Discover Developer Events",
  description: "The hub for every dev event you mustn't miss",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={cn(
          "min-h-screen",
          "antialiased",
          schibstedGrotesk.variable,
          martianMono.variable,
          "font-sans",
          geist.variable
        )}
      >
        <body className="min-h-screen relative">
          {/* Animated Background */}
          <ParticleBackground />

          {/* Ambient gradient orbs */}
          <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] animate-pulse-slow" />
            <div className="absolute top-1/2 -right-40 w-80 h-80 bg-cyan-600/8 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: "2s" }} />
            <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-purple-600/8 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: "4s" }} />
          </div>

          <PostHogProvider>
            <Suspense
              fallback={
                <header className="glass sticky top-0 z-50">
                  <nav className="flex items-center justify-between mx-auto container sm:px-10 px-5 py-4">
                    <div className="flex items-center gap-2 opacity-50">
                      <span className="text-xl font-bold italic text-white">Dev Events</span>
                    </div>
                  </nav>
                </header>
              }
            >
              <NavbarWrapper />
            </Suspense>

            <main className="relative z-10">{children}</main>

            <Footer />
          </PostHogProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}