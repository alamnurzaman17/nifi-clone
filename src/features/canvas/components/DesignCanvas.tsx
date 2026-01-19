"use client";

import React, { useRef, useCallback, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  Connection,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useFlowStore } from "@/store/flow-store";
import { ProcessorNode } from "./ProcessorNode";
import { useDisclosure } from "@heroui/react";
import { CreateConnectionModal } from "./CreateConnectionModal";
import CustomEdge from "./CustomEdge";

// Mendaftarkan tipe node kustom agar dikenali oleh ReactFlow
const nodeTypes = {
  processor: ProcessorNode,
};

// Mendaftarkan tipe edge kustom
const edgeTypes = {
  custom: CustomEdge,
};

// Komponen Utama DesignCanvas: Area kerja untuk membuat diagram alur
export default function DesignCanvas() {
  // Mengambil state dan fungsi dari store (Zustand)
  const {
    nodes, // Daftar node yang ada di kanvas
    edges, // Daftar koneksi antar node
    onNodesChange, // Handler untuk perubahan node (posisi, seleksi, dll)
    onEdgesChange, // Handler untuk perubahan edge
    onConnect, // Handler dasar saat koneksi terjadi
    onNodesDelete, // Handler saat node dihapus
  } = useFlowStore();

  // State sementara untuk menyimpan koneksi sebelum dikonfirmasi lewat modal
  const [pendingConnection, setPendingConnection] = useState<Connection | null>(
    null,
  );

  // Hook untuk mengontrol status buka/tutup modal koneksi
  const {
    isOpen: isConnectionOpen,
    onOpen: onConnectionOpen,
    onOpenChange: onConnectionOpenChange,
  } = useDisclosure();

  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  // Fungsi Wrapper untuk menangani event onConnect
  // Digunakan untuk validasi dan memicu modal sebelum koneksi benar-benar dibuat
  const onConnectWrapper = useCallback(
    (connection: Connection) => {
      // Mencegah koneksi ke diri sendiri (loopback)
      if (connection.source === connection.target) return;

      // Simpan data koneksi sementara dan buka modal konfirmasi
      setPendingConnection(connection);
      onConnectionOpen();
    },
    [onConnectionOpen],
  );

  // Handler saat konfirmasi koneksi dari modal diterima
  const handleConnectionConfirm = (relationship: string) => {
    if (!pendingConnection) return;

    // Buat edge baru dengan properti kustom (warna, panah, label)
    const newEdge = {
      ...pendingConnection,
      type: "custom", // Gunakan komponen CustomEdge
      markerEnd: {
        type: MarkerType.ArrowClosed, // Ujung panah tertutup
        color: "#2c69a5", // Warna panah
      },
      style: {
        strokeWidth: 2,
        stroke: "#2c69a5", // Warna garis
      },
      data: {
        label: relationship, // Label hubungan (misal: "Success", "Failure")
      },
    };

    // Simpan koneksi ke store
    onConnect(newEdge as unknown as Connection);
    setPendingConnection(null); // Reset state
  };

  return (
    <>
      {/* Container utama ReactFlow */}
      <div className="w-full h-full bg-[#F8FAFC]" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnectWrapper} // Gunakan wrapper kita
          onNodesDelete={onNodesDelete}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes} // Register edge kustom
          fitView // Agar tampilan otomatis pas di tengah saat dimuat
          defaultEdgeOptions={{
            type: "custom",
          }}
        >
          {/* Latar belakang grid bintik-bintik */}
          <Background color="#E2E8F0" gap={16} size={1} />
          {/* Kontrol navigasi (zoom, fit view, dll) dengan styling kustom */}
          <Controls className="bg-white border border-gray-200 shadow-sm !m-4 rounded-lg overflow-hidden [&>button]:!border-0 [&>button]:!bg-white [&>button]:!text-black [&_svg]:!fill-black [&_path]:!fill-black hover:[&>button]:bg-gray-50 [&>button]:transition-colors" />
        </ReactFlow>
      </div>

      {/* Modal untuk memilih jenis hubungan saat menghubungkan node */}
      <CreateConnectionModal
        isOpen={isConnectionOpen}
        onOpenChange={onConnectionOpenChange}
        onConfirm={handleConnectionConfirm}
      />
    </>
  );
}
