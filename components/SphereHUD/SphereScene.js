import { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import GhostSphere from './GhostSphere';
import ProjectFace from './ProjectFace';
import ParticleSystem from './ParticleSystem';
import ActivityRing from './ActivityRing';
import { generateFaceGeometry } from './utils/generateFaceGeometry';

/**
 * Main R3F Canvas scene — hexagonal faces on sphere surface.
 * Active projects get colored faces; the rest stay dim as structure.
 */
export default function SphereScene({
  projects,
  activityData,
  selectedProject,
  hoveredProject,
  onNodeClick,
  onNodeHover,
  onNodeUnhover,
  autoRotate,
  performanceConfig,
  sphereConfig,
}) {
  const { dpr, particleCount, enableBloom, enableActivityRing, enablePostProcessing, enableText3D, mobileBloomIntensity } =
    performanceConfig;

  const hexCount = sphereConfig.hexCount || 30;
  const hexSize = sphereConfig.hexSize ?? 0.22;

  // Generate face geometries based on dynamic hexCount and hexSize
  const faceGeometries = useMemo(() => generateFaceGeometry(1.5, hexCount, hexSize), [hexCount, hexSize]);

  // Map projects to evenly spaced face indices (avoids clustering at north pole)
  const projectByFaceIndex = useMemo(() => {
    const map = new Map();
    if (projects.length === 0 || hexCount === 0) return map;
    const step = hexCount / projects.length;
    for (let j = 0; j < projects.length; j++) {
      // Offset by half-step to skip pole (index 0), spread across full sphere
      const faceIdx = Math.min(Math.floor(j * step + step / 2), hexCount - 1);
      map.set(faceIdx, projects[j]);
    }
    return map;
  }, [projects, hexCount]);

  return (
    <Canvas
      dpr={dpr}
      camera={{ position: [0, 0, 4.3], fov: 45 }}
      style={{ background: 'transparent' }}
      gl={{ alpha: true, antialias: true }}
    >
      <Suspense fallback={null}>
        {/* Lighting */}
        <ambientLight intensity={0.15} />
        <pointLight position={[3, 2, 4]} color="#38bdf8" intensity={0.8} />
        <pointLight position={[-3, -1, -2]} color="#ffa742" intensity={0.4} />

        {/* Controls */}
        <OrbitControls
          autoRotate={autoRotate}
          autoRotateSpeed={0.5}
          enablePan={false}
          minDistance={2.5}
          maxDistance={6}
          enableDamping
          dampingFactor={0.05}
        />

        {/* Tilted group — diagonal rotation effect */}
        <group rotation={[0.35, 0, 0.15]}>

        {/* Ghost wireframe sphere */}
        <GhostSphere
          radius={1.5}
          color={sphereConfig.ghostSphereColor}
          opacity={sphereConfig.ghostSphereOpacity}
        />

        {/* Hexagonal faces — projects distributed evenly, rest are inactive */}
        {faceGeometries.map((faceData, i) => {
          const project = projectByFaceIndex.get(i) || null;
          return (
            <ProjectFace
              key={`${hexCount}-${i}`}
              project={project}
              faceData={faceData}
              isSelected={project ? selectedProject?.id === project.id : false}
              isHovered={project ? hoveredProject?.id === project.id : false}
              onClick={onNodeClick}
              onHover={onNodeHover}
              onUnhover={onNodeUnhover}
              enableText3D={enableText3D}
              sphereConfig={sphereConfig}
            />
          );
        })}

        {/* Particles */}
        <ParticleSystem
          count={particleCount}
          color={sphereConfig.particleColor}
          size={sphereConfig.particleSize}
          opacity={sphereConfig.particleOpacity}
        />

        {/* Activity ring (desktop only) */}
        {enableActivityRing && <ActivityRing activityData={activityData} />}

        </group>

        {/* Post-processing */}
        {enablePostProcessing && (
          <EffectComposer>
            {enableBloom && (
              <Bloom
                luminanceThreshold={sphereConfig.bloomThreshold}
                luminanceSmoothing={sphereConfig.bloomSmoothing}
                intensity={mobileBloomIntensity ?? sphereConfig.bloomIntensity}
                mipmapBlur
              />
            )}
            <Noise opacity={0.02} />
            <Vignette eskil={false} offset={0.1} darkness={0.6} />
          </EffectComposer>
        )}
      </Suspense>
    </Canvas>
  );
}
