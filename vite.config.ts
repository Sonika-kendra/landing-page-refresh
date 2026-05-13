import { defineConfig, type PluginOption } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
  const plugins: PluginOption[] = [react()];

  if (mode === "development") {
    try {
      const { componentTagger } = await import("lovable-tagger");
      plugins.push(componentTagger());
    } catch {
      // Lovable's component tagger is a local editor helper and is optional.
    }
  }

  return {
    base: "/new",
    server: {
      host: "::",
      port: 8080,
      hmr: {
        overlay: false,
      },
      proxy: {
        '/posts/image': {
          target: process.env.VITE_NEW_API_URL || 'http://localhost:4000',
          changeOrigin: true,
        },
      },
    },
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: (id: string) => {
            if (!id.includes("node_modules")) return;
            if (id.includes("framer-motion")) return "framer-motion";
            if (id.includes("@radix-ui")) return "radix-ui";
            if (id.includes("react-router-dom")) return "router";
            if (id.includes("@tanstack/react-query") || id.includes("axios")) return "data";
            return "vendor";
          },
        },
      },
    },
  };
});
