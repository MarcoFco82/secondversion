import { useRef, useMemo, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

/**
 * A single project face — equilateral triangle on the sphere surface
 * with 3D text label and interactive hover/click/selection states.
 */
export default function ProjectFace({
  project,
  faceData,
  isSelected,
  isHovered,
  onClick,
  onHover,
  onUnhover,
  enableText3D,
}) {
  const groupRef = useRef();
  const meshRef = useRef();
  const textRef = useRef();
  const [localHover, setLocalHover] = useState(false);

  const { center, normal, vertices, textPosition, faceRadius } = faceData;
  const normalVec = useMemo(() => new THREE.Vector3(...normal), [normal]);
  const centerVec = useMemo(() => new THREE.Vector3(...center), [center]);

  const color = project.accent_color || '#ffa742';

  // Build triangle BufferGeometry once
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array([
      vertices[0].x, vertices[0].y, vertices[0].z,
      vertices[1].x, vertices[1].y, vertices[1].z,
      vertices[2].x, vertices[2].y, vertices[2].z,
    ]);
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.computeVertexNormals();
    return geo;
  }, [vertices]);

  // Hover displacement target
  const hoverOffset = useRef(0);
  const textOpacity = useRef(1);

  useFrame((state) => {
    if (!groupRef.current) return;

    const active = isSelected || isHovered || localHover;

    // Hover: displace outward along normal
    const targetOffset = active ? 0.06 : 0;
    hoverOffset.current = THREE.MathUtils.lerp(hoverOffset.current, targetOffset, 0.08);

    groupRef.current.position.set(
      hoverOffset.current * normalVec.x,
      hoverOffset.current * normalVec.y,
      hoverOffset.current * normalVec.z,
    );

    // Selected pulse
    if (isSelected && meshRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.08;
      meshRef.current.scale.setScalar(pulse);
    } else if (meshRef.current) {
      meshRef.current.scale.setScalar(1);
    }

    // Text opacity: dot product with camera direction
    if (textRef.current && enableText3D) {
      const camDir = state.camera.position.clone().sub(centerVec).normalize();
      const dot = normalVec.dot(camDir);
      const opacity = THREE.MathUtils.smoothstep(dot, 0.0, 0.3);
      textOpacity.current = opacity;
      textRef.current.fillOpacity = opacity;
    }
  });

  // Emissive intensity based on state
  const emissiveIntensity = isSelected ? 1.5 : (isHovered || localHover) ? 0.6 : 0.3;
  const opacity = (isHovered || localHover) ? 0.9 : 0.7;

  return (
    <group ref={groupRef}>
      {/* Triangle face */}
      <mesh
        ref={meshRef}
        geometry={geometry}
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
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={emissiveIntensity}
          transparent
          opacity={opacity}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* 3D Text label — only on tablet/desktop */}
      {enableText3D && (
        <Text
          ref={textRef}
          position={textPosition}
          fontSize={faceRadius * 0.3}
          color={color}
          anchorX="center"
          anchorY="middle"
          fillOpacity={1}
          outlineWidth={0}
        >
          {project.code || project.alias || '???'}
        </Text>
      )}
    </group>
  );
}
