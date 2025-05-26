import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import pkg from "./package.json";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react()],
    server: {
      port: parseInt(env.VITE_PORT) || 5173,
    },
    resolve: {
      alias: {
        src: "/src",
      },
    },
    define: {
      __APP_VERSION__: JSON.stringify(pkg.version),
    },
  };
});
