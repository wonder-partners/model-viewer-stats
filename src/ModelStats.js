import { Box3, Vector3 } from "three";

const html = String.raw;

export class ModelStats extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: "open" });
		this.viewer = null;
	}

	connectedCallback() {
		this.render();
		this.viewer = this.closest("model-viewer");

		if (this.viewer) {
			this.viewer.addEventListener("load", () => {
				console.log("Model Viewer loaded");
				this.calculateStats();
			});
		}
	}

	toggle() {
		if (this.hasAttribute("visible")) {
			this.removeAttribute("visible");
		} else {
			this.setAttribute("visible", "");
		}
	}

	render() {
		this.shadowRoot.innerHTML = html`
		<style>
			:host {
				position: absolute;
				top: 1rem;
				left: 1rem;
				z-index: 1000;
				background-color: rgba(0, 0, 0, 0.33);
				color: white;
				padding: 1rem;
				border-radius: 0.5rem;
				pointer-events: none;
				opacity: 0;
				transition: opacity 0.3s;
				font-family: sans-serif;
				font-size: 0.9rem;
			}
			
			:host([visible]) { 
				opacity: 1; 
			}
			
			.row { 
				display: flex;
				justify-content: space-between; 
				gap: 20px; 
				margin-bottom: 4px; 
			}
			
			.row:last-child { 
				margin-bottom: 0; 
			}
			
			.label { 
				opacity: 0.8; 
			}
			
			.val { 
				font-weight: bold; 
				font-family: monospace; 
			}
		</style>

		<div class="row"><span class="label">File size:</span><span class="val" id="file">-</span></div>
		<div class="row"><span class="label">Dimensions (W x H x D):</span><span class="val" id="size">-</span></div>
		<div class="row"><span class="label">Triangles:</span><span class="val" id="tri">-</span></div>
		<div class="row"><span class="label">Meshes:</span><span class="val" id="mesh">-</span></div>
		<div class="row"><span class="label">Materials:</span><span class="val" id="mat">-</span></div>
		<div class="row"><span class="label">Textures:</span><span class="val" id="tex">-</span></div>
		<div class="row"><span class="label">Animations:</span><span class="val" id="anim">-</span></div>
    	`;
	}

	async calculateStats() {
		if (!this.viewer) return;

		// --- File Size ---
		const src = this.viewer.src;
		if (src) {
			fetch(src, { method: "HEAD" })
				.then((res) => {
					const size = res.headers.get("content-length");
					if (size) {
						this.updateText("file", this.formatBytes(Number(size)));
					} else {
						this.updateText("file", "N/A");
					}
				})
				.catch(() => {
					this.updateText("file", "Unknown");
				});
		}

		// --- Scene traversal for geometry stats ---
		const scene = this.getInternalScene(this.viewer);

		if (!scene) {
			console.warn("[ModelStats] Could not access internal Three.js scene.");
			return;
		}

		let triCount = 0;
		let meshCount = 0;
		const materials = new Set();
		const textures = new Set();
		const box = new Box3();

		scene.traverse((obj) => {
			if (obj.isMesh && obj.geometry) {
				meshCount++;
				const geom = obj.geometry;
				triCount += geom.index ? geom.index.count / 3 : geom.attributes.position.count / 3;

				// Bounding Box
				// We assume the object is part of the model.
				// expandByObject computes the world-axis-aligned box
				box.expandByObject(obj);

				// Materials
				const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
				mats.forEach((m) => {
					materials.add(m);
					// Textures
					for (const key in m) {
						const val = m[key];
						if (val?.isTexture) {
							textures.add(val.uuid);
						}
					}
				});
			}
		});

		// Size
		if (!box.isEmpty()) {
			const size = new Vector3();
			box.getSize(size);
			// Format as W x H x D
			// box.getSize returns width, height, depth.
			// Let's assume Y is up, but just printing dimensions is fine.
			const fmt = (n) => `${n.toFixed(2)}`;
			this.updateText("size", `${fmt(size.x)} x ${fmt(size.y)} x ${fmt(size.z)}`);
		} else {
			this.updateText("size", "0m");
		}

		const animationCount = this.viewer.availableAnimations
			? this.viewer.availableAnimations.length
			: 0;

		this.updateText("tri", Math.round(triCount).toLocaleString());
		this.updateText("mesh", meshCount.toLocaleString());
		this.updateText("mat", materials.size.toString());
		this.updateText("tex", textures.size.toString());
		this.updateText("anim", animationCount.toString());
	}

	updateText(id, text) {
		const el = this.shadowRoot.getElementById(id);
		if (el) el.innerText = text;
	}

	formatBytes(bytes, decimals = 2) {
		if (!+bytes) return "0 Bytes";
		const k = 1024;
		const dm = decimals < 0 ? 0 : decimals;
		const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
	}

	/**
	 * Retrieves the internal Three.js Scene from a <model-viewer> instance.
	 * * This function bypasses the public API to access the underlying symbol
	 * that holds the scene context. It is robust against minification and
	 * internal naming changes (e.g., 'model-viewer-scene' vs 'model-viewer-artboard').
	 * * @param {HTMLElement} viewer - The <model-viewer> DOM element.
	 * @returns {Object|null} The THREE.Scene object, or null if not found.
	 */
	getInternalScene(viewer) {
		if (!viewer) return null;

		// We cannot rely on the symbol name (e.g., 'model-viewer-scene') because
		// it changes between versions (v3.0 vs v3.4) and is stripped in minified builds.
		// Instead, we inspect the symbols to find the one holding a valid Three.js scene.

		// 1. Get all symbols from the element
		const symbols = Object.getOwnPropertySymbols(viewer);

		// 2. Find the symbol that points to an object containing a valid THREE scene.
		const sceneSymbol = symbols.find((sym) => {
			const value = viewer[sym];
			return value?.scene?.isScene;
		});

		if (!sceneSymbol) return null;

		return viewer[sceneSymbol].scene;
	}
}
