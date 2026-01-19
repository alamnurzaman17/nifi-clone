import { create } from "zustand";
import { persist } from "zustand/middleware";

// Interface untuk data state Autentikasi
interface AuthState {
  user: { name: string; email: string } | null; // Data pengguna yang sedang login
  token: string | null; // Mock token JWT
  // Action login: menyimpan data user dan token
  login: (email: string, name: string) => void;
  // Action logout: menghapus data user dan token
  logout: () => void;
}

// Store Zustand untuk manajemen status Login (Auth)
// Menggunakan middleware 'persist' untuk menyimpan sesi login di localStorage
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null, // Default: belum login
      token: null, // Default: tidak ada token

      // Fungsi login simulasi
      login: (email, name) =>
        set({
          user: { name, email },
          token: "mock-jwt-token-" + Date.now(), // Generate token dummy
        }),

      // Fungsi logout
      logout: () => set({ user: null, token: null }),
    }),
    { name: "auth-storage" }, // Nama key di localStorage
  ),
);
