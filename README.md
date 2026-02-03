# @wonder/model-viewer-stats

A lightweight web component that displays triangle count statistics for 3D models rendered with Google's `<model-viewer>`.

## Overview

`model-viewer-stats` is a custom HTML element that integrates as a child of `<model-viewer>`. It accesses the internal Three.js scene and calculates geometry statistics, displaying them as an overlay on the viewer.

## Installation

```bash
npm install @wonder/model-viewer-stats
```

### Peer Dependencies

This package requires `@google/model-viewer` v4.0.0 or higher as a peer dependency.

## Usage

Import the package and use the `<model-stats>` element inside your `<model-viewer>`:

```html
<script type="module">
  import '@google/model-viewer';
  import '@wonder/model-viewer-stats';
</script>

<model-viewer src="/path/to/model.glb" camera-controls>
  <model-stats></model-stats>
</model-viewer>
```

The stats overlay will automatically appear in the top-left corner of the viewer once the model loads.

### ES Module Import

```javascript
import { ModelStats } from '@wonder/model-viewer-stats';
```

### UMD (CommonJS)

```javascript
const { ModelStats } = require('@wonder/model-viewer-stats');
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
