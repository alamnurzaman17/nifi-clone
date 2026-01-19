import React from "react";

// Interface untuk properti tombol alat (ToolButton)
interface ToolButtonProps {
  icon: React.ReactNode; // Ikon yang akan ditampilkan
  label: string; // Teks label di bawah ikon
  onClick?: () => void; // Fungsi callback saat tombol diklik
  className?: string; // Class CSS tambahan opsional untuk kustomisasi
}

// Komponen Reuseable: Tombol dengan ikon dan label, bergaya kartu kecil
// Biasa digunakan di toolbar atau panel aksi cepat
export function ToolButton({
  icon,
  label,
  onClick,
  className = "",
}: ToolButtonProps) {
  return (
    <button
      onClick={onClick}
      // Styling dasar: Flex column, rounded border, efek hover bayangan & angkat sedikit
      className={`flex flex-col items-center justify-center bg-white border border-gray-200 rounded-xl w-20 h-20 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all gap-2 group ${className}`}
    >
      {/* Container Ikon: Berubah warna saat grup di-hover */}
      <div className="text-blue-900 group-hover:text-blue-700">{icon}</div>
      {/* Label Teks */}
      <span className="text-xs font-medium text-gray-700">{label}</span>
    </button>
  );
}
