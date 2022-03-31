import { defineConfig } from 'vite';
import path from 'path';
import resolve from '@rollup/plugin-node-resolve';

export default defineConfig({
  plugins: [
    {
      ...resolve({
        preferBuiltins: true,
        browser: true,
      }),
      enforce: 'pre',
      apply: 'build',
    },
  ],
  build: {
    target: 'es2018',
    lib: {
      entry: path.resolve(__dirname, 'src', 'index.ts'),
      name: 'YaDisk',
      fileName: format => `lib.${format}.js`,
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['axios'],
    },
  },
});
