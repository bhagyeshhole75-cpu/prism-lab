import { Canvas } from "@react-three/fiber";
import GlassScene from "./GlassScene.jsx";
import useInView from "../hooks/useInView.js";
import useReducedMotion from "../hooks/useReducedMotion.js";

export default function Hero({ preset }) {
  const [ref, inView] = useInView();
  const reducedMotion = useReducedMotion();

  return (
    <section className="hero" ref={ref} id="top">
      <div className="hero-canvas">
        <Canvas
          camera={{ position: [0, 0, 6], fov: 35 }}
          dpr={[1, 2]}
          frameloop={inView ? "always" : "never"}
        >
          <GlassScene shape="ring" settings={preset} followPointer animate={!reducedMotion} hero />
        </Canvas>
      </div>

      <div className="hero-copy">
        <p className="label">§01 / The object</p>
        <h1>
          Glass, light
          <br />
          and code<span className="accent">.</span>
        </h1>
        <p className="hero-sub">
          A tiny 3D lab that renders refractive glass in real time, right in your browser. No images,
          no video: every frame is calculated live by your GPU.
        </p>
        <div className="hero-actions">
          <a className="btn btn-light" href="#lab">
            Open the Lab
          </a>
          <a className="btn btn-ghost" href="#stack">
            How it works
          </a>
        </div>
      </div>

      <a className="scroll-hint" href="#lab" aria-label="Scroll to the Lab">
        <span>Scroll</span>
        <i />
      </a>
    </section>
  );
}
