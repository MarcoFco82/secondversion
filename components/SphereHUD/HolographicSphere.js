import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Wireframe } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Holographic wireframe icosahedron sphere.
 * Rotates slowly on its own axis.
 */
export default function HolographicSphere() {
  const meshRef = useRef();
  const wireRef = useRef();

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.02;
      meshRef.current.rotation.x += delta * 0.005;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Transparent solid fill */}
      <mesh>
        <icosahedronGeometry args={[1.5, 2]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.03}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Wireframe overlay */}
      <mesh>
        <icosahedronGeometry args={[1.5, 2]} />
        <Wireframe
          stroke="#38bdf8"
          backfaceStroke="#1e5a7a"
          thickness={0.003}
          squeeze
          fillOpacity={0}
        />
      </mesh>
    </group>
  );
}
