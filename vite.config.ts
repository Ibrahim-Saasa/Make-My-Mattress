import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");
  return {
    // When deploying to GitHub Pages, set the base to the repository name
    base: "/Make-My-Mattress/",
    server: {
      port: 3000,
      host: "0.0.0.0",
    },
    plugins: [react()],
    define: {
      // Expose environment variables to your client-side code
      // Vite automatically exposes VITE_ prefixed variables via import.meta.env
      // No need for custom process.env definitions if using VITE_ prefix directly
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "."),
      },
    },
  };
});
