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

	render() {
		this.shadowRoot.innerHTML = `
		<style>
		:host {
			position: absolute;
			top: 1rem;
			left: 1rem;
			z-index: 1000;
			background-color: rgba(0, 0, 0, 0.7);
			color: white;
			padding: 1rem;
			border-radius: 1rem;
			pointer-events: none;
			opacity: 0;
			transition: opacity 0.3s;
		}
		:host([visible]) { opacity: 1; }
		.row { display: flex; justify-content: space-between; gap: 15px; }
		.val { font-weight: bold; font-family: monospace; }
		</style>
		<div class="row"><span>Tris:</span><span class="val" id="tri">...</span></div>
    `;
	}

	calculateStats() {
		if (!this.viewer) return;

		const scene = this.getInternalScene(this.viewer);

		if (!scene) {
			console.warn("[ModelStats] Could not access internal Three.js scene.");
			return;
		}

		let triCount = 0;

		scene.traverse((obj) => {
			if (obj.isMesh && obj.geometry) {
				const geom = obj.geometry;
				triCount += geom.index ? geom.index.count / 3 : geom.attributes.position.count / 3;
			}
		});

		this.shadowRoot.getElementById("tri").innerText = Math.round(triCount).toLocaleString();
		this.setAttribute("visible", "");
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
