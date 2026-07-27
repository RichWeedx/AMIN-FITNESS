import { cpSync, existsSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "vite";

const htmlEntries = Object.fromEntries(
  readdirSync(__dirname)
    .filter((file) => file.endsWith(".html"))
    .map((file) => [file.replace(/\.html$/, ""), resolve(__dirname, file)]),
);

export default defineConfig({
  base: "./",
  plugins: [
    {
      name: "copy-legacy-js-assets",
      writeBundle() {
        const sourceJsDir = resolve(__dirname, "assets/js");
        const targetJsDir = resolve(__dirname, "dist/assets/js");

        if (!existsSync(sourceJsDir)) {
          return;
        }

        cpSync(sourceJsDir, targetJsDir, {
          recursive: true,
          force: true,
        });
      },
    },
  ],
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    watch: {
      usePolling: true,
      interval: 120,
    },
  },
  build: {
    rollupOptions: {
      input: htmlEntries,
    },
  },
});
