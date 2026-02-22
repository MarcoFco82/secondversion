import { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import HolographicSphere from './HolographicSphere';
import ProjectNode from './ProjectNode';
import ParticleSystem from './ParticleSystem';
import ActivityRing from './ActivityRing';
import { fibonacciSphere } from './utils/fibonacciSphere';

/**
 * Main R3F Canvas scene containing the holographic sphere,
 * project nodes, particles, activity ring, and post-processing.
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
  const { dpr, particleCount, enableBloom, enableActivityRing, enablePostProcessing } =
    performanceConfig;

  // Calculate node positions using fibonacci distribution
  const nodePositions = useMemo(() => {
    if (projects.length === 0) return [];
    return fibonacciSphere(projects.length, 1.55);
  }, [projects.length]);

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

        {/* Core sphere */}
        <HolographicSphere />

        {/* Project nodes */}
        {projects.map((project, i) => (
          <ProjectNode
            key={project.id}
            project={project}
            position={nodePositions[i] || [0, 0, 0]}
            isSelected={selectedProject?.id === project.id}
            isHovered={hoveredProject?.id === project.id}
            onClick={onNodeClick}
            onHover={onNodeHover}
            onUnhover={onNodeUnhover}
          />
        ))}

        {/* Particles */}
        <ParticleSystem count={particleCount} />

        {/* Activity ring (desktop only) */}
        {enableActivityRing && <ActivityRing activityData={activityData} />}

        {/* Post-processing */}
        {enablePostProcessing && (
          <EffectComposer>
            {enableBloom && (
              <Bloom
                luminanceThreshold={0.8}
                luminanceSmoothing={0.3}
                intensity={0.6}
                mipmapBlur
              />
            )}
            <Noise opacity={0.02} />
            <Vignette eskil={false} offset={0.1} darkness={0.8} />
          </EffectComposer>
        )}
      </Suspense>
    </Canvas>
  );
}
