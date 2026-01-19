import { Handle, Position, NodeProps } from "@xyflow/react";
import { Settings } from "lucide-react";

// Komponen ProcessorNode: Representasi visual dari sebuah node prosesor di kanvas
export function ProcessorNode({ data, selected }: NodeProps) {
  return (
    // Container utama node dengan styling dinamis berdasarkan status selected
    <div
      className={`bg-white rounded-lg shadow-sm border p-4 w-[200px] flex flex-col items-center gap-2 transition-all ${
        selected ? "border-blue-500 ring-2 ring-blue-500/20" : "border-gray-200"
      }`}
    >
      {/* Icon Node */}
      <div className="w-10 h-10 bg-gray-50 rounded flex items-center justify-center text-gray-900 mb-1">
        {data.icon && typeof data.icon === "string" ? (
          <span className="text-xs">{data.icon.substring(0, 2)}</span>
        ) : (
          <Settings size={20} />
        )}
      </div>

      {/* Label Node */}
      <span className="text-xs font-bold text-gray-900 text-center">
        {data.label as string}
      </span>

      {/* Handle Input (Target) - Titik koneksi masuk di sebelah kiri */}
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !-left-1.5 !bg-gray-200 !border-2 !border-white"
      />

      {/* Handle Output (Source) - Titik koneksi keluar di sebelah kanan */}
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !-right-1.5 !bg-gray-200 !border-2 !border-white"
      />
    </div>
  );
}
