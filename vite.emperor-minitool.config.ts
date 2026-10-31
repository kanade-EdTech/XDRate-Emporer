import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

function miniToolCompatibility(): Plugin {
  return {
    name: 'emperor-minitool-offline', enforce: 'post',
    generateBundle(_options, bundle) {
      for (const output of Object.values(bundle)) {
        if (output.type === 'chunk') output.code = output.code.replace(/navigator\.connection/g, 'null').replace(/https:\/\/react\.dev\/errors\//g, 'emperor-react-error-');
        else if (output.fileName === 'index.html') output.source = String(output.source).replace(/\s+type="module"/g, '').replace(/\s+crossorigin(?=[\s>])/g, '').replace(/<script(?=[^>]*\bsrc=)/g, '<script defer');
        else if (output.fileName.endsWith('.css')) {
          output.source = String(output.source)
            .replace(/:focus-visible/g, ':focus')
            .replace(/padding:\s*14px max\(20px,\s*calc\(\(100vw - 1240px\)\/2\)\)/g, 'padding:14px 20px')
            .replace(/width:\s*min\(100%,\s*280px\)/g, 'width:100%;max-width:280px')
            .replace(/max-height:\s*min\(65vh,\s*460px\)/g, 'max-height:65vh')
            .replace(/max-height:\s*min\(65dvh,\s*460px\);?/g, '')
            .replace(/(^|[;{]\s*)(gap|column-gap|row-gap)\s*:/g, '$1grid-$2:')
            .replace(/overflow-wrap:\s*anywhere/g, 'overflow-wrap:break-word;word-break:break-word');
        }
      }
    },
  };
}
export default defineConfig({
  root: resolve(import.meta.dirname, 'emperor-minitool'), base: './', publicDir: false,
  plugins: [react(), miniToolCompatibility()],
  define: { __EMPEROR_MINITOOL__: 'true', __APP_NAME__: JSON.stringify('xdrate-emperor'), __APP_VERSION__: JSON.stringify('0.4.1') },
  build: { outDir: resolve(import.meta.dirname, 'output/emperor-minitool-five-virtues'), emptyOutDir: true,
    target: ['es2017', 'chrome61'], cssTarget: 'chrome61', cssMinify: false, assetsInlineLimit: 0, modulePreload: false,
    rollupOptions: { output: { format: 'iife', name: 'XDRateEmperorMiniTool', entryFileNames: 'assets/app.js', assetFileNames: 'assets/[name]-[hash][extname]' } } },
});
