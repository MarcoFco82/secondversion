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
 * Main R3F Canvas scene — 30 hexagonal faces on sphere surface.
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
}) {
  const { dpr, particleCount, enableBloom, enableActivityRing, enablePostProcessing, enableText3D } =
    performanceConfig;

  // Always 30 hexagonal faces
  const faceGeometries = useMemo(() => generateFaceGeometry(1.5), []);

  return (
    <Canvas
      dpr={dpr}
      camera={{ position: [0, 0, 4.5], fov: 45 }}
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
          minDistance={3}
          maxDistance={7}
          enableDamping
          dampingFactor={0.05}
        />

        {/* Ghost wireframe sphere */}
        <GhostSphere radius={1.5} />

        {/* 30 hexagonal faces — first N are active projects, rest are inactive */}
        {faceGeometries.map((faceData, i) => {
          const project = i < projects.length ? projects[i] : null;
          return (
            <ProjectFace
              key={i}
              project={project}
              faceData={faceData}
              isSelected={project ? selectedProject?.id === project.id : false}
              isHovered={project ? hoveredProject?.id === project.id : false}
              onClick={onNodeClick}
              onHover={onNodeHover}
              onUnhover={onNodeUnhover}
              enableText3D={enableText3D}
            />
          );
        })}

        {/* Particles */}
        <ParticleSystem count={particleCount} />

        {/* Activity ring (desktop only) */}
        {enableActivityRing && <ActivityRing activityData={activityData} />}

        {/* Post-processing */}
        {enablePostProcessing && (
          <EffectComposer>
            {enableBloom && (
              <Bloom
                luminanceThreshold={1.2}
                luminanceSmoothing={0.3}
                intensity={0.4}
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
