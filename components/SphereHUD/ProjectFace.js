import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

/**
 * A single hexagonal face on the sphere surface.
 * If project is provided → active (colored, interactive, text).
 * If project is null → inactive (dim wireframe, not interactive).
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

  const isActive = project != null;
  const color = isActive ? (project.accent_color || '#ffa742') : '#38bdf8';

  // Build hexagon BufferGeometry (fan from center, 6 triangles)
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const cx = center[0], cy = center[1], cz = center[2];

    // 6 triangles: center → vertex[j] → vertex[(j+1)%6]
    const positions = [];
    const indices = [];

    // Vertex 0 = center
    positions.push(cx, cy, cz);

    // Vertices 1-6 = hexagon corners
    for (let j = 0; j < 6; j++) {
      positions.push(vertices[j].x, vertices[j].y, vertices[j].z);
    }

    // Index triangles
    for (let j = 0; j < 6; j++) {
      indices.push(0, j + 1, ((j + 1) % 6) + 1);
    }

    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return geo;
  }, [center, vertices]);

  // Hover displacement target
  const hoverOffset = useRef(0);

  useFrame((state) => {
    if (!groupRef.current) return;

    if (isActive) {
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
        textRef.current.fillOpacity = opacity;
      }
    }
  });

  // --- INACTIVE FACE (no project) ---
  if (!isActive) {
    return (
      <group>
        <mesh geometry={geometry}>
          <meshBasicMaterial
            color="#38bdf8"
            transparent
            opacity={0.04}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
        {/* Hex border */}
        <lineLoop>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              array={new Float32Array(vertices.flatMap((v) => [v.x, v.y, v.z]))}
              count={6}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#38bdf8" transparent opacity={0.12} />
        </lineLoop>
      </group>
    );
  }

  // --- ACTIVE FACE (has project) ---
  const emissiveIntensity = isSelected ? 1.5 : (isHovered || localHover) ? 0.6 : 0.3;
  const opacity = (isHovered || localHover) ? 0.9 : 0.7;

  return (
    <group ref={groupRef}>
      {/* Hexagon fill */}
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

      {/* Hex border (brighter for active) */}
      <lineLoop>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={new Float32Array(vertices.flatMap((v) => [v.x, v.y, v.z]))}
            count={6}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color={color} transparent opacity={0.6} />
      </lineLoop>

      {/* 3D Text label — only on tablet/desktop + active faces */}
      {enableText3D && (
        <Text
          ref={textRef}
          position={textPosition}
          fontSize={faceRadius * 0.35}
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
