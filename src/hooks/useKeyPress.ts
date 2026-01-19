import { useEffect, useState } from "react";

/**
 * Hook untuk mendeteksi penekanan tombol keyboard tertentu.
 * @param targetKey Kode tombol yang ingin dipantau (misal: 'Delete', 'Backspace', 'z')
 * @returns boolean yang menandakan apakah tombol sedang ditekan
 */
export const useKeyPress = (targetKey: string): boolean => {
  // State untuk menyimpan status penekanan tombol
  const [keyPressed, setKeyPressed] = useState(false);

  useEffect(() => {
    // Handler saat tombol ditekan (keydown)
    const downHandler = ({ key }: KeyboardEvent) => {
      if (key === targetKey) {
        setKeyPressed(true);
      }
    };

    // Handler saat tombol dilepas (keyup)
    const upHandler = ({ key }: KeyboardEvent) => {
      if (key === targetKey) {
        setKeyPressed(false);
      }
    };

    // Tambahkan event listener ke window
    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);

    // Bersihkan event listener saat komponen unmount atau targetKey berubah
    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, [targetKey]);

  return keyPressed;
};
