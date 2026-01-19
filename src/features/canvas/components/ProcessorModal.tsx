import {
  Modal,
  ModalContent,
  ModalBody,
  Button,
  Card,
  CardBody,
} from "@heroui/react";
import {
  Settings,
  Database,
  FileText,
  Server,
  HardDrive,
  Hash,
} from "lucide-react";
import { useState } from "react";

import { Processor } from "@/types/canvas";

interface ProcessorModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onAdd: (selectedProcessors: Processor[]) => void;
}

// Ensure Processor interface is NOT re-declared here

const CATEGORIES = ["All", "Standart", "SQL"];

// Data dummy prosesor yang tersedia
const PROCCESSORS: Processor[] = [
  {
    id: "1",
    name: "AppendHostInfo",
    description: "Appends host information...",
    icon: <Settings className="text-gray-900" />,
    category: "Standart",
  },
  {
    id: "2",
    name: "AttributesToJSON",
    description: "Generates a JSON repre...",
    icon: <Settings className="text-gray-900" />,
    category: "Standart",
  },
  {
    id: "3",
    name: "DefragmentText",
    description: "DefragmentText splits a...",
    icon: <Settings className="text-gray-900" />,
    category: "Standart",
  },
  {
    id: "4",
    name: "ExtractText",
    description: "Extracts the content of a...",
    icon: <Settings className="text-gray-900" />,
    category: "Standart",
  },
  {
    id: "5",
    name: "FetchFile",
    description: "Reads the contents of a ...",
    icon: <Settings className="text-gray-900" />,
    category: "Standart",
  },
  {
    id: "6",
    name: "GenerateFlowFile",
    description: "This processor creates F...",
    icon: <Settings className="text-gray-900" />,
    category: "Standart",
  },
  {
    id: "7",
    name: "GetFile",
    description: "Creates FlowFiles from fi...",
    icon: <Settings className="text-gray-900" />,
    category: "Standart",
  },
  {
    id: "8",
    name: "GetTCP",
    description: "Establishes a TCP Serve...",
    icon: <Settings className="text-gray-900" />,
    category: "Standart",
  },
  {
    id: "9",
    name: "HashContent",
    description: "HashContent calculates ...",
    icon: <Settings className="text-gray-900" />,
    category: "Standart",
  },
  {
    id: "10",
    name: "ListFile",
    description: "Retrieves a listing of file...",
    icon: <Settings className="text-gray-900" />,
    category: "Standart",
  },
];

// Komponen Modal untuk memilih dan menambahkan prosesor baru ke kanvas
export function ProcessorModal({
  isOpen,
  onOpenChange,
  onAdd,
}: ProcessorModalProps) {
  // State untuk melacak kategori yang sedang dipilih (filter)
  const [selectedCategory, setSelectedCategory] = useState("All");
  // State untuk menyimpan ID prosesor yang dipilih (bisa lebih dari satu)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Filter daftar prosesor berdasarkan kategori yang dipilih
  const filteredProcessors =
    selectedCategory === "All"
      ? PROCCESSORS
      : PROCCESSORS.filter((p) => p.category === selectedCategory);

  // Fungsi toggle seleksi prosesor (pilih/batal pilih)
  const toggleSelection = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  // Fungsi saat tombol Add ditekan
  const handleAdd = () => {
    // Ambil data prosesor penuh berdasarkan ID yang dipilih
    const selected = PROCCESSORS.filter((p) => selectedIds.has(p.id));
    onAdd(selected); // Kirim data ke parent component
    onOpenChange(false); // Tutup modal
    setSelectedIds(new Set()); // Reset seleksi
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="4xl"
      placement="center"
      className="bg-white rounded-xl"
      classNames={{
        backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
        base: "max-w-[900px] h-[600px]",
        closeButton: "hidden", // Sembunyikan tombol close bawaan
      }}
      scrollBehavior="inside"
    >
      <ModalContent className="p-0 overflow-hidden">
        {(onClose) => (
          <ModalBody className="p-0 flex flex-row gap-0 h-full">
            {/* Sidebar Kategori */}
            <div className="w-64 bg-[#F8FAFC] p-4 flex flex-col gap-2 border-r border-gray-200">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2.5 text-sm font-medium rounded-lg text-left transition-colors flex items-center gap-3 ${
                    selectedCategory === cat
                      ? "bg-[#E2E8F0] text-gray-900"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {cat === "All" && (
                    <span className="text-blue-500 text-xs">All</span>
                  )}
                  {cat === "Standart" && <Settings size={14} />}
                  {cat === "SQL" && <Database size={14} />}
                  <span className={cat === "All" ? "text-blue-600" : ""}>
                    {cat}
                  </span>
                </button>
              ))}
            </div>

            {/* Konten Utama (Grid Daftar Prosesor) */}
            <div className="flex-1 flex flex-col bg-white">
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  {filteredProcessors.map((proc) => {
                    const isSelected = selectedIds.has(proc.id);
                    return (
                      <Card
                        key={proc.id}
                        shadow="none"
                        isPressable
                        onPress={() => toggleSelection(proc.id)}
                        className={`border transition-all bg-white ${
                          isSelected
                            ? "border-[#2c69a5] bg-blue-50 ring-1 ring-[#2c69a5]"
                            : "border-gray-100 hover:border-blue-500 hover:bg-blue-50/30"
                        }`}
                      >
                        <CardBody className="flex flex-row items-center gap-4 p-4">
                          <div
                            className={`p-2 rounded-lg ${isSelected ? "bg-[#2c69a5] text-white" : "bg-gray-50 text-gray-900"}`}
                          >
                            {proc.icon}
                          </div>
                          <div className="text-left">
                            <h3
                              className={`text-sm font-bold ${isSelected ? "text-[#2c69a5]" : "text-gray-900"}`}
                            >
                              {proc.name}
                            </h3>
                            <p className="text-xs text-gray-500 line-clamp-1">
                              {proc.description}
                            </p>
                          </div>
                        </CardBody>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* Area Footer (Tombol Add) */}
              <div className="p-4 border-t border-gray-100 flex justify-end">
                <Button
                  className="bg-[#2c69a5] text-white px-6 font-medium rounded-lg"
                  size="sm"
                  onPress={handleAdd}
                >
                  Add ({selectedIds.size})
                </Button>
              </div>
            </div>
          </ModalBody>
        )}
      </ModalContent>
    </Modal>
  );
}
