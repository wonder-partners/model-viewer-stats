# @wonder/model-viewer-stats

A lightweight web component that displays comprehensive statistics for 3D models rendered with Google's `<model-viewer>`.

## Overview

`model-viewer-stats` is a custom HTML element that integrates as a child of `<model-viewer>`. It accesses the internal Three.js scene to calculate and display geometry and asset statistics as an overlay.

**Displayed Statistics:**

- **File Size**: Head request content length.
- **Dimensions**: World-axis-aligned bounding box dimensions (W x H x D).
- **Triangles**: Total triangle count.
- **Meshes**: Number of mesh objects.
- **Materials**: Number of unique materials.
- **Textures**: Number of unique textures.
- **Animations**: Count of available animations.

## Installation

```bash
npm install @wonder/model-viewer-stats
```

### Peer Dependencies

This package requires `@google/model-viewer` v4.0.0 or higher as a peer dependency.

## Usage

Import the package and use the `<model-stats>` element inside your `<model-viewer>`. Add the `visible` attribute if you want to show the overlay by default.

```html
<script type="module">
  import '@google/model-viewer';
  import '@wonder/model-viewer-stats';
</script>

<model-viewer src="/path/to/model.glb" camera-controls>
  <!-- Add 'visible' attribute to show the stats on load -->
  <model-stats visible></model-stats>
</model-viewer>
```

### ES Module Import

```javascript
import { ModelStats } from '@wonder/model-viewer-stats';
```

### UMD (CommonJS)

```javascript
const { ModelStats } = require('@wonder/model-viewer-stats');
```

## API & Interaction

### Attributes

- `visible`: Presence of this boolean attribute makes the stats overlay visible.

### Methods

You can programmatically toggle the visibility of the stats overlay using the `toggle()` method.

```javascript
const statsComponent = document.querySelector('model-stats');

// Toggle visibility
statsComponent.toggle();
```

## Styling

The component uses Shadow DOM and positions itself absolutely within the parent `<model-viewer>`.
The overlay is non-interactive to avoid interfering with camera controls.

## Development

### Prerequisites

- Node.js 18+
- npm

### Setup

```bash
git clone https://github.com/your-username/model-viewer-stats.git
cd model-viewer-stats
npm install
```

### Start the development server

```bash
npm run dev
```

### Build Output

The build produces two bundles in the `dist/` directory:

- `model-viewer-stats.js` - ES module
- `model-viewer-stats.umd.cjs` - UMD/CommonJS bundle

External dependencies (`@google/model-viewer`, `three`) are not bundled.

### Linting

This project uses [Biome](https://biomejs.dev/) for linting and formatting.

```bash
npm run lint      # Check for issues
npm run format    # Auto-fix issues
```
