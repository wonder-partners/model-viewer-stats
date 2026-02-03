import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
	build: {
		copyPublicDir: false,
		lib: {
			entry: resolve(__dirname, "src/index.js"),
			name: "Model Viewer Stats",
			fileName: "model-viewer-stats",
		},
		rollupOptions: {
			external: ["@google/model-viewer", "three"],
			output: {
				globals: {
					"@google/model-viewer": "ModelViewer",
					three: "THREE",
				},
			},
		},
	},
});
