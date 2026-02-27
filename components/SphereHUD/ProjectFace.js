import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Billboard } from '@react-three/drei';
import * as THREE from 'three';

/**
 * A single hexagonal face on the sphere surface.
 * If project is provided → active (colored, interactive, text).
 * If project is null → inactive (dim wireframe, not interactive).
 *
 * ALL faces float along their normal like objects on water.
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
  sphereConfig,
}) {
  const groupRef = useRef();
  const meshRef = useRef();
  const textRef = useRef();
  const [localHover, setLocalHover] = useState(false);

  const { center, normal, vertices, textPosition, faceRadius } = faceData;
  const normalVec = useMemo(() => new THREE.Vector3(...normal), [normal]);
  const centerVec = useMemo(() => new THREE.Vector3(...center), [center]);

  const isActive = project != null;
  const color = isActive ? (project.accent_color || '#ffa742') : (sphereConfig.strokeColor || '#38bdf8');

  // Build hexagon BufferGeometry (fan from center, 6 triangles)
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const cx = center[0], cy = center[1], cz = center[2];
    const positions = [];
    const indices = [];

    positions.push(cx, cy, cz);
    for (let j = 0; j < 6; j++) {
      positions.push(vertices[j].x, vertices[j].y, vertices[j].z);
    }
    for (let j = 0; j < 6; j++) {
      indices.push(0, j + 1, ((j + 1) % 6) + 1);
    }

    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return geo;
  }, [center, vertices]);

  // Floating animation — deterministic per face based on position
  const floatPhase = useMemo(
    () => (center[0] * 13.7 + center[1] * 7.3 + center[2] * 19.1) % (Math.PI * 2),
    [center],
  );
  const floatSpeed = useMemo(
    () => 0.35 + Math.abs(center[1]) * 0.3,
    [center],
  );
  const floatAmplitude = 0.03;

  // Hover displacement target (active faces only)
  const hoverOffset = useRef(0);

  useFrame((state) => {
    if (!groupRef.current) return;

    // Floating offset — all faces bob along their normal like water surface
    const floatOffset = Math.sin(state.clock.elapsedTime * floatSpeed + floatPhase) * floatAmplitude;

    if (isActive) {
      const active = isSelected || isHovered || localHover;

      // Hover: extra displacement outward
      const targetHover = active ? 0.06 : 0;
      hoverOffset.current = THREE.MathUtils.lerp(hoverOffset.current, targetHover, 0.08);
      const totalOffset = floatOffset + hoverOffset.current;

      groupRef.current.position.set(
        totalOffset * normalVec.x,
        totalOffset * normalVec.y,
        totalOffset * normalVec.z,
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
    } else {
      // Inactive faces: just float
      groupRef.current.position.set(
        floatOffset * normalVec.x,
        floatOffset * normalVec.y,
        floatOffset * normalVec.z,
      );
    }
  });

  // Config values with fallbacks
  const strokeColor = sphereConfig.strokeColor || '#38bdf8';
  const strokeOpacity = sphereConfig.strokeOpacity ?? 1.0;
  const inactiveFillOpacity = sphereConfig.inactiveFillOpacity ?? 0.03;
  const emissiveBase = sphereConfig.activeEmissiveBase ?? 0.5;
  const emissiveHover = sphereConfig.activeEmissiveHover ?? 1.2;
  const emissiveSelected = sphereConfig.activeEmissiveSelected ?? 2.5;

  // --- INACTIVE FACE (no project) ---
  if (!isActive) {
    return (
      <group ref={groupRef}>
        <mesh geometry={geometry}>
          <meshBasicMaterial
            color={strokeColor}
            transparent
            opacity={inactiveFillOpacity}
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
          <lineBasicMaterial color={strokeColor} transparent opacity={strokeOpacity} />
        </lineLoop>
      </group>
    );
  }

  // --- ACTIVE FACE (has project) ---
  const emissiveIntensity = isSelected ? emissiveSelected : (isHovered || localHover) ? emissiveHover : emissiveBase;
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
        <lineBasicMaterial color={color} transparent opacity={0.8} />
      </lineLoop>

      {/* 3D Text label — billboard: always faces camera */}
      {enableText3D && (
        <Billboard position={textPosition} follow lockX={false} lockY={false} lockZ={false}>
          <Text
            ref={textRef}
            fontSize={faceRadius * 0.35}
            color={color}
            anchorX="center"
            anchorY="middle"
            fillOpacity={1}
            outlineWidth={0}
          >
            {project.code || project.alias || '???'}
          </Text>
        </Billboard>
      )}
    </group>
  );
}
