import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import { fileURLToPath, URL } from "node:url"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  publicDir: false,
  resolve: { alias: { "@": fileURLToPath(new URL(".", import.meta.url)) } },
  build: {
    rollupOptions: { input: {
      main: fileURLToPath(new URL("index.html", import.meta.url)),
      demo: fileURLToPath(new URL("navbar-demo.html", import.meta.url)),
    } },
  },
})
