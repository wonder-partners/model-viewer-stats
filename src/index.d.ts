import { ModelStats } from "./ModelStats.js";
export { ModelStats };

declare global {
	namespace JSX {
		interface IntrinsicElements {
			"model-stats": React.DetailedHTMLProps<
				React.HTMLAttributes<HTMLElement>,
				HTMLElement
			> & { visible?: boolean };
		}
	}
}
