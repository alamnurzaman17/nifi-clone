import { heroui } from "@heroui/react";
import type { Config } from "tailwindcss";

const config: Config = {
  // v4 akan tetap membaca properti content ini untuk mode kompatibilitas
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}", // WAJIB
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [heroui()], // WAJIB
};

export default config;
