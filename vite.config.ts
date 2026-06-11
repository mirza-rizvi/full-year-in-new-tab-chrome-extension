import { defineConfig } from 'vitest/config';
import preact from '@preact/preset-vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  root: '.',
  base: './',
  publicDir: 'public',
  resolve: {
    alias: { '@': '/src' },
  },
  plugins: [
    preact(),
    viteStaticCopy({
      targets: [
        { src: 'manifest.json', dest: '.' },
        { src: '_locales', dest: '.' },
        { src: 'icons', dest: '.' },
      ],
    }),
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'chrome120',
    cssCodeSplit: true,
    sourcemap: false,
    rollupOptions: {
      input: {
        newtab: 'newtab.html',
      },
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
  test: {
    environment: 'happy-dom',
    globals: true,
    include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx', 'src/**/*.test.ts', 'src/**/*.test.tsx'],
  },
});
