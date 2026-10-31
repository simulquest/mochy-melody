import type { Metadata } from "next";
import { Baloo_2, Geist_Mono, Nunito } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import ThemeDelights from "@/components/theme/ThemeDelights";
import { getSiteTheme } from "@/lib/theme-server";

// Le thème est relu à chaque requête depuis config.json : édition du fichier
// + refresh → nouveau thème. On interdit donc le rendu statique.
export const dynamic = "force-dynamic";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

const baloo = Baloo_2({
  variable: "--font-baloo-2",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mochy Melody",
  description:
    "Quatre peluches 3D interactives (chat, dragon, lapin, fantôme) dont la fourrure réagit au toucher. Faites-les muter : yeux rares, pelages exceptionnels, et lootbox à peluches exclusives.",
  keywords: ["peluche", "fourrure", "interactive", "WebGL", "3D", "kawaii", "mutation", "lootbox"],
  openGraph: {
    title: "Mochy Melody",
    description:
      "Quatre peluches vivantes à caresser et à faire muter. Compatible téléphone et ordinateur.",
    siteName: "Mochy Melody",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = getSiteTheme();
  return (
    <html lang="fr" data-theme={theme} suppressHydrationWarning>
      <body
        className={`${nunito.variable} ${baloo.variable} ${geistMono.variable} font-sans antialiased bg-background text-foreground`}
      >
        <ThemeProvider theme={theme}>
          <ThemeDelights />
          {children}
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
