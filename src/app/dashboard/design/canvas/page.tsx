"use client";

import { Button, Select, SelectItem } from "@heroui/react";
import {
  ArrowLeft,
  Edit2,
  Flag,
  FileUp,
  Filter,
  Share2,
  Settings,
  Database,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect } from "react";
import toast from "react-hot-toast";
import { useDisclosure } from "@heroui/react";
import { ToolButton } from "@/components/ui/ToolButton";
import { ProcessorModal } from "@/features/canvas/components/ProcessorModal";
import { PublishDesignModal } from "@/features/dashboard/components/PublishDesignModal";
import { Processor } from "@/types/canvas";
import DesignCanvas from "@/features/canvas/components/DesignCanvas";
import { useFlowStore } from "@/store/flow-store";

// Komponen Konten Halaman Design Canvas
// Dipisahkan agar bisa dibungkus Suspense (karena menggunakan useSearchParams)
function DesignCanvasContent() {
  const router = useRouter(); // Hook navigasi
  const searchParams = useSearchParams();
  const version = searchParams.get("version"); // Mengambil parameter versi dari URL
  // Mengambil action dan state dari store global flow
  const { addNode, setVersion, nodes, edges } = useFlowStore();

  // Sinkronisasi versi saat halaman dimuat atau parameter berubah
  useEffect(() => {
    if (version) {
      setVersion(version);
    }
  }, [version, setVersion]);

  // Kontrol modal untuk menambah prosesor
  const {
    isOpen: isProcessorOpen,
    onOpen: onProcessorOpen,
    onOpenChange: onProcessorOpenChange,
  } = useDisclosure();

  // Callback saat prosesor dipilih dari modal untuk ditambahkan ke kanvas
  const handleAddProcessors = useCallback(
    (selectedProcessors: Processor[]) => {
      selectedProcessors.forEach((proc, index) => {
        // Membuat objek node baru
        const newNode = {
          id: `node_${Date.now()}_${index}`,
          type: "processor",
          // Posisi di-stagger (berjenjang) agar tidak menumpuk persis di satu titik
          position: { x: 100 + index * 50, y: 100 + index * 50 },
          data: { label: proc.name, icon: proc.icon },
        };
        addNode(newNode); // Simpan ke store
      });
    },
    [addNode],
  );

  // Handler saat tombol Publish diklik
  const handlePublishClick = () => {
    // 1. Validasi Dasar: Cek apakah kanvas kosong
    if (nodes.length === 0) {
      toast.error(
        "Cannot publish an empty design. Please add at least one processor.",
      );
      return;
    }
    // Jika valid, buka modal publikasi lanjutan
    onPublishModalOpen();
  };

  // Handler finalisasi publikasi (dieksekusi saat konfirmasi di modal publikasi)
  const handleFinalPublish = () => {
    // Simulasi proses async publikasi dengan toast loading
    toast.promise(new Promise((resolve) => setTimeout(resolve, 2000)), {
      loading: "Publishing design...",
      success: "Design Flow Published Successfully",
      error: "Failed to publish design.",
    });
  };

  // Kontrol modal publikasi
  const {
    isOpen: isPublishModalOpen,
    onOpen: onPublishModalOpen,
    onOpenChange: onPublishModalOpenChange,
  } = useDisclosure();

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header Halaman */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <Button
            isIconOnly
            variant="light"
            onPress={() => router.back()}
            className="text-gray-600 hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
          </Button>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-gray-800">Design Mode</h1>
            <Edit2
              size={16}
              className="text-gray-400 cursor-pointer hover:text-gray-600"
            />
          </div>
        </div>
      </header>

      {/* Area Konten Utama */}
      <div className="flex-1 flex flex-col relative bg-[#F8FAFC]">
        {/* Background Pattern (Titik-titik) */}
        <div
          className="absolute inset-0 z-0 pointer-events-none opacity-40"
          style={{
            backgroundImage: "radial-gradient(#CBD5E1 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Toolbar Atas (Floating) */}
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-6 py-4 pointer-events-none">
          {/* Kontrol Versi (Kiri) */}
          <div className="flex items-center gap-3 pointer-events-auto">
            <div className="flex items-center bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
              <span className="text-sm text-gray-500 pl-3 pr-2">Version</span>
              <span className="text-sm font-semibold text-gray-900 mr-2">
                {version || "0.1"}
              </span>
              {/* Mockup Trigger Dropdown */}
              <button className="text-gray-400 hover:text-gray-600">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
            </div>
            <Button
              isIconOnly
              variant="flat"
              className="bg-white border border-gray-200 shadow-sm rounded-lg text-gray-600"
            >
              <Flag size={18} className="ml-2.5" />
            </Button>
          </div>

          {/* Tools Menu (Kanan) */}
          <div className="flex items-center gap-3 pointer-events-auto">
            <ToolButton icon={<Settings size={18} />} label="Parameter" />
            <ToolButton icon={<Filter size={18} />} label="Funnel" />
            <ToolButton icon={<Database size={18} />} label="RPG" />
            <ToolButton
              icon={<Settings size={18} />}
              label="Processor"
              onClick={onProcessorOpen} // Buka modal tambah prosesor
            />
            <ToolButton icon={<FileUp size={18} />} label="Export" />
            <ToolButton
              icon={<Share2 size={18} />}
              label="Publish"
              onClick={handlePublishClick} // Trigger publikasi
            />
          </div>
        </div>

        {/* Area Kanvas ReactFlow */}
        <div className="flex-1 w-full h-full relative z-0">
          <DesignCanvas />
        </div>

        {/* Footer info last update */}
        <div className="absolute bottom-0 right-0 z-10 px-6 py-2 flex justify-end pointer-events-none">
          <span className="text-xs text-gray-400 pointer-events-auto">
            Last Update : 6/24/2024
          </span>
        </div>
      </div>

      {/* Modal - Modal Tambahan */}
      <ProcessorModal
        isOpen={isProcessorOpen}
        onOpenChange={onProcessorOpenChange}
        onAdd={handleAddProcessors}
      />

      <PublishDesignModal
        isOpen={isPublishModalOpen}
        onOpenChange={onPublishModalOpenChange}
        nodes={nodes}
        edges={edges}
        onPublish={handleFinalPublish}
      />
    </div>
  );
}

// Halaman Utama Design Canvas
// Menggunakan Suspense boundary karena komponen child menggunakan searchParams
export default function DesignCanvasPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DesignCanvasContent />
    </Suspense>
  );
}
