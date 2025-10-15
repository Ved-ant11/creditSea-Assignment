// @ts-ignore: resolved after dependencies are installed
import { defineConfig, loadEnv } from "vite";
// @ts-ignore: resolved after dependencies are installed
import react from "@vitejs/plugin-react";

declare const process: {
  cwd: () => string;
  env: Record<string, string | undefined>;
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    server: {
      port: 5173,
      strictPort: true,
      proxy: {
        "/api": {
          target: env.VITE_API_BASE_URL || "http://localhost:5000",
          changeOrigin: true,
        },
      },
    },
    css: {
      postcss: "./postcss.config.js",
    },
    build: {
      outDir: "dist",
      sourcemap: true,
    },
    test: {
      environment: "jsdom",
      setupFiles: "./src/test/setup.ts",
    },
  };
});
