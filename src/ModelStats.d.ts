export class ModelStats extends HTMLElement {
	constructor();
	viewer: HTMLElement | null;
	connectedCallback(): void;
	toggle(): void;
	render(): void;
	calculateStats(): Promise<void>;
	updateText(id: string, text: string): void;
	formatBytes(bytes: number, decimals?: number): string;
	/**
	 * Retrieves the internal Three.js Scene from a <model-viewer> instance.
	 * * This function bypasses the public API to access the underlying symbol
	 * that holds the scene context. It is robust against minification and
	 * internal naming changes (e.g., 'model-viewer-scene' vs 'model-viewer-artboard').
	 * * @param {HTMLElement} viewer - The <model-viewer> DOM element.
	 * @returns {Object|null} The THREE.Scene object, or null if not found.
	 */
	getInternalScene(viewer: HTMLElement): any;
}
