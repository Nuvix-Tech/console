import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  server: {
    allowedHosts: ["ide.nuvix.in"],
  },
  build: {
    rollupOptions: {
      onwarn(warning, defaultHandler) {
        if (warning.message.includes("sourcemap for reporting an error")) return;
        defaultHandler(warning);
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler",
      },
    },
  },
});
