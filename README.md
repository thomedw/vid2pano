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
- Node.js 20+ and pnpm
- A modern web browser with WebAssembly support

### Installation

1. Clone the repository:
```bash
git clone https://github.com/thomedw/vid2pano.git
cd vid2pano
```

2. Install dependencies:
```bash
pnpm install
```

This will install both root-level dev dependencies and web dependencies.

3. Run the development server:
```bash
pnpm dev
```

This will:
- Build the WASM module once
- Start watching Rust files for changes (auto-rebuilds WASM on save)
- Start the Vite dev server for the web app

The app will be available at `http://localhost:5173`

### Building for Production

Build everything with a single command:
```bash
pnpm build
```

This will build both the WASM module and the web app. The production build will be in `web/dist/`

You can also build individually:
- `pnpm build:wasm` - Build only the WASM module
- `pnpm build:web` - Build only the web app

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
├── package.json            # Root scripts for dev/build
├── pkg/                    # Generated WASM package (gitignored)
├── .github/
│   └── workflows/
│       └── deploy.yml      # CI/CD for GitHub Pages
└── README.md
```

## Development

### Local Development

Run `pnpm dev` from the root directory to start development mode. This will:
- Build the WASM module initially
- Watch Rust files (`src/**/*.rs` and `Cargo.toml`) and automatically rebuild WASM on changes
- Start the Vite dev server with hot-reload for the web app

### Rust Development

The Rust code is in `src/lib.rs`. When running `pnpm dev`, changes to Rust files are automatically detected and the WASM module is rebuilt. You can also manually rebuild with:

```bash
pnpm build:wasm
```

### Frontend Development

The React app is in `web/`. When running `pnpm dev`, the Vite dev server will hot-reload on changes to TypeScript/React files.

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

This project is being built in public. Check out the [GitHub repository](https://github.com/thomedw/vid2pano) for the latest updates and development progress.

