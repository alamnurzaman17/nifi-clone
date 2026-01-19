"use client";

import AuthGuard from "@/features/auth/components/AuthGuard";
import Sidebar from "@/features/dashboard/components/Sidebar";
import { usePathname } from "next/navigation";

// Layout untuk Bagian Dashboard (dilindungi autentikasi)
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // Cek apakah halaman saat ini adalah canvas
  // Jika ya, kita akan menyembunyikan sidebar agar canvas bisa fullscreen
  const isCanvasPage = pathname?.includes("/canvas");

  return (
    // Bungkus semua konten dashboard dengan AuthGuard untuk keamanan
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar hanya muncul jika bukan di halaman canvas */}
        {!isCanvasPage && <Sidebar />}

        {/* Konten Utama */}
        <div
          className={`flex-1 ${
            !isCanvasPage ? "ml-64" : "" // Beri margin kiri jika sidebar ada
          } flex flex-col min-w-0`}
        >
          <main className={`flex-1 ${!isCanvasPage ? "p-8" : "p-0"}`}>
            {/* Render halaman spesifik di sini */}
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
