import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Chip,
} from "@heroui/react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { useState } from "react";
import { Node, Edge } from "@xyflow/react";

// Interface properti untuk Modal Publikasi Desain
interface PublishDesignModalProps {
  isOpen: boolean; // Status visibilitas modal
  onOpenChange: () => void; // Fungsi toggle visibilitas
  nodes: Node[]; // Data node yang akan dipublikasikan (untuk preview JSON)
  edges: Edge[]; // Data koneksi yang akan dipublikasikan
  onPublish: () => void; // Fungsi callback saat publikasi dikonfirmasi
}

// Komponen Modal untuk memvalidasi dan mempublikasikan desain flow
export function PublishDesignModal({
  isOpen,
  onOpenChange,
  nodes,
  edges,
  onPublish,
}: PublishDesignModalProps) {
  // State untuk melacak langkah wizard modal: 'review' (validasi) atau 'confirm' (konfirmasi akhir)
  const [step, setStep] = useState<"review" | "confirm">("review");
  // State indikator apakah validasi sudah sukses
  const [isValidated, setIsValidated] = useState(false);
  // State loading saat proses validasi berjalan
  const [isValidating, setIsValidating] = useState(false);

  // Handler wrapper untuk onOpenChange agar bisa reset state saat tutup
  const handleOpenChange = () => {
    if (isOpen) {
      // Jika sedang terbuka dan akan ditutup -> Reset state
      setStep("review");
      setIsValidated(false);
      setIsValidating(false);
    }
    onOpenChange();
  };

  // Handler tombol Validate: simulasi proses validasi dengan timeout
  const handleValidate = () => {
    setIsValidating(true);
    // Simulasi delay validasi 1.5 detik
    setTimeout(() => {
      setIsValidating(false);
      setIsValidated(true);
    }, 1500);
  };

  // Handler pindah ke langkah konfirmasi
  const handlePublishClick = () => {
    setStep("confirm");
  };

  // Handler eksekusi publikasi final
  const handleConfirmPublish = () => {
    onPublish();
    onOpenChange(); // Tutup modal setelah sukses
  };

  // Handler tombol kembali (dari confirm ke review)
  const handleBack = () => {
    setStep("review");
  };

  // Membuat struktur JSON mock konfigurasi NiFi berdasarkan node dan edge yang ada
  const configJson = {
    "MiNiFi Config Version": 3,
    "Remote Process Groups": [],
    Processors: nodes.map((node) => ({
      id: node.id,
      name: node.data.label || "Processor",
      class: "org.apache.nifi.minifi.processors.PutSQL", // Mock class
      "scheduling strategy": "TIMER_DRIVEN",
      "scheduling period": "5000 ms",
      "penalization period": "30000 ms",
      "yield period": "1000 ms",
      "run duration nanos": 0,
      "auto-terminated relationships list": [],
      Properties: {},
    })),
    Connections: edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      destination: edge.target,
    })),
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={handleOpenChange}
      scrollBehavior="inside"
      placement="center"
      className="bg-white w-full max-w-[850px] max-h-[90vh] rounded-xl"
      classNames={{
        backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-black">
              {step === "confirm"
                ? "Publish Design Confirmation"
                : "Publish Design Flow"}
            </ModalHeader>
            <ModalBody className="py-4">
              {step === "review" ? (
                // Tampilan Langkah 1: Review & Validasi
                <div className="flex flex-col gap-5">
                  {/* Status Bar Desain */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-[#275386]">
                      Design Status
                    </span>
                    {isValidated ? (
                      <Chip
                        startContent={
                          <CheckCircle2 size={16} className="text-green-600" />
                        }
                        variant="flat"
                        className="bg-green-100 text-green-700 border-none font-medium h-8 px-2 gap-1"
                        radius="sm"
                      >
                        Validated
                      </Chip>
                    ) : (
                      <Chip
                        startContent={
                          <AlertCircle size={16} className="text-orange-600" />
                        }
                        variant="flat"
                        className="flex bg-[#FEF9C3] text-[#854D0E] border-none font-medium h-8 px-2 gap-1"
                        radius="sm"
                      >
                        Not Validated
                      </Chip>
                    )}
                  </div>

                  {/* Pesan Sukses Validasi - Hanya muncul jika sudah divalidasi */}
                  {isValidated && (
                    <div className="flex items-center gap-2 p-3 bg-[#DCFCE7] text-[#166534] rounded-lg text-sm font-medium border border-green-200">
                      <CheckCircle2 size={18} />
                      Design Flow is Valid
                    </div>
                  )}

                  {/* Preview Konfigurasi JSON */}
                  <div className="bg-[#F3F4F6] p-4 rounded-xl overflow-hidden border border-gray-200">
                    <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
                      <pre className="text-xs font-mono text-gray-800 whitespace-pre-wrap leading-6">
                        {JSON.stringify(configJson, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              ) : (
                // Tampilan Langkah 2: Konfirmasi Akhir
                <div className="py-8 flex flex-col items-center justify-center">
                  <div className="bg-red-50 p-4 rounded-full mb-4">
                    <AlertCircle size={48} className="text-red-500" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">
                    Publish Design Confirmation
                  </h3>
                  <p className="text-gray-500 text-center max-w-xs">
                    Are you sure you want to publish this design?
                  </p>
                </div>
              )}
            </ModalBody>
            <ModalFooter className="border-t border-gray-100 mt-2 px-6 py-4">
              {step === "review" ? (
                // Footer Langkah 1
                <div className="flex w-full justify-end items-center gap-3">
                  <Button
                    className="text-red-500 font-semibold hover:bg-red-50 px-4 min-w-unit-20"
                    variant="light"
                    onPress={onClose}
                    radius="sm"
                  >
                    Close
                  </Button>
                  {isValidated ? (
                    // Tombol Publish muncul setelah validasi sukses
                    <Button
                      className="bg-[#275386] text-white font-medium px-6 shadow-sm"
                      onPress={handlePublishClick}
                      radius="sm"
                    >
                      Publish
                    </Button>
                  ) : (
                    // Tombol Validate muncul jika belum validasi
                    <Button
                      className="bg-[#275386] text-white font-medium px-6 flex items-center gap-2 shadow-sm"
                      onPress={handleValidate}
                      isLoading={isValidating}
                      radius="sm"
                    >
                      {!isValidating && <CheckCircle2 size={16} />}
                      {isValidating ? "Validating..." : "Validate"}
                    </Button>
                  )}
                </div>
              ) : (
                // Footer Langkah 2 (Konfirmasi)
                <div className="flex w-full justify-center items-center gap-4">
                  <Button
                    className="bg-white border border-gray-300 text-gray-700 font-medium px-8 shadow-sm hover:bg-gray-50"
                    onPress={handleBack} // Tombol kembali berfungsi sebagai Batal
                    radius="sm"
                  >
                    Back
                  </Button>
                  <Button
                    className="bg-[#275386] text-white font-medium px-8 shadow-sm"
                    onPress={handleConfirmPublish}
                    radius="sm"
                  >
                    Publish
                  </Button>
                </div>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
