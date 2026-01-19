import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  Connection,
  NodeChange,
  EdgeChange,
} from "@xyflow/react";

// Interface untuk mendefinisikan bentuk data state Flow
interface FlowState {
  nodes: Node[]; // Array untuk menyimpan semua node dalam kanvas
  edges: Edge[]; // Array untuk menyimpan semua koneksi (edge) dalam kanvas
  versionData: Record<string, { nodes: Node[]; edges: Edge[] }>; // Penyimpanan data berdasarkan versi
  currentVersion: string; // Versi yang sedang aktif saat ini

  // Handlers untuk ReactFlow
  onNodesChange: OnNodesChange; // Dipanggil saat ada perubahan pada node (drag, select, dll)
  onEdgesChange: OnEdgesChange; // Dipanggil saat ada perubahan pada edge
  onConnect: OnConnect; // Dipanggil saat user menghubungkan dua node
  onNodesDelete: (nodes: Node[]) => void; // Dipanggil saat node dihapus

  // Actions manual
  addNode: (node: Node) => void; // Menambahkan satu node baru
  setNodes: (nodes: Node[]) => void; // Mengganti seluruh daftar node
  setEdges: (edges: Edge[]) => void; // Mengganti seluruh daftar edge
  setVersion: (version: string) => void; // Mengganti versi aktif dan memuat datanya
}

// Store Zustand untuk manajemen state Flow Diagram
export const useFlowStore = create<FlowState>()(
  persist(
    (set, get) => ({
      nodes: [],
      edges: [],
      versionData: {},
      currentVersion: "0.1", // Versi awal default

      // Handler perubahan node: menggunakan helper applyNodeChanges dari ReactFlow
      onNodesChange: (changes: NodeChange[]) => {
        set({ nodes: applyNodeChanges(changes, get().nodes) });
      },

      // Handler perubahan edge: menggunakan helper applyEdgeChanges dari ReactFlow
      onEdgesChange: (changes: EdgeChange[]) => {
        set({ edges: applyEdgeChanges(changes, get().edges) });
      },

      // Handler saat koneksi dibuat: mencegah loopback ke diri sendiri
      onConnect: (connection: Connection) => {
        if (connection.source === connection.target) return;
        set({ edges: addEdge(connection, get().edges) });
      },

      // Handler saat node dihapus: otomatis hapus edge yang terhubung ke node tersebut
      onNodesDelete: (deleted: Node[]) => {
        set({
          edges: get().edges.filter(
            (edge) =>
              !deleted.some(
                (node) => node.id === edge.source || node.id === edge.target,
              ),
          ),
        });
      },

      addNode: (node: Node) => set({ nodes: [...get().nodes, node] }),
      setNodes: (nodes: Node[]) => set({ nodes }),
      setEdges: (edges: Edge[]) => set({ edges }),

      // Fungsi untuk berpindah versi
      setVersion: (version: string) => {
        const { currentVersion, nodes, edges, versionData } = get();

        // 1. Simpan state saat ini ke versi lama sebelum pindah
        const updatedVersionData = {
          ...versionData,
          [currentVersion]: { nodes, edges },
        };

        // 2. Muat state untuk versi baru (atau kosong jika versi belum ada)
        const nextState = updatedVersionData[version] || {
          nodes: [],
          edges: [],
        };

        // 3. Update state global dengan data versi baru
        set({
          currentVersion: version,
          versionData: updatedVersionData,
          nodes: nextState.nodes,
          edges: nextState.edges,
        });
      },
    }),
    {
      name: "flow-storage", // Nama kunci penyimpanan di localStorage
    },
  ),
);
