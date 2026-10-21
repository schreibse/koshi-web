import { defineConfig } from 'vitest/config';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../node_modules/.vite/worker',
  plugins: [nxViteTsPaths()],
  test: {
    name: 'worker',
    watch: false,
    environment: 'node',
    include: ['**/*.spec.ts'],
    reporters: ['default'],
  },
}));
