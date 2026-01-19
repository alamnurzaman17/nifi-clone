import { useState, useEffect } from "react";

// Interface untuk menyimpan dimensi jendela browser
interface WindowSize {
  width: number | undefined;
  height: number | undefined;
}

/**
 * Hook untuk melacak perubahan ukuran jendela browser (window resize).
 * Berguna untuk keperluan responsif kanvas atau layout dinamis.
 */
export const useWindowSize = (): WindowSize => {
  // State awal undefined untuk menghindari mismatch saat hydration (SSR vs Client)
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    // Handler untuk memperbarui state saat event resize terjadi
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // Tambahkan event listener 'resize' ke window
    window.addEventListener("resize", handleResize);

    // Panggil handler sekali di awal untuk set ukuran inisial
    handleResize();

    // Hapus event listener saat cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Array dependensi kosong: hanya dijalankan saat mount

  return windowSize;
};
