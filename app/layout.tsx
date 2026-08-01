import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Perez Rough Framing | Contratista de framing en el Bay Area",
    template: "%s | Perez Rough Framing",
  },
  description:
    "Framing estructural residencial y comercial, ampliaciones y renovaciones en San Pablo y el Área de la Bahía. CSLB #1144949. Atención en español e inglés.",
  keywords: [
    "framing contractor San Pablo",
    "rough framing Bay Area",
    "structural framing",
    "residential framing",
    "commercial framing",
    "home additions",
    "Perez Rough Framing",
  ],
  openGraph: {
    title: "Perez Rough Framing",
    description:
      "Framing bien hecho, del plano a la estructura. Servicio en San Pablo y comunidades cercanas del Área de la Bahía.",
    type: "website",
    locale: "es_US",
    alternateLocale: "en_US",
    siteName: "Perez Rough Framing",
    url: "/",
    images: ["/assets/project-05.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Perez Rough Framing",
    description: "Framing residencial y comercial en el Área de la Bahía.",
    images: ["/assets/project-05.jpg"],
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    "theme-color": "#101513",
  },
  icons: {
    icon: "/assets/logo-mark.png",
    shortcut: "/assets/logo-mark.png",
    apple: "/assets/logo-mark.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
