import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, DM_Sans } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Química Clean | Distribuidora Mayorista de Productos de Limpieza Argentina",
  description: "Distribuidora mayorista de productos de limpieza concentrados y materias primas para empresas y revendedores. Ubicados en Tucumán, Argentina. Envíos a todo el país.",
  keywords: "productos limpieza, concentrados, materias primas, mayorista, Tucumán, argentina, distribuidora, jabones, detergentes, desinfectantes",
  metadataBase: new URL("https://quimica-clean.com"),
  alternates: {
    canonical: "https://quimica-clean.com",
  },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "https://quimica-clean.com",
    title: "Química Clean | Productos de Limpieza Mayorista",
    description: "Distribuidora mayorista de productos de limpieza concentrados y materias primas. Envíos a todo Argentina.",
    siteName: "Química Clean",
  },
  twitter: {
    card: "summary_large_image",
    title: "Química Clean | Productos de Limpieza Mayorista",
    description: "Distribuidora mayorista de productos de limpieza concentrados y materias primas.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-AR">
      <head>
        <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${dmSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
