import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Checkbox,
} from "@heroui/react";
import { useState } from "react";

// Properti yang diterima oleh Modal Pembuatan Koneksi
interface CreateConnectionModalProps {
  isOpen: boolean; // Status buka/tutup modal
  onOpenChange: (isOpen: boolean) => void; // Fungsi toggle modal
  onConfirm: (relationship: string) => void; // Fungsi callback saat koneksi dikonfirmasi
}

// Komponen Modal untuk menentukan jenis hubungan saat menghubungkan dua node
export function CreateConnectionModal({
  isOpen,
  onOpenChange,
  onConfirm,
}: CreateConnectionModalProps) {
  // State untuk checkbox pemilihan hubungan
  const [isSelected, setIsSelected] = useState(false);
  const relationship = "success"; // Saat ini di-hardcode sebagai "success" sesuai kebutuhan

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="center"
      className="bg-white rounded-xl max-w-[500px]"
      classNames={{
        backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
        closeButton: "hover:bg-gray-100 text-gray-500",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-black font-bold text-lg">
              Create Connection
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-2">
                <span className="text-sm font-bold text-gray-800">
                  Source Relationship
                </span>

                {/* Opsi Hubungan (Card yang bisa diklik) */}
                <div
                  className={`p-4 rounded-lg border transition-all cursor-pointer flex items-start gap-3 ${
                    isSelected
                      ? "bg-[#F0F9FF] border-[#2c69a5]"
                      : "bg-white border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setIsSelected(!isSelected)}
                >
                  <Checkbox
                    isSelected={isSelected}
                    onValueChange={setIsSelected}
                    radius="full"
                    size="md"
                    classNames={{
                      wrapper:
                        "group-data-[selected=true]:bg-[#2c69a5] group-data-[selected=true]:border-[#2c69a5]",
                    }}
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-[#275386] leading-none mb-1">
                      {relationship}
                    </span>
                    <p className="text-xs text-gray-500">
                      Database is successfully updated.
                    </p>
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                className="text-red-500 font-medium bg-transparent hover:bg-red-50"
                onPress={onClose}
              >
                Close
              </Button>
              {/* Tombol Add hanya aktif jika checkbox dipilih */}
              <Button
                className="bg-[#3b8fe2] text-white font-medium disabled:opacity-50"
                isDisabled={!isSelected}
                onPress={() => {
                  onConfirm(relationship);
                  onClose();
                  setIsSelected(false); // Reset pilihan
                }}
              >
                Add
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
