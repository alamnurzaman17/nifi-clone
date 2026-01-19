"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Monitor,
  LayoutTemplate,
  Users,
  LogOut,
} from "lucide-react";
import { Button } from "@heroui/react";
import Image from "next/image";

import { AuthProxy } from "@/features/auth/api/auth.proxy";
// import { useAuthStore } from "@/store/auth-store";

const Sidebar = () => {
  const pathname = usePathname(); // Hook untuk mendapatkan path URL saat ini
  // const user = useAuthStore((state) => state.user); // Mengambil data user dari global state (Dikomari sementara)

  // Konfigurasi item menu sidebar
  const menuItems = [
    {
      section: "Dashboard", // Nama bagian menu
      items: [
        {
          name: "Dashboard",
          icon: LayoutDashboard,
          path: "#", // Link placeholder sementara
        },
        { name: "Monitor", icon: Monitor, path: "#" },
        { name: "Design", icon: LayoutTemplate, path: "/dashboard/design" },
      ],
    },
    {
      section: "Management",
      items: [{ name: "User Management", icon: Users, path: "#" }],
    },
  ];

  // Fungsi untuk mengecek apakah item menu sedang aktif berdasarkan URL
  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + "/");
  };

  return (
    // Container Sidebar Utama (Fixed di kiri layar)
    <div className="h-screen w-64 bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0 z-50">
      {/* Bagian Logo Header */}
      <div className="p-6 flex items-center gap-3">
        <Image
          src="/logo/logo-icon.svg"
          alt="Logo"
          width={32}
          height={32}
          className="w-8 h-8"
        />
        <div>
          <h1 className="font-bold text-lg leading-tight tracking-wide text-gray-800">
            S.2.R.E
          </h1>
          <p className="text-[10px] font-bold tracking-[0.2em] text-gray-500">
            ADMIN
          </p>
        </div>
      </div>

      {/* Bagian Daftar Menu */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {menuItems.map((section, idx) => (
          <div key={idx}>
            {/* Judul Seksi Menu */}
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
              {section.section}
            </h3>
            {/* List Item Menu */}
            <ul className="space-y-1">
              {section.items.map((item) => {
                const active = isActive(item.path);
                return (
                  <li key={item.name}>
                    <Link
                      href={item.path}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        active
                          ? "bg-gray-200 text-gray-900" // Warna item aktif
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900" // Warna item tidak aktif
                      }`}
                    >
                      <item.icon size={18} />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Footer Sidebar (Tombol Logout) */}
      <div className="p-4 border-t border-gray-100 flex flex-col gap-3">
        <Button
          fullWidth
          variant="solid"
          className="bg-[#2c69a5] text-white font-medium rounded-2xl shadow-sm flex items-center justify-center gap-2"
          startContent={<LogOut size={18} />}
          onClick={() => AuthProxy.logout()} // Memanggil action logout
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
