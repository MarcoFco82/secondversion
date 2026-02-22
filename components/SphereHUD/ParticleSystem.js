import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Orbital particle system around the sphere.
 * Particles move in tangential orbits with slight randomness.
 */
export default function ParticleSystem({ count = 200 }) {
  const pointsRef = useRef();

  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = [];

    for (let i = 0; i < count; i++) {
      // Random position on a shell between radius 1.7 and 2.3
      const r = 1.7 + Math.random() * 0.6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      // Tangential velocity (orbit around Y axis with some noise)
      const speed = 0.002 + Math.random() * 0.004;
      const direction = Math.random() > 0.5 ? 1 : -1;
      vel.push({ speed: speed * direction, drift: (Math.random() - 0.5) * 0.0005 });
    }

    return { positions: pos, velocities: vel };
  }, [count]);

  useFrame(() => {
    if (!pointsRef.current) return;
    const posArray = pointsRef.current.geometry.attributes.position.array;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const x = posArray[idx];
      const z = posArray[idx + 2];

      // Rotate around Y axis
      const angle = velocities[i].speed;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);

      posArray[idx] = x * cos - z * sin;
      posArray[idx + 2] = x * sin + z * cos;

      // Slight vertical drift
      posArray[idx + 1] += velocities[i].drift;

      // Keep particles in range
      const y = posArray[idx + 1];
      if (Math.abs(y) > 2.3) {
        velocities[i].drift *= -1;
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#38bdf8"
        size={0.008}
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
