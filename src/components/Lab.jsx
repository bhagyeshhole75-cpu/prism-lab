import { useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import GlassScene, { SHAPES } from "./GlassScene.jsx";
import useInView from "../hooks/useInView.js";
import useReducedMotion from "../hooks/useReducedMotion.js";

const SLIDERS = [
  { key: "thickness", label: "Thickness", min: 0.2, max: 4, step: 0.05 },
  { key: "roughness", label: "Frost", min: 0, max: 0.6, step: 0.01 },
  { key: "ior", label: "Refraction (IOR)", min: 1, max: 2.33, step: 0.01 },
  { key: "chromaticAberration", label: "Rainbow split", min: 0, max: 1.5, step: 0.01 },
];

export default function Lab({ presets, source }) {
  const [shape, setShape] = useState("knot");
  const [presetId, setPresetId] = useState(presets[0].id);
  const [settings, setSettings] = useState(presets[0]);
  const [ref, inView] = useInView();
  const reducedMotion = useReducedMotion();
  const glRef = useRef(null);

  function choosePreset(preset) {
    setPresetId(preset.id);
    setSettings(preset);
  }

  function updateSetting(key, value) {
    setSettings((s) => ({ ...s, [key]: Number(value) }));
  }

  function reset() {
    setShape("knot");
    choosePreset(presets[0]);
  }

  function savePng() {
    const canvas = glRef.current?.domElement;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `prism-lab-${shape}-${presetId}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  return (
    <section className="section lab" id="lab" ref={ref}>
      <header className="section-head">
        <p className="label">§02 / The lab</p>
        <h2>
          Pick a shape.
          <br />
          Bend the light.
        </h2>
        <p className="section-sub">Drag the object to rotate it. Every slider changes the physics of the glass.</p>
      </header>

      <div className="lab-grid">
        <div className="lab-stage">
          <Canvas
            camera={{ position: [0, 0, 6.2], fov: 35 }}
            dpr={[1, 2]}
            frameloop={inView ? "always" : "never"}
            gl={{ preserveDrawingBuffer: true }}
            onCreated={(state) => (glRef.current = state.gl)}
          >
            <GlassScene shape={shape} settings={settings} animate={!reducedMotion} />
            <OrbitControls enableZoom={false} enablePan={false} />
          </Canvas>
          <span className="stage-tag">
            {SHAPES.find((s) => s.id === shape).name} · {settings.name}
          </span>
        </div>

        <aside className="panel">
          <div className="panel-group">
            <h3>Shape</h3>
            <div className="chips">
              {SHAPES.map((s) => (
                <button
                  key={s.id}
                  className={`chip ${shape === s.id ? "active" : ""}`}
                  onClick={() => setShape(s.id)}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          <div className="panel-group">
            <h3>
              Light preset
              <span className={`source source-${source}`}>
                {source === "api" ? "from Node.js API" : source === "fallback" ? "offline copy" : "loading…"}
              </span>
            </h3>
            <div className="swatches">
              {presets.map((p) => (
                <button
                  key={p.id}
                  className={`swatch ${presetId === p.id ? "active" : ""}`}
                  onClick={() => choosePreset(p)}
                  style={{ "--a": p.lightA, "--b": p.lightB }}
                >
                  <i />
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          <div className="panel-group">
            <h3>Material</h3>
            {SLIDERS.map((s) => (
              <label key={s.key} className="slider">
                <span>
                  {s.label}
                  <output>{Number(settings[s.key]).toFixed(2)}</output>
                </span>
                <input
                  type="range"
                  min={s.min}
                  max={s.max}
                  step={s.step}
                  value={settings[s.key]}
                  onChange={(e) => updateSetting(s.key, e.target.value)}
                />
              </label>
            ))}
          </div>

          <div className="panel-actions">
            <button className="btn btn-light" onClick={savePng}>
              Save PNG
            </button>
            <button className="btn btn-ghost" onClick={reset}>
              Reset
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
}
