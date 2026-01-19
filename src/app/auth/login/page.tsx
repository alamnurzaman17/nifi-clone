"use client";

import React, { useState, Suspense } from "react";
import { Button, Input } from "@heroui/react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { AuthProxy } from "@/features/auth/api/auth.proxy";
import Image from "next/image";
import { Modal, ModalContent, ModalBody, useDisclosure } from "@heroui/react";
import { X } from "lucide-react";

// Loading Component extracted for reuse
function LoadingState() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white animate-in fade-in duration-300">
      <div className="flex items-center gap-4 mb-12">
        {/* Logo Icon */}
        <div className="relative w-[60px] h-[60px]">
          <Image
            src="/logo/logo-icon.svg"
            alt="S.2.R.E Logo"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Logo Text */}
        <div className="flex flex-col justify-center">
          <h1 className="text-2xl font-black text-slate-900 leading-none tracking-tight">
            SOVWARE
          </h1>
          <p className="text-sm font-semibold text-slate-600 tracking-widest mt-1">
            EDGE SYSTEM
          </p>
        </div>
      </div>

      {/* Custom Spinner */}
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 border-3 border-slate-200 rounded-full"></div>
        <div className="absolute inset-0 border-3 border-t-[#2c69a5] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );
}

function LoginContent() {
  // --- State Management ---
  const [isVisible, setIsVisible] = useState(false); // Toggle lihat password
  const [email, setEmail] = useState(""); // Input Email
  const [password, setPassword] = useState(""); // Input Password
  const [isLoading, setIsLoading] = useState(false); // Loading state saat submit

  const router = useRouter();
  const searchParams = useSearchParams();

  // --- Modal Error State ---
  const {
    isOpen: isErrorOpen,
    onOpen: onErrorOpen,
    onOpenChange: onErrorOpenChange,
  } = useDisclosure();
  const [errorMessage, setErrorMessage] = useState("");
  const [errorTitle, setErrorTitle] = useState("Error");

  // Efek samping: Cek pesan error dari URL (misal: redirect karena sesi habis)
  React.useEffect(() => {
    const message = searchParams.get("message");
    if (message === "session_expired") {
      setErrorTitle("Error");
      setErrorMessage("Session expired. Please login again.");
      onErrorOpen();
      // Bersihkan URL agar pesan tidak muncul terus
      router.replace("/auth/login");
    }
  }, [searchParams, onErrorOpen, router]);

  // Handler toggle visibilitas password
  const toggleVisibility = () => setIsVisible(!isVisible);

  // Handler Submit Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulasi delay loading untuk UX yang lebih baik
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Validasi Hardcoded (Demo Purpose)
    if (email === "admin@mail.com" && password === "password123") {
      AuthProxy.loginProxy(email, "S.2.R.E Admin"); // Simpan sesi
      toast.success("Login Successful");
      router.push("/dashboard/design"); // Redirect ke dashboard
    } else {
      // Skenario Gagal Login
      setErrorTitle("Error");
      // Pesan error di-override (simulasi kondisi)
      // setErrorMessage("You must confirm your email address first...");
      setErrorMessage(
        "Invalid credentials provided. Please check your email and password.",
      );

      onErrorOpen();
      setIsLoading(false);
    }
  };

  // Tampilan Layar Loading (Spinner Fullscreen)
  if (isLoading) {
    return <LoadingState />;
  }

  // Tampilan Halaman Login Utama
  return (
    <div className="flex min-h-screen w-full bg-[#2c69a5] overflow-hidden">
      {/* =======================================
          PANEL KIRI (FORM LOGIN)
          - Tampil penuh di mobile
          - Lebar 40-45% di desktop
      ======================================= */}
      <div className="relative z-20 flex w-full md:w-[45%] lg:w-[40%] flex-col justify-center bg-white md:rounded-r-[60px] shadow-2xl px-6 py-10">
        <div className="w-full max-w-[380px] flex flex-col mx-auto">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="relative w-[70px] h-[70px]">
              <Image
                src="/logo/logo-icon.svg"
                alt="S.2.R.E Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Judul & Subjudul */}
          <div className="text-center mb-8">
            <h1 className="text-[22px] font-bold text-[#1e5d9f] leading-tight">
              Welcome to <span className="font-extrabold">S.2.R.E ADMIN</span>
            </h1>
            <p className="text-[#1e5d9f] text-[13px] font-medium mt-3">
              Please login with your registered account.
            </p>
          </div>

          {/* Form Input */}
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-5">
              {/* Input Email */}
              <Input
                placeholder="Email"
                variant="bordered"
                radius="none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                classNames={{
                  inputWrapper:
                    "h-[52px] border border-gray-200 bg-white hover:border-[#1e5d9f] focus-within:!border-[#1e5d9f] shadow-sm pl-6 pr-8 transition-all rounded-l-2xl rounded-r-full flex items-center",
                  input:
                    "text-[14px] text-gray-800 placeholder:text-gray-400 font-normal",
                  innerWrapper: "bg-transparent flex items-center w-full",
                }}
              />

              {/* Input Password dengan Toggle Visible */}
              <Input
                placeholder="Password"
                variant="bordered"
                radius="none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={isVisible ? "text" : "password"}
                endContent={
                  <button
                    type="button"
                    onClick={toggleVisibility}
                    className="focus:outline-none opacity-50 hover:opacity-100 transition-opacity flex items-center justify-center p-1"
                  >
                    {isVisible ? (
                      <EyeOff className="text-lg text-[#1e5d9f]" />
                    ) : (
                      <Eye className="text-lg text-[#1e5d9f]" />
                    )}
                  </button>
                }
                classNames={{
                  inputWrapper:
                    "h-[52px] border border-gray-200 bg-white hover:border-[#1e5d9f] focus-within:!border-[#1e5d9f] shadow-sm pl-6 pr-8 transition-all rounded-l-2xl rounded-r-full flex items-center",
                  input:
                    "text-[14px] text-gray-800 placeholder:text-gray-400 font-normal",
                  innerWrapper: "bg-transparent flex items-center w-full",
                }}
              />

              {/* Checkbox Remember Me (Mockup UI) */}
              <div className="flex items-center justify-between w-full">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative flex items-center justify-center w-[18px] h-[18px] border-2 border-slate-300 rounded-[4px] transition-colors group-hover:border-[#2c69a5] bg-white overflow-hidden">
                    <input
                      type="checkbox"
                      className="peer absolute opacity-0 w-full h-full cursor-pointer appearance-none"
                    />
                    <div className="absolute inset-0 bg-[#2c69a5] opacity-0 peer-checked:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-3 h-3 text-white"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  </div>
                  <span className="text-slate-500 font-medium text-[14px]">
                    Remember Me
                  </span>
                </label>
              </div>

              {/* Tombol Login */}
              <Button
                type="submit"
                className="bg-[#2c69a5] text-white font-bold text-[15px] h-[52px] rounded-xl shadow-lg mt-3 hover:bg-[#1e5d9f] transition-all"
                fullWidth
              >
                Login
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* =======================================
          PANEL KANAN (MOCKUP & TEXT)
          - Hidden di mobile
          - Berisi ilustrasi kartu dan teks marketing
      ======================================= */}
      <div className="hidden md:flex flex-1 flex-col items-center justify-center p-12 relative">
        {/* 
            WRAPPER 1: KHUSUS GAMBAR KARTU & EFEK BLUR
            Dipisah dari text agar blur tidak turun ke bawah menutupi text 
        */}
        <div className="relative w-full max-w-[500px] mb-20">
          {/* LAYER 1: Shadow Blur Biru di Belakang (Accent) */}
          <div className="absolute -top-[100px] -right-[100px] w-[600px] h-[600px] z-0 pointer-events-none opacity-100">
            <Image
              src="/blur-circle.svg"
              alt="Blur Glow Asset"
              fill
              className="object-contain "
            />
          </div>

          {/* 
              LAYER 2: GLASS BOX (Efek Kaca)
              Backdrop-blur akan memburamkan apa yang ada di layer 1 (asset warna-warni).
           */}
          <div className="absolute inset-0 lg:ml-10 translate-x-14 -translate-y-14 bg-white/10 backdrop-blur-2xl rounded-[30px] border border-white/20 shadow-xl z-10"></div>

          {/* LAYER 3: KARTU PUTIH UTAMA (Depan) */}
          <div className="relative bg-white rounded-[30px] shadow-[0_30px_60px_rgba(0,0,0,0.15)] p-8 w-full aspect-[4/3] flex flex-col z-20">
            {/* Header Mockup */}
            <div className="flex justify-between items-start mb-6">
              <div className="flex flex-col gap-3">
                <span className="text-gray-600 font-bold text-[15px]">
                  Flow Design
                </span>
                <div className="h-2 w-24 bg-gray-100 rounded-full"></div>
              </div>
              <div className="h-8 w-20 bg-[#2c69a5] rounded-full"></div>
            </div>

            {/* Body Skeleton */}
            <div className="space-y-5">
              <div className="h-10 w-44 bg-[#2c69a5] rounded-xl shadow-sm"></div>
              <div className="space-y-3 pt-2">
                <div className="h-3 w-20 bg-gray-100 rounded-full"></div>
                <div className="h-3.5 w-full bg-gray-100 rounded-full"></div>
                <div className="h-3.5 w-3/4 bg-gray-100 rounded-full"></div>
                <div className="h-3.5 w-full bg-gray-100 rounded-full"></div>
              </div>
            </div>

            {/* Footer Dots */}
            <div className="mt-auto pt-6 flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#fbbf24]"></div>
                <div className="w-8 h-2 bg-gray-100 rounded-full"></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#f43f5e]"></div>
                <div className="w-8 h-2 bg-gray-100 rounded-full"></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]"></div>
                <div className="w-8 h-2 bg-gray-100 rounded-full"></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#34d399]"></div>
                <div className="w-8 h-2 bg-gray-100 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* 
            WRAPPER 2: KHUSUS TEXT & SLIDER 
            Berada DI LUAR wrapper gambar, sehingga aman dari blur
        */}
        <div className="relative z-20 flex flex-col items-center text-center">
          {/* Slider Indicator */}
          <div className="flex justify-center gap-2 mb-6">
            <div className="w-6 h-1.5 bg-gray-900/40 rounded-full"></div>
            <div className="w-3 h-1.5 bg-white/40 rounded-full"></div>
            <div className="w-3 h-1.5 bg-white/40 rounded-full"></div>
          </div>

          {/* Text Content */}
          <h2 className="text-[22px] font-bold text-white mb-3 tracking-wide">
            Building Happiness, Shaping Futures
          </h2>
          <p className="text-blue-100/90 text-[13px] leading-relaxed max-w-md">
            Where joy meets learning, and dreams take flight: a school of
            happiness and endless possibilities.
          </p>
        </div>
      </div>
      {/* Modal Pesan Error */}
      <Modal
        isOpen={isErrorOpen}
        onOpenChange={onErrorOpenChange}
        hideCloseButton={true}
        isDismissable={false}
        placement="center"
        className="max-w-[400px] max-h-[400px] rounded-[2rem] bg-white"
        classNames={{
          backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
          base: "border-none shadow-none",
          header: "border-b-[1px] border-[#292f46]",
          footer: "border-t-[1px] border-[#292f46]",
          closeButton: "hover:bg-white/5 active:bg-white/10",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody className="py-8 flex flex-col items-center justify-center text-center">
                {/* Red Icon Circle */}
                <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center mb-2 shadow-sm">
                  <X className="text-white w-6 h-6" strokeWidth={3} />
                </div>

                <div className="flex flex-col gap-2 items-center">
                  <h3 className="text-xl font-bold text-slate-900">
                    {errorTitle}
                  </h3>
                  <p className="text-slate-500 text-[13px] max-w-[260px] leading-relaxed">
                    {errorMessage}
                  </p>
                </div>

                <Button
                  className="bg-[#1877F2] text-white font-semibold rounded-lg px-8 mt-4 shadow-md text-sm"
                  onPress={onClose}
                >
                  Got it
                </Button>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <LoginContent />
    </Suspense>
  );
}
