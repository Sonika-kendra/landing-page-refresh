import { defineConfig, type PluginOption } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import sitemap from "vite-plugin-sitemap";

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
  const sitemapRoutes = [
    "/new",
    "/new/diamonds",
    "/new/jewellery",
    "/new/jewellery/all",
    "/new/blogs",
    "/new/contact",
    "/new/privacy-policy",
    "/new/terms-and-conditions",
    "/new/cancellation-returns-policy",
    "/new/quality-policy",
    "/new/cookies-policy",
    "/new/sitemap",
  ];

  const plugins: PluginOption[] = [
    react(),
    sitemap({
      hostname: "https://henigdiamonds.co.uk",
      dynamicRoutes: sitemapRoutes,
      changefreq: "weekly",
      priority: 0.7,
      outDir: "dist",
      generateRobotsTxt: false,
    }),
  ];

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
