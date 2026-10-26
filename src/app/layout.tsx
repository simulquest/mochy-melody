import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PlushVerse — Peluches vivantes, mutations & lootbox",
  description:
    "Quatre peluches 3D interactives (chat, dragon, lapin, fantôme) dont la fourrure réagit au toucher. Faites-les muter : yeux rares, pelages exceptionnels, et lootbox à peluches exclusives.",
  keywords: ["peluche", "fourrure", "interactive", "WebGL", "3D", "kawaii", "mutation", "lootbox"],
  openGraph: {
    title: "PlushVerse — Peluches vivantes, mutations & lootbox",
    description:
      "Quatre peluches vivantes à caresser et à faire muter. Compatible téléphone et ordinateur.",
    siteName: "PlushVerse",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
