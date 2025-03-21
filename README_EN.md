# 3D Living Room Display

[中文](README.md) | English

An interactive 3D living room display application based on Three.js, allowing users to explore and interact with objects in a 3D living room scene.

## Features

- Real-time rendering and interaction with 3D living room scene
- Support for mouse drag rotation, wheel zoom, and right-click panning
- Click on objects to view detailed information
- Interactive functionality for specific objects (such as lamps)
- Responsive design, adapting to different screen sizes
- Elegant loading interface and error handling

## Tech Stack

- [Three.js](https://threejs.org/) - 3D graphics library
- [Vite](https://vitejs.dev/) - Frontend build tool
- Native JavaScript
- CSS3

## Installation and Running

### Prerequisites

- Node.js (v14.0.0 or higher recommended)
- npm or yarn package manager

### Installation Steps

1. Clone the repository
```bash
git clone https://github.com/zym9863/3d-living-room.git
cd 3d-living-room
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
```

4. Open browser and visit http://localhost:5173

### Build for Production

```bash
npm run build
# or
yarn build
```

The built files will be in the `dist` directory.

## Usage Guide

- **Rotate View**: Click and drag mouse
- **Zoom**: Use mouse wheel
- **Pan**: Hold right mouse button and drag
- **View Object Information**: Click on objects in the scene
- **Interaction**: Click on lamps to toggle lights

## Project Structure

```
3d-living-room/
├── dist/               # Build output directory
├── src/                # Source code
│   └── main.js         # Main JavaScript code
├── public/             # Static assets
├── index.html          # HTML entry file
├── style.css          # Global styles
├── vite.config.js     # Vite configuration
├── package.json       # Project dependencies and scripts
└── README.md          # Project documentation
```

## Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Acknowledgments

- [Three.js](https://threejs.org/) for powerful 3D rendering capabilities
- [Vite](https://vitejs.dev/) for efficient development experience