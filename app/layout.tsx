import type { Metadata, Viewport } from "next";
// Swapping the display face is a one-line change here: `Instrument_Serif`
// (finer, more display) or `Newsreader` (more readable) both drop straight in.
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import { MotionProvider } from "./components/MotionProvider";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { site } from "@/data/site";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  // Loaded as a variable font: next/font rejects `axes` alongside a static
  // `weight` list, and variable gives us the full 400–700 range in one file.
  axes: ["opsz"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${site.name} — ${site.role}`,
    template: `%s — ${site.name}`,
  },
  description: site.tagline,
  openGraph: {
    title: `${site.name} — ${site.role}`,
    description: site.tagline,
    type: "website",
    locale: "pt_BR",
  },
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#F6F2EA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${fraunces.variable} ${inter.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="bg-bg text-ink flex min-h-full flex-col">
        <a
          href="#main"
          className="bg-sea sr-only rounded-md px-4 py-2 font-mono text-sm text-white focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50"
        >
          Pular para o conteúdo
        </a>
        <MotionProvider>
          <Navbar />
          {children}
          <Footer />
        </MotionProvider>
      </body>
    </html>
  );
}
