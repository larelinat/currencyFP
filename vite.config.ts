/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import * as path from 'node:path';

export default defineConfig({
  optimizeDeps: {
    esbuildOptions: {
      plugins: [],
    },
  },
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: {
      style: path.resolve(__dirname, 'src/style'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/setupTests.ts'],
  },
});
