import { redirect } from "next/navigation";

// Halaman Root (/)
export default function Home() {
  // Redirect otomatis dari root '/' ke halaman login '/auth/login'
  // Karena aplikasi ini membutuhkan autentikasi sejak awal
  redirect("/auth/login");
}
