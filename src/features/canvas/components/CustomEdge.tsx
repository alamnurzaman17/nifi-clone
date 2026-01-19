import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
  useReactFlow,
} from "@xyflow/react";
import React from "react";
import { Settings, X } from "lucide-react";

// Komponen CustomEdge: Menampilkan garis koneksi dengan label kustom dan tombol hapus
export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}: EdgeProps) {
  const { deleteElements } = useReactFlow(); // Hook untuk memanipulasi elemen flow

  // Menghitung path kurva Bezier untuk garis koneksi
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // Handler untuk menghapus koneksi saat tombol 'X' diklik
  const onEdgeClick = (evt: React.MouseEvent) => {
    evt.stopPropagation(); // Mencegah event bubbling
    deleteElements({ edges: [{ id }] }); // Hapus edge berdasarkan ID
  };

  return (
    <>
      {/* Menggambar garis dasar koneksi */}
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />

      {/* Merender label koneksi di atas garis */}
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            pointerEvents: "all",
          }}
          className="nodrag nopan group" // Class 'nodrag' agar area ini tidak memicu drag pada kanvas
        >
          {/* Kontainer Label Styled */}
          <div className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-full shadow-sm border border-blue-200 transition-all hover:ring-2 hover:ring-blue-100">
            {/* Ikon Settings Kecil */}
            <div className="bg-[#2c69a5] p-1 rounded-full">
              <Settings size={10} className="text-white" />
            </div>

            {/* Teks Label (Nama Koneksi) */}
            <span className="text-[#2c69a5] font-medium text-xs">
              Name : {data?.label as string}
            </span>

            {/* Tombol Hapus Koneksi (Muncul saat hover/terlihat) */}
            <button
              className="ml-1 p-0.5 rounded-full hover:bg-red-100 text-gray-400 hover:text-red-500 transition-colors"
              onClick={onEdgeClick}
            >
              <X size={12} />
            </button>
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
