import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function Gem() {
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 0.7;
    if (lightRef.current) {
      lightRef.current.position.set(Math.sin(t) * 2.5, 1.5, Math.cos(t) * 2.5);
    }
  });

  const mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#a8d4f5'),
        metalness: 0.3,
        roughness: 0.05,
        transparent: true,
        opacity: 0.9,
      }),
    []
  );

  return (
    <>
      <pointLight ref={lightRef} color="#ffffff" intensity={2} distance={8} />
      <group position={[0, 0.175, 0]}>
        {/* Crown */}
        <mesh material={mat} position={[0, 0.125, 0]}>
          <cylinderGeometry args={[0.35, 0.5, 0.25, 8, 1]} />
        </mesh>
        {/* Pavilion */}
        <mesh material={mat} position={[0, -0.3, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.5, 0.6, 8, 1]} />
        </mesh>
      </group>
    </>
  );
}

export default function Diamond3DViewer() {
  return (
    // absolute inset-0 fills the parent's relative+aspect-square container
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 0.5, 2.5], fov: 40 }}
        gl={{ antialias: true }}
        dpr={[1, 2]}
        onCreated={({ scene }) => {
          scene.background = new THREE.Color('#ffffff');
        }}
      >
        <ambientLight intensity={1.5} />
        <directionalLight position={[4, 6, 4]} intensity={2} />
        <directionalLight position={[-3, 2, -3]} intensity={1} color="#b0c8ff" />
        <Gem />
        <OrbitControls
          enablePan={false}
          minDistance={1.5}
          maxDistance={5}
          autoRotate
          autoRotateSpeed={1.5}
          enableDamping
          dampingFactor={0.05}
        />
      </Canvas>
      <p className="pointer-events-none absolute bottom-3 inset-x-0 text-center text-[10px] tracking-widest text-foreground/30 uppercase">
        Drag to rotate · Scroll to zoom
      </p>
    </div>
  );
}
