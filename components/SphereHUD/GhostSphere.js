import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Ghost wireframe icosahedron — very faint visual guide
 * suggesting the complete sphere shape.
 */
export default function GhostSphere({
  radius = 1.5,
  color = '#38bdf8',
  opacity = 0.06,
}) {
  const ref = useRef();

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.015;
      ref.current.rotation.x += delta * 0.004;
    }
  });

  return (
    <lineSegments ref={ref}>
      <edgesGeometry args={[new THREE.IcosahedronGeometry(radius, 2)]} />
      <lineBasicMaterial color={color} transparent opacity={opacity} depthWrite={false} />
    </lineSegments>
  );
}
