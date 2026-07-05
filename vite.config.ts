import react from "@vitejs/plugin-react";
import tailwind from "tailwindcss";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "./",
  css: {
    postcss: {
      plugins: [tailwind()],
    },
  },
  define: {
    global: 'globalThis',
  },
  resolve: {
    alias: {
      buffer: 'buffer',
    },
    // r3f's Canvas uses its own reconciler; without deduping, Vite can hand the
    // Canvas subtree a second React copy -> "Invalid hook call". Force one React.
    dedupe: ['react', 'react-dom'],
  },
  optimizeDeps: {
    // Pre-bundle the 3D stack against the same React instance as the app.
    include: ['buffer', 'three', '@react-three/fiber', '@react-three/drei'],
  },
});
