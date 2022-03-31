import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    target: 'es2018',
    lib: {
      entry: path.resolve(__dirname, 'src', 'index.ts'),
      name: 'YaDisk',
      fileName: format => `lib.${format}.js`,
    },
  },
});
