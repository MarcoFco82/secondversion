import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Interactive project node on the sphere surface.
 * Diamond-shaped octahedron with hover/select states and label.
 */
export default function ProjectNode({
  project,
  position,
  isSelected,
  isHovered,
  onClick,
  onHover,
  onUnhover,
}) {
  const meshRef = useRef();
  const [localHover, setLocalHover] = useState(false);
  const showLabel = isSelected || isHovered || localHover;

  // Pulsing scale animation when selected
  useFrame((state) => {
    if (!meshRef.current) return;

    if (isSelected) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.15;
      meshRef.current.scale.setScalar(pulse);
    } else if (localHover || isHovered) {
      meshRef.current.scale.setScalar(1.3);
    } else {
      meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
    }
  });

  const color = project.accent_color || '#ffa742';

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onClick(project);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setLocalHover(true);
          onHover(project);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setLocalHover(false);
          onUnhover();
          document.body.style.cursor = 'auto';
        }}
      >
        <octahedronGeometry args={[0.06, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isSelected ? 1.5 : localHover ? 1 : 0.5}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Label */}
      {showLabel && (
        <Html
          distanceFactor={4}
          style={{
            pointerEvents: 'none',
            transform: 'translate3d(15px, -50%, 0)',
            whiteSpace: 'nowrap',
          }}
        >
          <div
            style={{
              background: 'rgba(42, 47, 56, 0.92)',
              border: `1px solid ${color}`,
              borderRadius: '4px',
              padding: '4px 8px',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '10px',
              color: '#e8e8e8',
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
            }}
          >
            <span style={{ color, fontWeight: 600 }}>
              {project.code}
            </span>
            <span style={{ color: '#94a3b8', fontSize: '9px' }}>
              {project.alias} — {project.progress ?? 0}%
            </span>
          </div>
        </Html>
      )}
    </group>
  );
}
