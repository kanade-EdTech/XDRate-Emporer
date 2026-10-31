import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const packageJson = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url), 'utf8'),
) as { name: string; version: string };

export default defineConfig({
  // Keep the standalone emperor build usable under a subdirectory as well as at the domain root.
  base: './',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: process.env.XDRATE_EMPEROR_PLACEHOLDER_ONLY === '1'
      ? { './emperorPortraitAssets': fileURLToPath(new URL('./src/app/emperorPortraitAssets.empty.ts', import.meta.url)) }
      : {},
  },
  define: {
    __EMPEROR_MINITOOL__: 'false',
    __APP_NAME__: JSON.stringify(packageJson.name),
    __APP_VERSION__: JSON.stringify(packageJson.version),
  },
  server: {
    port: 1420,
    strictPort: true,
    watch: {
      ignored: ['**/src-tauri/**'],
    },
  },
  build: {
    emptyOutDir: false,
  },
});
