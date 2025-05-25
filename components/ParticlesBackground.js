import { useCallback, useEffect, useState, useMemo } from 'react';
import Particles from "react-tsparticles";
import { Engine } from "tsparticles-engine";
import { loadSlim } from "tsparticles-slim";

const particleOptions = {
  light: {
    color: "#3b424c",
  },
  dark: {
    color: "#e8e8e8",
  }
};

export default function ParticlesBackground({ 
  theme = "light",
  size = 8,
  speed = 1 
}) {
  const [init, setInit] = useState(false);
  const [particleCount, setParticleCount] = useState(3); // Reduced count for performance

  useEffect(() => {
    const handleResize = () => {
      setParticleCount(window.innerWidth < 768 ? 8 : 15);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    setInit(true);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
    engine.pauseOnBlur = true;
  }, []);

  const options = useMemo(() => ({
    fullScreen: {
      enable: false, // We control full screen via CSS
      zIndex: -1
    },
    fpsLimit: 60,
    particles: {
      number: { 
        value: particleCount,
        density: {
          enable: true,
          value_area: 1000
        }
      },
      color: { 
        value: particleOptions[theme].color
      },
      shape: {
        type: "polygon",
        polygon: {
          nb_sides: 6,
        }
      },
      opacity: {
        value: 0.8,
        random: true,
        anim: {
          enable: true,
          speed: 0.5,
          opacity_min: 0.3,
          sync: false
        }
      },
      size: {
        value: { min: size, max: size * 3.5 },
        random: true,
        anim: {
          enable: true,
          speed: 2,
          size_min: size * 0.7,
          sync: false
        }
      },
      rotate: {
        value: 0,
        random: true,
        direction: "clockwise",
        animation: {
          enable: true,
          speed: 8,
          sync: false
        }
      },
      links: {
        enable: false
      },
      move: {
        enable: true,
        speed: speed * 0.5,
        direction: "none",
        random: true,
        straight: false,
        outModes: "bounce",
        attract: {
          enable: false
        }
      }
    },
    interactivity: {
      detect_on: "window",
      events: {
        onHover: {
          enable: true,
          mode: "grab",
          parallax: {
            enable: true,
            force: 30,
            smooth: 10
          }
        },
        onClick: {
          enable: true,
          mode: "push"
        }
      },
      modes: {
        grab: {
          distance: 120,
          links: {
            opacity: 0.3
          }
        },
        push: {
          quantity: 3
        }
      }
    },
    polygon: {
      enable: true,
      scale: 0.8,
      type: "inline",
      move: {
        radius: 10
      },
      draw: {
        enable: true,
        stroke: {
          color: particleOptions[theme].color,
          width: 0.5
        }
      }
    },
    detectRetina: true,
    performance: {
      maxParticles: 30,
      limit: 30,
      reduceDuplicates: true
    }
  }), [theme, size, speed, particleCount]);

  if (!init) return null;

  return (
    <Particles
      id={`tsparticles-${theme}`} // Unique ID per theme
      init={particlesInit}
      options={options}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none'
      }}
    />
  );
}