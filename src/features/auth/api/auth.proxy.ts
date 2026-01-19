import { useAuthStore } from "@/store/auth-store";

export const AuthProxy = {
  // Fungsi untuk Mengecek apakah user memiliki token yang valid (sudah login)
  isAuthenticated: (): boolean => {
    // Pastikan kode hanya berjalan di sisi client (bukan server-side rendering)
    if (typeof window === "undefined") return false;

    // Ambil token dari store Zustand (yang tersimpan di localStorage via persist)
    const token = useAuthStore.getState().token;

    // Logika tambahan bisa ditambahkan di sini, misal cek waktu kedaluwarsa token JWT
    // Mengembalikan true jika token ada, false jika tidak
    return !!token;
  },

  // Fungsi untuk Menangani redirect jika akses ditolak (tidak terautentikasi)
  handleUnauthorized: () => {
    if (typeof window !== "undefined") {
      // 1. Hapus sesi login dari store
      useAuthStore.getState().logout();
      // 2. Hapus cookie auth (jika ada) - set tanggal kedaluwarsa ke masa lalu
      document.cookie =
        "auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      // 3. Redirect paksa ke halaman login dengan pesan expired
      window.location.href = "/auth/login?message=session_expired";
    }
  },

  // Proxy/Wrapper untuk fungsi login
  // Berguna untuk menyisipkan logika tambahan (interceptor) sebelum menyimpan state
  loginProxy: (email: string, name: string) => {
    // Simpan data ke store
    useAuthStore.getState().login(email, name);
    // Set cookie mock untuk kebutuhan middleware Next.js (opsional)
    document.cookie = `auth-token=mock-token; path=/; max-age=3600`;
  },

  // Fungsi Logout Proxy
  logout: () => {
    if (typeof window !== "undefined") {
      // Hapus state dari store
      useAuthStore.getState().logout();
      // Hapus cookie
      document.cookie =
        "auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      // Redirect ke login
      window.location.href = "/auth/login";
    }
  },
};
