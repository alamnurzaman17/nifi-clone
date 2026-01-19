"use client";
import { HeroUIProvider } from "@heroui/react";
import { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

// Komponen Providers: Pembungkus untuk context global aplikasi
export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    // HeroUIProvider: Context untuk styling komponen UI library
    // navigate={router.push}: Integrasi routing HeroUI dengan Next.js
    <HeroUIProvider navigate={router.push}>
      {children}
      {/* Toaster: Komponen notifikasi global (pojok kanan atas) */}
      <Toaster position="top-right" />
    </HeroUIProvider>
  );
}
