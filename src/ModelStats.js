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
		this.shadowRoot.getElementById("tri").innerText = "yolo";
		this.setAttribute("visible", "");
	}
}
