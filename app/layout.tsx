import type { Metadata } from "next";
import { DM_Sans, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
});

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-instrument",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: {
    default: "Escritorios Elevables — Analisis y Comparativas",
    template: "%s — Escritorios Elevables",
  },
  description:
    "Encuentra tu escritorio elevable ideal. Comparativas, analisis y herramientas interactivas basadas en datos reales.",
  metadataBase: new URL("https://escritorioaltura.es"),
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: "Escritorios Elevables",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${dmSans.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`}
    >
      <body className="grain min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
