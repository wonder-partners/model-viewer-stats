import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'Model Viewer Stats',
      fileName: 'model-viewer-stats',
    },
    rollupOptions: {
      // On exclut ces libs du bundle final, car l'utilisateur les aura déjà
      external: ['@google/model-viewer', 'three'],
      output: {
        globals: {
          '@google/model-viewer': 'ModelViewer',
          'three': 'THREE'
        },
      },
    },
  },
});