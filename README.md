# Prism Lab

A small 3D glass playground. Pick a shape, choose a lighting preset, and adjust
how the glass bends light, all rendered live in the browser.

**Live:** https://prism-lab-bhagyesh.vercel.app  
**Code:** https://github.com/bhagyeshhole75-cpu/prism-lab

Built by Bhagyesh Hole (first-year Computer Science, VIT Pune) for the AWS Student
Builder Group pre-interview task.

## Features
- **Hero scene:** a floating glass ring that leans towards your mouse.
- **The Lab:** 5 shapes, 4 light presets, and 4 sliders (thickness, frost,
  refraction index, rainbow split). Drag to rotate, and **Save PNG** to download a render.
- **Live cloud status:** pings a Node.js API and shows the runtime, region and round-trip time.
- Pauses 3D rendering when it's off screen, and respects the "reduce motion" setting.

## Tech stack
| Layer       | Tool                                     | What it does here                                   |
|-------------|------------------------------------------|-----------------------------------------------------|
| UI          | React 19                                 | Components and state for every control              |
| 3D          | three.js via React Three Fiber and drei  | WebGL rendering, glass (transmission) material      |
| Effects     | @react-three/postprocessing              | Bloom glow                                          |
| Backend     | Node.js serverless functions (`/api`)    | `/api/presets` and `/api/health`                    |
| Build       | Vite                                     | Bundles and optimises the app                       |
| Hosting     | Vercel                                   | Global CDN for static files, runs the Node.js functions |

## Project structure
```
prism-lab/
├── api/                  # Node.js serverless functions (one file = one route)
│   ├── _presets.js       # shared data (the "_" prefix means it's not a route)
│   ├── presets.js        # GET /api/presets
│   └── health.js         # GET /api/health
├── src/
│   ├── components/
│   │   ├── GlassScene.jsx  # three.js scene: object, lights, bloom
│   │   ├── Hero.jsx
│   │   ├── Lab.jsx
│   │   └── Sections.jsx    # nav, stack, cloud status, footer
│   ├── hooks/            # useInView, usePresets, useReducedMotion
│   ├── App.jsx
│   └── styles.css
├── index.html
└── vite.config.js        # also runs /api locally during development
```

## Run it locally
Requires Node.js 20 or newer.
```bash
git clone https://github.com/bhagyeshhole75-cpu/prism-lab.git
cd prism-lab
npm install
npm run dev
```
Open http://localhost:5173. The `/api` routes work locally too.

## Deploy to Vercel
```bash
npx vercel login
npx vercel deploy --prod
```
Vercel detects Vite automatically, runs `npm run build`, serves `dist/` from its CDN
and turns each file in `api/` into a Node.js function. No secrets or environment
variables are needed.

## How a request flows
1. The browser requests the page, and Vercel's CDN returns the built HTML, JS and CSS from the nearest edge location.
2. React starts, and three.js compiles the shaders and renders on the GPU.
3. The Lab calls `/api/presets`. A Node.js function runs (or the cached copy is returned) and sends back JSON.
4. If the API can't be reached, the app falls back to a built-in copy of the presets.
