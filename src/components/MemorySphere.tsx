import { memo, useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, OrbitControls, Stars, PerspectiveCamera, Html, AdaptiveDpr, AdaptiveEvents } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { STORY_DATA, type Chapter } from '../data/story';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import CountUp from './CountUp';

// Point light that eases toward the cursor — gives the scene a tactile,
// torch-like response as you move over the sphere.
function CursorLight() {
  const ref = useRef<THREE.PointLight>(null);
  const target = useMemo(() => new THREE.Vector3(), []);
  useFrame((state) => {
    if (!ref.current) return;
    target.set(state.pointer.x * 9, state.pointer.y * 6, 7);
    ref.current.position.lerp(target, 0.12);
  });
  return <pointLight ref={ref} intensity={4} distance={22} color="#00f2ff" />;
}

const MemoryPoint = memo(function MemoryPoint({
  chapter,
  position,
  isActive,
  reduced,
  onHover,
  onSelect,
}: {
  chapter: Chapter,
  position: [number, number, number],
  isActive: boolean,
  reduced: boolean,
  onHover: (id: number | null) => void,
  onSelect: (id: number) => void,
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<any>(null);

  const linePositions = useMemo(() => new Float32Array([0, 0, 0, -position[0], -position[1], -position[2]]), [position]);

  // Reusable color targets so the active/idle transition is a smooth lerp
  // instead of an instant prop swap (that snap is what felt jerky).
  const idleColor = useMemo(() => new THREE.Color('#bc13fe'), []);
  const activeColor = useMemo(() => new THREE.Color('#00f2ff'), []);

  useFrame((_, delta) => {
    const t = 1 - Math.pow(0.001, delta); // frame-rate independent damping

    if (meshRef.current) {
      const target = isActive ? 1.35 : 1;
      meshRef.current.scale.lerp({ x: target, y: target, z: target } as THREE.Vector3, t);
    }

    const mat = matRef.current;
    if (mat) {
      const targetColor = isActive ? activeColor : idleColor;
      mat.color.lerp(targetColor, t);
      mat.emissive.lerp(targetColor, t);
      const targetGlow = isActive ? 14 : 2;
      mat.emissiveIntensity += (targetGlow - mat.emissiveIntensity) * t;
      const targetDistortSpeed = isActive ? 5 : 2;
      mat.speed += (targetDistortSpeed - mat.speed) * t;
    }
  });

  return (
    <group position={position}>
      <Float
        speed={isActive || reduced ? 0 : 1.5}
        rotationIntensity={isActive || reduced ? 0 : 0.5}
        floatIntensity={isActive || reduced ? 0 : 0.5}
      >
        {/* Stable, non-deforming hitbox owns the pointer (the distort material
            warps vertices every frame, which makes raycasting flicker). Also
            handles click = lock so memory points are usable on touch devices. */}
        <mesh
          onPointerOver={(e) => { e.stopPropagation(); onHover(chapter.id); }}
          onPointerOut={(e) => { e.stopPropagation(); onHover(null); }}
          onClick={(e) => { e.stopPropagation(); onSelect(chapter.id); }}
        >
          <sphereGeometry args={[0.55, 8, 8]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>

        <Sphere ref={meshRef} args={[0.35, 24, 24]} raycast={() => null}>
          <MeshDistortMaterial
            ref={matRef}
            color="#bc13fe"
            speed={2}
            distort={0.35}
            radius={1}
            emissive="#bc13fe"
            emissiveIntensity={2}
            transparent
            opacity={1}
          />
        </Sphere>
      </Float>

      {/* Connection line to center */}
      <line>
        <bufferGeometry attach="geometry">
          <float32BufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial attach="material" color={isActive ? "#00f2ff" : "#bc13fe"} transparent opacity={0.15} />
      </line>

      {isActive && (
        <Html distanceFactor={10} position={[0, 0.8, 0]} center zIndexRange={[100, 0]}>
          <div className="pointer-events-none select-none flex flex-col items-center justify-center p-6 min-w-[300px] bg-black/95 backdrop-blur-3xl border border-white/20 rounded-xl shadow-[0_0_60px_rgba(0,0,0,1)] transform-gpu animate-in fade-in zoom-in duration-300">
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-16 h-1 bg-neon-blue shadow-[0_0_15px_#00f2ff] rounded-full" />

            <div className="flex flex-col items-center w-full">
              <span className="text-[10px] font-mono text-neon-blue tracking-[0.5em] uppercase mb-2 opacity-70">
                Memory Block {chapter.id}
              </span>

              <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-1 w-full text-center">
                {chapter.title}
              </h3>

              <p className="text-xs font-bold text-neon-purple uppercase tracking-[0.3em] mb-4 opacity-90">
                {chapter.subtitle}
              </p>

              <div className="w-full h-px bg-white/10 mb-4" />

              <p className="text-[12px] text-gray-200 italic leading-relaxed text-center px-2 font-medium">
                "{chapter.memoryFragment}"
              </p>
            </div>

            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-10 h-1 bg-neon-purple shadow-[0_0_10px_#bc13fe] rounded-full" />
          </div>
        </Html>
      )}
    </group>
  );
});

function NeuralCore({ isFrozen }: { isFrozen: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!isFrozen) {
      if (meshRef.current) {
        meshRef.current.rotation.y = state.clock.elapsedTime * 0.15;
      }
      if (glowRef.current) {
        glowRef.current.scale.setScalar(1.4 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1);
      }
    }
  });

  return (
    <group>
      <Sphere ref={meshRef} args={[1, 32, 32]} raycast={() => null}>
        <meshStandardMaterial
          color="#bc13fe"
          emissive="#bc13fe"
          emissiveIntensity={1}
          wireframe
          transparent
          opacity={0.15}
        />
      </Sphere>
      <Sphere ref={glowRef} args={[0.8, 24, 24]} raycast={() => null}>
        <MeshDistortMaterial
          color="#bc13fe"
          speed={isFrozen ? 0 : 1.5}
          distort={0.4}
          radius={1}
          emissive="#bc13fe"
          emissiveIntensity={2}
          transparent
          opacity={0.05}
        />
      </Sphere>

      <Sphere args={[6, 24, 24]} raycast={() => null}>
        <meshStandardMaterial
          color="#00f2ff"
          wireframe
          transparent
          opacity={0.02}
        />
      </Sphere>
    </group>
  );
}

export default function MemorySphere() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [lockedId, setLockedId] = useState<number | null>(null);
  const reduced = usePrefersReducedMotion();

  const activeId = lockedId ?? hoveredId;

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const starCount = isMobile ? 800 : 1800;

  const points = useMemo(() => {
    return STORY_DATA.map((chapter, i) => {
      const phi = Math.acos(-1 + (2 * i) / STORY_DATA.length);
      const theta = Math.sqrt(STORY_DATA.length * Math.PI) * phi;
      const radius = 4.5;
      return {
        chapter,
        position: [
          radius * Math.cos(theta) * Math.sin(phi),
          radius * Math.sin(theta) * Math.sin(phi),
          radius * Math.cos(phi)
        ] as [number, number, number]
      };
    });
  }, []);

  return (
    <div className="w-full h-full bg-[#030303] relative overflow-hidden">
      <div className="absolute top-12 left-12 z-10 pointer-events-none">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono text-neon-blue tracking-[0.8em] uppercase opacity-40">System Access: DEEP_SCAN</span>
          <h2 className="text-6xl font-black text-white tracking-tighter uppercase leading-none italic">
            DE<span className="text-neon-purple">SHAWN</span>
          </h2>
        </div>
      </div>

      <div className="absolute bottom-12 right-12 z-10 text-right pointer-events-none">
        <div className="bg-black/60 backdrop-blur-md border border-white/5 p-6 rounded-lg shadow-2xl">
          <p className="text-[10px] text-neon-blue uppercase tracking-[0.5em] mb-4 font-bold">Neural Core Status: {activeId ? 'LOCKED' : 'SCANNING'}</p>
          <div className="flex items-baseline justify-end gap-2 mb-4">
            <CountUp value={27} className="text-4xl font-black text-white tabular-nums leading-none" />
            <span className="text-[9px] text-neon-purple uppercase tracking-[0.4em]">ans · subject age</span>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-end gap-3">
              <span className="text-[9px] text-white/40 uppercase tracking-widest">Orbit Pivot</span>
              <div className="w-8 h-1 bg-white/10 rounded-full overflow-hidden">
                <div className={`h-full bg-neon-blue transition-all duration-500 ${activeId ? 'w-full' : 'w-2/3'}`} />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3">
              <span className="text-[9px] text-white/40 uppercase tracking-widest">Data Depth</span>
              <div className="w-8 h-1 bg-white/10 rounded-full overflow-hidden">
                <div className={`h-full bg-neon-purple transition-all duration-500 ${activeId ? 'w-full' : 'w-1/2'}`} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hint */}
      <div className="absolute bottom-12 left-12 z-10 pointer-events-none text-[10px] font-mono uppercase tracking-[0.4em] text-white/25">
        {lockedId ? 'Cliquez le vide pour déverrouiller' : 'Survolez ou cliquez un fragment'}
      </div>

      <Canvas
        dpr={isMobile ? [1, 1.25] : [1, 1.5]}
        onPointerMissed={() => setLockedId(null)}
        gl={{ antialias: false, powerPreference: 'high-performance' }}
      >
        {/* Drop render resolution automatically when the framerate dips. */}
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />

        <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={40} />

        <color attach="background" args={['#030303']} />
        <fog attach="fog" args={['#030303', 8, 25]} />

        <Stars radius={100} depth={40} count={starCount} factor={4} saturation={0} fade speed={reduced ? 0 : 1.5} />

        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={2.5} color="#bc13fe" />
        <pointLight position={[-10, -10, -10]} intensity={1.5} color="#00f2ff" />
        {!reduced && <CursorLight />}

        <group>
          <NeuralCore isFrozen={activeId !== null} />
          {points.map((p) => (
            <MemoryPoint
              key={p.chapter.id}
              chapter={p.chapter}
              position={p.position}
              isActive={activeId === p.chapter.id}
              reduced={reduced}
              onHover={setHoveredId}
              onSelect={(id) => setLockedId((cur) => (cur === id ? null : id))}
            />
          ))}
        </group>

        <OrbitControls
          enableDamping={activeId === null}
          dampingFactor={0.06}
          rotateSpeed={0.7}
          minDistance={6}
          maxDistance={18}
          autoRotate={activeId === null && !reduced}
          autoRotateSpeed={0.4}
        />

        {/* Neon bloom — makes the emissive orbs and core glow like real light.
            mipmapBlur is the cheap blur path; DPR cap + AdaptiveDpr keep it light. */}
        <EffectComposer enableNormalPass={false} multisampling={0}>
          <Bloom intensity={0.8} luminanceThreshold={0.3} luminanceSmoothing={0.85} mipmapBlur radius={0.6} />
          <Vignette eskil={false} offset={0.25} darkness={0.85} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
