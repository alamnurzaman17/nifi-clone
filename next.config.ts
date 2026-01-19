import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      {
        source: "/",
        destination: "/auth/login",
        permanent: true, // Ubah ke true jika sudah yakin, false untuk testing agar tidak dicache browser
      },
    ];
  },
};

export default nextConfig;
