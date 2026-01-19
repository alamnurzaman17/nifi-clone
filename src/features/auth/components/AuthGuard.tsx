"use client";

import { useEffect, useState } from "react";
import { AuthProxy } from "@/features/auth/api/auth.proxy";
import { useRouter, usePathname } from "next/navigation";
import { Spinner } from "@heroui/react";

// Komponen AuthGuard: Melindungi rute/halaman yang membutuhkan autentikasi
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  // State untuk mengontrol apakah konten halaman boleh ditampilkan
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Fungsi pengecekan status login
    const checkAuth = () => {
      const authStatus = AuthProxy.isAuthenticated(); // Cek token/sesi
      const isAuthPage = pathname.startsWith("/auth"); // Cek apakah halaman login/register

      if (!authStatus && !isAuthPage) {
        // Jika belum login dan mencoba akses halaman terproteksi -> Redirect ke Login
        AuthProxy.handleUnauthorized();
      } else if (authStatus && isAuthPage) {
        // Jika sudah login tapi akses halaman login -> Redirect ke Dashboard
        router.push("/dashboard/design");
      } else {
        // Jika status valid (sudah login di dashboard, atau belum login di auth page)
        setIsAuthorized(true);
      }
    };

    checkAuth();
  }, [pathname, router]);

  // Tampilkan loading spinner selama proses pengecekan sesi
  if (!isAuthorized) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Spinner size="lg" label="Checking session..." />
      </div>
    );
  }

  // Jika lolos pengecekan, render halaman anak (children)
  return <>{children}</>;
}
