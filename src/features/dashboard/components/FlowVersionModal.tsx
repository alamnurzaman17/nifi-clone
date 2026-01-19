import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Select,
  SelectItem,
  Input,
  Textarea,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Selection,
} from "@heroui/react";
import { useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

// Interface (antarmuka) untuk properti yang diterima oleh komponen FlowVersionModal
interface FlowVersionModalProps {
  isOpen: boolean; // Menandakan apakah modal sedang terbuka atau tidak
  onOpenChange: (isOpen: boolean) => void; // Fungsi callback untuk mengubah status buka/tutup modal
}

// Interface untuk mendefinisikan struktur data sebuah versi Flow
interface FlowVersion {
  id: string; // ID unik untuk setiap versi
  major: string; // Angka versi mayor (kiri titik)
  minor: string; // Angka versi minor (kanan titik)
  designName: string; // Nama desain dari flow
  status: string; // Status saat ini (misal: Draft)
  comment: string; // Komentar atau deskripsi perubahan
  lastUpdated: string; // Tanggal terakhir diperbarui
}

// Data dummy (mock) awal untuk daftar versi flow
const mockVersions: FlowVersion[] = [
  {
    id: "1",
    major: "0",
    minor: "1",
    designName: "-",
    status: "Draft",
    comment: "this is my comment f...",
    lastUpdated: "2/2/2024",
  },
  {
    id: "2",
    major: "0",
    minor: "1",
    designName: "-",
    status: "Draft",
    comment: "SPBU COCO Creatio...",
    lastUpdated: "2/26/2024",
  },
  {
    id: "3",
    major: "0",
    minor: "2",
    designName: "-",
    status: "Draft",
    comment: "SPBU COCO: Creatio...",
    lastUpdated: "2/26/2024",
  },
  {
    id: "4",
    major: "1",
    minor: "0",
    designName: "-",
    status: "Draft",
    comment: "SPBU DODO V.1.0",
    lastUpdated: "2/27/2024",
  },
  {
    id: "5",
    major: "1",
    minor: "1",
    designName: "-",
    status: "Draft",
    comment: "SPBU DODO Versi 1.1...",
    lastUpdated: "2/27/2024",
  },
];

// Komponen Utama FlowVersionModal
export function FlowVersionModal({
  isOpen,
  onOpenChange,
}: FlowVersionModalProps) {
  const router = useRouter(); // Hook untuk navigasi antar halaman Next.js

  // State untuk mengontrol apakah pengguna sedang menambahkan versi mayor/minor baru secara manual
  const [isAddingMajor, setIsAddingMajor] = useState(false);
  const [isAddingMinor, setIsAddingMinor] = useState(false);

  // State untuk menyimpan daftar versi flow
  const [versions, setVersions] = useState<FlowVersion[]>(mockVersions);
  // State untuk melacak baris tabel yang dipilih (untuk tombol Open)
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));

  // State untuk input form saat membuat flow baru
  const [majorVersion, setMajorVersion] = useState("");
  const [minorVersion, setMinorVersion] = useState("");
  const [designName, setDesignName] = useState("");
  const [comment, setComment] = useState("");

  // Fungsi pembantu untuk mendapatkan nilai versi tertinggi yang ada di daftar saat ini
  const getMaxVersion = () => {
    if (versions.length === 0) return { major: 0, minor: 0 };
    let maxMaj = 0;
    let maxMin = 0;

    versions.forEach((v) => {
      const maj = parseInt(v.major);
      const min = parseInt(v.minor);
      // Logika mencari nilai maksimum
      if (maj > maxMaj) {
        maxMaj = maj;
        maxMin = min;
      } else if (maj === maxMaj) {
        if (min > maxMin) maxMin = min;
      }
    });
    return { major: maxMaj, minor: maxMin };
  };

  const maxVer = getMaxVersion();

  // Fungsi yang dijalankan saat tombol "New Flow" ditekan
  const handleAddNewFlow = () => {
    // Validasi: Pastikan Versi Mayor dipilih/diisi
    if (!majorVersion && !isAddingMajor) {
      toast.error("Please select a Major Version");
      return;
    }
    // Validasi: Pastikan Versi Minor dipilih/diisi
    if (!minorVersion && !isAddingMinor) {
      toast.error("Please select a Minor Version");
      return;
    }
    // Validasi: Jika mode tambah manual, input tidak boleh kosong/spasi saja
    if (isAddingMajor && !majorVersion.trim()) {
      toast.error("Please enter a Major Version");
      return;
    }
    if (isAddingMinor && !minorVersion.trim()) {
      toast.error("Please enter a Minor Version");
      return;
    }

    // Konversi versi ke angka untuk validasi urutan
    const curMaj = parseInt(majorVersion);
    const curMin = parseInt(minorVersion);

    // Cek apakah input adalah angka valid
    if (isNaN(curMaj) || isNaN(curMin)) {
      toast.error("Version must be numbers");
      return;
    }

    // Validasi: Versi baru tidak boleh lebih kecil dari versi tertinggi saat ini
    if (curMaj < maxVer.major) {
      toast.error(`Major version cannot be less than ${maxVer.major}`);
      return;
    }
    if (curMaj === maxVer.major && curMin <= maxVer.minor) {
      toast.error(
        `New version must be greater than ${maxVer.major}.${maxVer.minor}`,
      );
      return;
    }

    // Format objek versi baru
    const newVersion: FlowVersion = {
      id: crypto.randomUUID(), // Generate ID acak
      major: majorVersion,
      minor: minorVersion,
      designName: designName || "-", // Default "-" jika kosong
      status: "Draft",
      comment: comment || "-", // Default "-" jika kosong
      lastUpdated: new Date().toLocaleDateString(),
    };

    // Tambahkan versi baru ke state
    setVersions((prev) => [...prev, newVersion]);
    toast.success("New flow version added successfully");

    // Reset form input setelah berhasil simpan
    setDesignName("");
    setComment("");
    // Tutup mode input manual jika sedang terbuka
    if (isAddingMajor) setIsAddingMajor(false);
    if (isAddingMinor) setIsAddingMinor(false);
  };

  // Mengambil daftar opsi Versi Mayor yang unik dari data dan mengurutkannya
  const majorOptions = Array.from(new Set(versions.map((v) => v.major))).sort(
    (a, b) => parseInt(a) - parseInt(b),
  );
  // Mengambil daftar opsi Versi Minor yang unik dari data dan mengurutkannya
  const minorOptions = Array.from(new Set(versions.map((v) => v.minor))).sort(
    (a, b) => parseInt(a) - parseInt(b),
  );

  // Membuat array angka 0-99 untuk opsi dropdown saat input manual
  const versionRange = Array.from({ length: 100 }, (_, i) => i.toString());

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
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
              Flow Version
            </ModalHeader>
            <ModalBody>
              {/* Container untuk pemilihan Versi Mayor dan Minor */}
              <div className="flex flex-col md:flex-row gap-4 md:items-center mb-2">
                {/* Bagian Pemilihan Versi Mayor */}
                <div className="flex-1 flex gap-2 items-center">
                  {isAddingMajor ? (
                    // Tampilan Mode Input Manual (Pilih Angka 0-99)
                    <>
                      <Select
                        aria-label="Select Major Version"
                        placeholder="Select"
                        className="w-full"
                        classNames={{
                          trigger:
                            "bg-[#F0F2F5] shadow-none h-12 data-[hover=true]:bg-[#E4E6E9] !border-none !ring-0 !outline-none focus:!ring-0 focus:!outline-none data-[focus=true]:!ring-0 data-[focus=true]:!outline-none !rounded-xl",
                          value: "text-black text-sm",
                        }}
                        radius="lg"
                        scrollShadowProps={{
                          className: "max-h-[200px]",
                        }}
                        popoverProps={{
                          classNames: {
                            content: "p-0 border-small border-divider bg-white",
                          },
                        }}
                        listboxProps={{
                          itemClasses: {
                            base: [
                              "rounded-md",
                              "text-gray-700",
                              "transition-opacity",
                              "data-[hover=true]:text-gray-900",
                              "data-[hover=true]:bg-gray-100",
                              "data-[selectable=true]:focus:bg-gray-100",
                            ],
                            title: "text-sm",
                          },
                        }}
                        selectedKeys={majorVersion ? [majorVersion] : []}
                        onChange={(e) => setMajorVersion(e.target.value)}
                      >
                        {versionRange.map((num) => (
                          <SelectItem key={num}>{num}</SelectItem>
                        ))}
                      </Select>
                      {/* Tombol batal input manual (Silang Merah) */}
                      <Button
                        isIconOnly
                        className="bg-[#FFE4E6] text-red-500 min-w-12 w-12 h-12 !rounded-xl"
                        radius="lg"
                        onPress={() => setIsAddingMajor(false)}
                      >
                        <X size={20} />
                      </Button>
                    </>
                  ) : (
                    // Tampilan Mode Default (Pilih dari Versi yang ada)
                    <>
                      <Select
                        aria-label="Select Major Version"
                        placeholder="Select Major Version"
                        className="w-full"
                        classNames={{
                          trigger:
                            "bg-[#F0F2F5] shadow-none h-12 data-[hover=true]:bg-[#E4E6E9] !border-none !ring-0 !outline-none focus:!ring-0 focus:!outline-none data-[focus=true]:!ring-0 data-[focus=true]:!outline-none !rounded-xl",
                          value: "text-gray-600 text-sm",
                        }}
                        radius="lg"
                        scrollShadowProps={{
                          className: "max-h-[200px]",
                        }}
                        popoverProps={{
                          classNames: {
                            content: "p-0 border-small border-divider bg-white",
                          },
                        }}
                        listboxProps={{
                          itemClasses: {
                            base: [
                              "rounded-md",
                              "text-gray-700",
                              "transition-opacity",
                              "data-[hover=true]:text-gray-900",
                              "data-[hover=true]:bg-gray-100",
                              "data-[selectable=true]:focus:bg-gray-100",
                            ],
                            title: "text-sm",
                          },
                        }}
                        selectedKeys={majorVersion ? [majorVersion] : []}
                        onChange={(e) => setMajorVersion(e.target.value)}
                      >
                        {majorOptions.map((opt) => (
                          <SelectItem key={opt}>{opt}</SelectItem>
                        ))}
                      </Select>
                      {/* Tombol tambah manual (+) */}
                      <Button
                        isIconOnly
                        className="bg-[#D4D4D8] min-w-12 w-12 h-12 !rounded-xl"
                        radius="lg"
                        onPress={() => setIsAddingMajor(true)}
                      >
                        +
                      </Button>
                    </>
                  )}
                </div>
                {/* Bagian Pemilihan Versi Minor */}
                <div className="flex-1 flex gap-2 items-center">
                  {isAddingMinor ? (
                    // Tampilan Mode Input Manual Minor
                    <>
                      <Select
                        aria-label="Select Minor Version"
                        placeholder="Select"
                        className="w-full"
                        classNames={{
                          trigger:
                            "bg-[#F0F2F5] shadow-none h-12 data-[hover=true]:bg-[#E4E6E9] !border-none !ring-0 !outline-none focus:!ring-0 focus:!outline-none data-[focus=true]:!ring-0 data-[focus=true]:!outline-none !rounded-xl",
                          value: "text-gray-600 text-sm",
                        }}
                        radius="lg"
                        scrollShadowProps={{
                          className: "max-h-[200px]",
                        }}
                        popoverProps={{
                          classNames: {
                            content: "p-0 border-small border-divider bg-white",
                          },
                        }}
                        listboxProps={{
                          itemClasses: {
                            base: [
                              "rounded-md",
                              "text-gray-700",
                              "transition-opacity",
                              "data-[hover=true]:text-gray-900",
                              "data-[hover=true]:bg-gray-100",
                              "data-[selectable=true]:focus:bg-gray-100",
                            ],
                            title: "text-sm",
                          },
                        }}
                        selectedKeys={minorVersion ? [minorVersion] : []}
                        onChange={(e) => setMinorVersion(e.target.value)}
                      >
                        {versionRange.map((num) => (
                          <SelectItem key={num}>{num}</SelectItem>
                        ))}
                      </Select>
                      <Button
                        isIconOnly
                        className="bg-[#FFE4E6] text-red-500 min-w-12 w-12 h-12 !rounded-xl"
                        radius="lg"
                        onPress={() => setIsAddingMinor(false)}
                      >
                        <X size={20} />
                      </Button>
                    </>
                  ) : (
                    // Tampilan Mode Default Minor
                    <>
                      <Select
                        aria-label="Select Minor Version"
                        placeholder="Select Minor Version"
                        className="w-full"
                        classNames={{
                          trigger:
                            "bg-[#F0F2F5] shadow-none h-12 data-[hover=true]:bg-[#E4E6E9] !border-none !ring-0 !outline-none focus:!ring-0 focus:!outline-none data-[focus=true]:!ring-0 data-[focus=true]:!outline-none !rounded-xl",
                          value: "text-gray-600 text-sm",
                        }}
                        radius="lg"
                        popoverProps={{
                          classNames: {
                            content:
                              "p-0 border-small border-divider bg-white max-h-[200px] overflow-y-auto",
                          },
                        }}
                        listboxProps={{
                          itemClasses: {
                            base: [
                              "rounded-md",
                              "text-gray-700",
                              "transition-opacity",
                              "data-[hover=true]:text-gray-900",
                              "data-[hover=true]:bg-gray-100",
                              "data-[selectable=true]:focus:bg-gray-100",
                            ],
                            title: "text-sm",
                          },
                        }}
                        selectedKeys={minorVersion ? [minorVersion] : []}
                        onChange={(e) => setMinorVersion(e.target.value)}
                      >
                        {minorOptions.map((opt) => (
                          <SelectItem key={opt}>{opt}</SelectItem>
                        ))}
                      </Select>
                      <Button
                        isIconOnly
                        className="bg-[#D4D4D8] min-w-12 w-12 h-12 !rounded-xl"
                        radius="lg"
                        onPress={() => setIsAddingMinor(true)}
                      >
                        +
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Input Field: Design Name */}
              <Input
                aria-label="Design Name"
                placeholder="Design Name"
                className="mb-1 mt-1"
                classNames={{
                  input: "text-sm text-gray-700",
                  inputWrapper:
                    "bg-[#F0F2F5] shadow-none h-10 data-[hover=true]:bg-[#E4E6E9] group-data-[focus=true]:bg-[#E4E6E9] !border-none !ring-0 !outline-none focus:!ring-0 focus:!outline-none group-data-[focus=true]:!ring-0 group-data-[focus=true]:!outline-none !rounded-xl",
                }}
                radius="lg"
                value={designName}
                onValueChange={setDesignName}
              />

              {/* Input Field: Comment */}
              <Textarea
                aria-label="Comment"
                placeholder="Comment"
                className="mb-3"
                minRows={2}
                classNames={{
                  input:
                    "text-sm text-gray-700 !min-h-[60px] !max-h-[100px] !resize-y !border-none !ring-0 !outline-none !shadow-none focus:!border-none focus:!ring-0 focus:!outline-none",
                  inputWrapper:
                    "bg-[#F0F2F5] shadow-none data-[hover=true]:bg-[#E4E6E9] group-data-[focus=true]:bg-[#E4E6E9] h-auto py-2 !border-none !ring-0 !outline-none focus:!ring-0 focus:!outline-none group-data-[focus=true]:!ring-0 group-data-[focus=true]:!outline-none !rounded-xl",
                }}
                radius="lg"
                value={comment}
                onValueChange={setComment}
              />

              {/* Tombol "New Flow" untuk submit form */}
              <Button
                className="w-full bg-[#275386] text-white font-semibold mb-3 rounded-md disabled:bg-gray-300 h-10"
                onPress={handleAddNewFlow}
                isDisabled={Array.from(selectedKeys).length > 0} // Dinonaktifkan jika ada baris yang dipilih
              >
                New Flow
              </Button>

              {/* Tabel Menampilkan Daftar Versi */}
              <Table
                aria-label="Version history table"
                shadow="none"
                selectionMode="single"
                color="primary" // Styling default HeroUI
                selectedKeys={selectedKeys}
                onSelectionChange={setSelectedKeys}
                classNames={{
                  wrapper:
                    "max-h-[220px] overflow-y-auto shadow-none border border-gray-100 rounded-lg",
                  th: "bg-gray-50 text-gray-500 font-medium text-xs border-b border-gray-200",
                  td: "py-2 font-medium text-black text-sm group-data-[selected=true]:text-blue-600",
                  tr: "group-data-[selected=true]:bg-blue-50 data-[selected=true]:bg-blue-50 cursor-pointer", // Highlight baris terpilih
                }}
              >
                <TableHeader>
                  <TableColumn>Version</TableColumn>
                  <TableColumn>Design Name</TableColumn>
                  <TableColumn>Status</TableColumn>
                  <TableColumn>Comment</TableColumn>
                  <TableColumn>Last Updated</TableColumn>
                </TableHeader>
                <TableBody emptyContent="No versions found.">
                  {versions.map((version) => (
                    <TableRow key={version.id}>
                      <TableCell>
                        Version{" "}
                        <span className="font-bold">
                          {version.major}.{version.minor}
                        </span>
                      </TableCell>
                      <TableCell>{version.designName}</TableCell>
                      <TableCell>
                        <Chip
                          size="sm"
                          variant="flat"
                          className="bg-gray-200 text-black text-center "
                        >
                          {version.status}
                        </Chip>
                      </TableCell>
                      <TableCell>{version.comment}</TableCell>
                      <TableCell>{version.lastUpdated}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ModalBody>
            <ModalFooter>
              {/* Tombol Tutup Modal */}
              <Button
                className=" text-red-600 px-6 rounded-lg font-medium hover:bg-red-200"
                onPress={onClose}
              >
                Close
              </Button>
              {/* Tombol Buka Canvas dengan Versi Terpilih */}
              <Button
                className="bg-[#2c69a5] text-white px-8 rounded-lg shadow-sm font-medium disabled:bg-gray-300 disabled:text-gray-500 disabled:opacity-100"
                onPress={() => {
                  const selectedId = Array.from(selectedKeys)[0] as string;
                  const selectedVersion = versions.find(
                    (v) => v.id === selectedId,
                  );
                  // Format query string versi
                  const versionString = selectedVersion
                    ? `${selectedVersion.major}.${selectedVersion.minor}`
                    : "0.1";
                  // Navigasi ke halaman canvas
                  router.push(
                    `/dashboard/design/canvas?version=${versionString}`,
                  );
                  onClose();
                }}
                isDisabled={Array.from(selectedKeys).length === 0} // Dinonaktifkan jika tidak ada baris yang dipilih
              >
                Open
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
