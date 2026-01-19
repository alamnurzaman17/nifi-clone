import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Konfigurasi Font Geist Sans
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Konfigurasi Font Geist Mono
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadata Global untuk aplikasi (SEO & Judul tab browser)
export const metadata: Metadata = {
  title: "Nifi Clone",
  description: "Nifi clone for frontend test assesment Alam Nurzaman",
};

import { Providers } from "./providers";

// Root Layout: Layout dasar untuk seluruh halaman aplikasi
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        // Menerapkan font variable dan CSS global
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Bungkus seluruh aplikasi dengan Provider global */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
