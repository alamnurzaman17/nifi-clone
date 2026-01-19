import { ReactNode } from "react";

// Interface untuk data Prosesor (Processor) yang digunakan di aplikasi
export interface Processor {
  id: string; // ID unik prosesor
  name: string; // Nama tampilan prosesor
  description: string; // Deskripsi singkat fungsi prosesor
  icon: ReactNode; // Elemen ikon React untuk representasi visual
  category: string; // Kategori prosesor (misal: "Standart", "SQL")
}
