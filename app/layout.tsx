import type { Metadata } from "next";
import Script from "next/script";
import { Inter, Inter_Tight } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ORGANIZACION } from "@/lib/schema";

const GA_ID = "G-DYSVBYSJN7";

// Tema «Ficha técnica»: Inter para el cuerpo e Inter Tight para los
// titulares (app/globals.css, al final).
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter-tight",
});

export const metadata: Metadata = {
  title: {
    default: "Escritorios elevables 2026: comparativa y guía de compra — Elevable",
    template: "%s — Elevable",
  },
  description:
    "Qué escritorio elevable comprar en 2026: comparativa por especificaciones de fabricante, franjas de precio con fecha de verificación y herramientas para elegir.",
  metadataBase: new URL("https://elevable.es"),
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: "Elevable",
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
      className={`${inter.variable} ${interTight.variable}`}
    >
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>
      </head>
      <body className="min-h-screen flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  name: "Elevable",
                  url: "https://elevable.es",
                  inLanguage: "es-ES",
                  publisher: { "@id": ORGANIZACION["@id"] },
                },
                ORGANIZACION,
              ],
            }),
          }}
        />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
