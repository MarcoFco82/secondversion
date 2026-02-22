import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Activity ring around the sphere — torus with 14 bar segments
 * representing daily activity over the last 14 days.
 */
export default function ActivityRing({ activityData = [] }) {
  const groupRef = useRef();

  // Normalize activity data to 14 days
  const bars = useMemo(() => {
    const data = activityData.slice(0, 14);
    const max = Math.max(...data, 1);

    return data.map((value, i) => {
      const angle = (i / 14) * Math.PI * 2;
      const radius = 2.2;
      const height = 0.05 + (value / max) * 0.25;

      return {
        position: [
          Math.cos(angle) * radius,
          0,
          Math.sin(angle) * radius,
        ],
        rotation: [0, -angle + Math.PI / 2, 0],
        height,
        value,
        opacity: 0.3 + (value / max) * 0.7,
      };
    });
  }, [activityData]);

  // Slow rotation
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.03;
    }
  });

  if (bars.length === 0) return null;

  return (
    <group ref={groupRef}>
      {/* Base torus ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.2, 0.003, 8, 64]} />
        <meshBasicMaterial color="#ffa742" transparent opacity={0.3} />
      </mesh>

      {/* Activity bars */}
      {bars.map((bar, i) => (
        <mesh key={i} position={bar.position} rotation={bar.rotation}>
          <boxGeometry args={[0.04, bar.height, 0.015]} />
          <meshStandardMaterial
            color="#ffa742"
            emissive="#ffa742"
            emissiveIntensity={0.5}
            transparent
            opacity={bar.opacity}
          />
        </mesh>
      ))}
    </group>
  );
}
