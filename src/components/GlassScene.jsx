import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, Lightformer, MeshTransmissionMaterial } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

export const SHAPES = [
  { id: "ring", name: "Ring" },
  { id: "capsule", name: "Capsule" },
  { id: "knot", name: "Knot" },
  { id: "gem", name: "Gem" },
  { id: "sphere", name: "Sphere" },
];

function ShapeGeometry({ shape }) {
  switch (shape) {
    case "capsule":
      return <capsuleGeometry args={[0.75, 1.5, 24, 64]} />;
    case "knot":
      return <torusKnotGeometry args={[0.85, 0.3, 240, 48]} />;
    case "gem":
      return <icosahedronGeometry args={[1.35, 0]} />;
    case "sphere":
      return <sphereGeometry args={[1.25, 96, 96]} />;
    default:
      return <torusGeometry args={[1, 0.45, 64, 180]} />;
  }
}

// A soft round gradient texture, shared by all glows.
let glowTexture;
function getGlowTexture() {
  if (glowTexture) return glowTexture;
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.35, "rgba(255,255,255,0.35)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  glowTexture = new THREE.CanvasTexture(canvas);
  return glowTexture;
}

// Coloured light blobs behind the object. The glass bends them, which gives
// the warm/cool colour inside the object.
function Glow({ color, position, scale }) {
  const map = useMemo(getGlowTexture, []);
  return (
    <mesh position={position} scale={scale}>
      <planeGeometry />
      <meshBasicMaterial
        map={map}
        color={color}
        transparent
        opacity={0.5}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </mesh>
  );
}

function GlassObject({ shape, settings, followPointer, animate }) {
  const ref = useRef();

  useFrame((state, delta) => {
    if (!animate || !ref.current) return;
    ref.current.rotation.y += delta * 0.25;
    if (followPointer) {
      const targetX = 0.6 + state.pointer.y * 0.35;
      const targetZ = -state.pointer.x * 0.25;
      ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, targetX, 0.05);
      ref.current.rotation.z = THREE.MathUtils.lerp(ref.current.rotation.z, targetZ, 0.05);
    }
  });

  return (
    <Float speed={animate ? 1.4 : 0} rotationIntensity={0.35} floatIntensity={0.5}>
      <mesh ref={ref} rotation={[0.6, 0.4, 0]}>
        <ShapeGeometry shape={shape} />
        <MeshTransmissionMaterial
          backside
          samples={6}
          resolution={512}
          transmission={1}
          thickness={settings.thickness}
          roughness={settings.roughness}
          ior={settings.ior}
          chromaticAberration={settings.chromaticAberration}
          anisotropy={0.3}
          distortion={0.15}
          distortionScale={0.4}
          temporalDistortion={animate ? 0.08 : 0}
          color={settings.tint}
        />
      </mesh>
    </Float>
  );
}

// In the hero, keep the object clear of the headline: right side on wide
// screens, upper middle on phones.
function useHeroLayout(enabled) {
  const { width, height } = useThree((state) => state.viewport);
  if (!enabled) return { position: [0, 0, 0], scale: 1 };
  if (width > height) return { position: [width * 0.24, 0.15, 0], scale: Math.min(0.9, width * 0.15) };
  return { position: [0, height * 0.18, 0], scale: Math.min(0.62, width * 0.2) };
}

// Everything inside a <Canvas>: object, glows, studio lighting and bloom.
export default function GlassScene({ shape, settings, followPointer = false, animate = true, hero = false }) {
  const layout = useHeroLayout(hero);
  return (
    <>
      <color attach="background" args={["#000000"]} />

      <group position={layout.position} scale={layout.scale}>
        <Glow color={settings.lightA} position={[0.7, 0.5, -2.5]} scale={3.6} />
        <Glow color={settings.lightB} position={[-0.8, -0.6, -2.8]} scale={3.8} />
        <GlassObject shape={shape} settings={settings} followPointer={followPointer} animate={animate} />
      </group>

      {/* A virtual photo studio: these light panels only exist in the reflections. */}
      <Environment resolution={256} key={`${settings.lightA}-${settings.lightB}`}>
        <Lightformer form="ring" intensity={5} color={settings.lightA} position={[3, 2, -3]} scale={3} />
        <Lightformer
          form="rect"
          intensity={4}
          color={settings.lightB}
          position={[-4, -1, 1]}
          rotation-y={Math.PI / 2}
          scale={[2, 6, 1]}
        />
        <Lightformer form="rect" intensity={2} color="#ffffff" position={[0, 5, -4]} scale={[10, 1, 1]} />
        <Lightformer form="circle" intensity={1.5} color="#ffffff" position={[0, -5, 2]} scale={4} />
      </Environment>

      <EffectComposer multisampling={0}>
        <Bloom mipmapBlur luminanceThreshold={0.75} intensity={0.7} radius={0.6} />
      </EffectComposer>
    </>
  );
}
