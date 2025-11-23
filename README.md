# vid2pano

A client-only web application for stitching video frames into panoramic images, built with React + TypeScript and Rust WASM.

## Overview

vid2pano allows you to upload a panoramic video and extract frames that are then stitched together into a single panoramic image. All processing happens entirely in your browser - no server required.

## Features

- 🎥 Upload and process video files directly in the browser
- 🖼️ Extract frames from video at regular intervals
- 🧩 Stitch frames together into a panoramic image
- ⚡ Powered by Rust WASM for fast, efficient processing
- 🌐 Fully client-side - your videos never leave your device

## Technology Stack

- **Frontend**: React + TypeScript + Vite
- **Backend**: Rust compiled to WebAssembly
- **Image Processing**: image, imageproc, nalgebra crates
- **Deployment**: GitHub Pages with automated CI/CD

## Getting Started

### Prerequisites

- Rust (latest stable)
- wasm-pack
- Node.js 20+ and npm
- A modern web browser with WebAssembly support

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/vid2pano.git
cd vid2pano
```

2. Build the WASM module:
```bash
wasm-pack build --target web --out-dir pkg
```

3. Install web dependencies:
```bash
cd web
npm install
```

4. Run the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Building for Production

1. Build WASM:
```bash
wasm-pack build --target web --out-dir pkg
```

2. Build web app:
```bash
cd web
npm run build
```

The production build will be in `web/dist/`

## Usage

1. **Upload Video**: Click "Choose File" and select a panoramic video file
2. **Extract Frames**: Click "Extract Frames" to sample frames from the video
3. **Stitch**: Click "Stitch Panorama" to create the panoramic image
4. **Download**: Right-click the result image to save it

## Project Structure

```
vid2pano/
├── src/
│   └── lib.rs              # Rust WASM core stitching logic
├── web/
│   ├── src/
│   │   ├── App.tsx         # Main React component
│   │   └── hooks/
│   │       └── usePanoramaStitcher.ts  # WASM integration
│   └── package.json        # Frontend dependencies
├── .github/
│   └── workflows/
│       └── deploy.yml      # CI/CD for GitHub Pages
└── README.md
```

## Development

### Rust Development

The Rust code is in `src/lib.rs`. After making changes:

```bash
wasm-pack build --target web --out-dir pkg
```

### Frontend Development

The React app is in `web/`. After making changes, the dev server will hot-reload.

## Current Implementation (Phase 1)

The current version uses simple horizontal frame concatenation. Future versions will include:

- Feature detection (ORB/SIFT)
- Feature matching between frames
- Homography computation
- Proper image warping and blending

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details

## Building in Public

This project is being built in public. Check out the [GitHub repository](https://github.com/yourusername/vid2pano) for the latest updates and development progress.

