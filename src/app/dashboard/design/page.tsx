"use client";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  Pagination,
  useDisclosure,
} from "@heroui/react";
import { Search, LayoutGrid } from "lucide-react";
import { useState } from "react";
import { FlowVersionModal } from "@/features/dashboard/components/FlowVersionModal";

// Data dummy untuk daftar Kelas Desain
const classData = [
  { id: "s2RE", agents: 1 },
  { id: "s2redev", agents: 1 },
  { id: "MultiRPGTest", agents: 1 },
  { id: "multiRPG", agents: 1 },
  { id: "s2RE-coco", agents: 1 },
  { id: "s2RE-dodo", agents: 1 },
  { id: "MetricTest", agents: 6 },
  { id: "s2RE-Simulation", agents: 6001 },
  { id: "s2reagent-1.1.0", agents: 1 },
];

export default function DashboardDesignPage() {
  // State untuk pencarian
  const [searchQuery, setSearchQuery] = useState("");
  // Hook untuk kontrol modal versi flow
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  // State untuk baris yang dipilih di tabel
  const [selectedKeys, setSelectedKeys] = useState<any>(new Set([]));

  // Filter data berdasarkan query pencarian (case-insensitive)
  const filteredClassData = classData.filter((item) =>
    item.id.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Cek apakah ada baris yang dipilih
  const isSelected = selectedKeys.size > 0;

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigasi */}
      <div className="text-sm text-gray-500 mb-6">
        <span>Home</span>
        <span className="mx-2">/</span>
        <span className="font-semibold text-gray-700">Dashboards</span>
      </div>

      {/* Kartu Utama Dashboard */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        {/* Header Seksi */}
        <div className="flex items-start gap-4 mb-8">
          <div className="p-3 bg-gray-100 rounded-lg">
            <LayoutGrid className="w-6 h-6 text-gray-700" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Design Class</h2>
            <p className="text-gray-500 text-sm">Select Your Class</p>
          </div>
        </div>

        {/* Seksi Kontrol: Pencarian dan Tombol Aksi */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 bg-gray-50 p-2 rounded-xl">
          {/* Input Pencarian */}
          <Input
            className="w-full md:max-w-md"
            placeholder="Search..."
            value={searchQuery}
            onValueChange={setSearchQuery}
            startContent={
              <Search className="text-gray-500 flex-shrink-0" size={18} />
            }
            variant="flat"
            size="md"
            classNames={{
              input: "text-sm text-gray-700 placeholder:text-gray-500",
              inputWrapper:
                "bg-[#F0F2F5] shadow-none h-10 flex items-center hover:bg-[#E4E6E9] focus-within:bg-[#E4E6E9] data-[hover=true]:bg-[#E4E6E9] group-data-[focus=true]:bg-[#E4E6E9] border-none rounded-xl transition-all duration-200 indent-2",
              innerWrapper: "flex items-center gap-2",
              base: "w-full",
            }}
          />
          {/* Tombol Buka Kelas (Aktif jika ada yang dipilih) */}
          <Button
            className={`${
              isSelected ? "bg-[#2c69a5]" : "bg-gray-300 cursor-not-allowed"
            } text-white font-semibold rounded-lg px-8 shadow-sm transition-colors duration-200`}
            onPress={isSelected ? onOpen : undefined} // Buka modal jika aktif
            isDisabled={!isSelected}
          >
            Open Class
          </Button>
        </div>

        {/* Tabel Data Kelas */}
        <Table
          aria-label="Design Class Table"
          shadow="none"
          selectionMode="single" // Mode seleksi tunggal
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
          classNames={{
            th: "bg-transparent text-gray-500 font-medium text-sm border-b border-gray-200",
            td: "py-4 text-gray-700 font-medium",
            tr: "data-[selected=true]:bg-[#2c69a5]/20 data-[selected=true]:text-gray-900 cursor-pointer",
            emptyWrapper: "py-24 text-gray-800 text-sm font-medium",
          }}
        >
          <TableHeader>
            <TableColumn>Class ID</TableColumn>
            <TableColumn>Number of Agents</TableColumn>
          </TableHeader>
          <TableBody emptyContent="No classes found matching your search.">
            {filteredClassData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.agents}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Seksi Pagination */}
        <div className="flex justify-end mt-6">
          <Pagination
            total={1} // Total halaman (mock: 1)
            initialPage={1}
            size="md"
            className="gap-2"
            radius="full"
            renderItem={({
              ref,
              key,
              value,
              isActive,
              onNext,
              onPrevious,
              setPage,
              className,
            }) => {
              // Custom rendering untuk tombol next/prev
              if (value === "next") {
                return (
                  <button key={key} className={className} onClick={onNext}>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9 18L15 12L9 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                );
              }

              if (value === "prev") {
                return (
                  <button key={key} className={className} onClick={onPrevious}>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M15 18L9 12L15 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                );
              }

              if (value === "dots") {
                return (
                  <button key={key} className={className}>
                    ...
                  </button>
                );
              }

              // Tombol Halaman Biasa
              return (
                <button
                  key={key}
                  ref={ref}
                  className={`${className} ${
                    isActive
                      ? "bg-[#2c69a5] text-white font-bold shadow-sm"
                      : "text-gray-500 hover:bg-gray-100"
                  } w-9 h-9 flex items-center justify-center rounded-xl transition-all`}
                  onClick={() => {
                    if (typeof value === "number") {
                      setPage(value);
                    }
                  }}
                >
                  {value}
                </button>
              );
            }}
          />
        </div>
      </div>
      {/* Modal Versi Flow (muncul setelah tombol Open Class diklik) */}
      <FlowVersionModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </div>
  );
}
