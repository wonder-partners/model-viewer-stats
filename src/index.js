import { ModelStats } from "./ModelStats.js";

export { ModelStats };

if (!customElements.get("model-stats")) {
	customElements.define("model-stats", ModelStats);
}
