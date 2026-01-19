/**
 * Menghasilkan ID unik menggunakan Crypto API.
 * Fallback ke ID berbasis timestamp jika crypto tidak tersedia (misal: browser lama).
 */
export const generateId = (): string => {
  // Cek ketersediaan API crypto modern
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback (jarang diperlukan di browser/Node modern)
  // Gabungan timestamp + random string
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};
