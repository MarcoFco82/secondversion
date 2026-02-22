import { useState, useEffect } from 'react';

const DEFAULTS = {
  hexCount: 30,
  hexSize: 0.22,
  bloomThreshold: 0.1,
  bloomIntensity: 1.5,
  bloomSmoothing: 0.5,
  particleColor: '#38bdf8',
  particleSize: 0.01,
  particleOpacity: 0.8,
  strokeColor: '#38bdf8',
  strokeOpacity: 1.0,
  ghostSphereColor: '#38bdf8',
  ghostSphereOpacity: 0.1,
  inactiveFillOpacity: 0.03,
  activeEmissiveBase: 0.5,
  activeEmissiveHover: 1.2,
  activeEmissiveSelected: 2.5,
  bgGradientTop: '#0f1923',
  bgGradientBottom: '#0a0a0a',
};

export { DEFAULTS as SPHERE_CONFIG_DEFAULTS };

export function useSphereConfig() {
  const [config, setConfig] = useState(DEFAULTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/sphere-config')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setConfig({ ...DEFAULTS, ...data.data });
        }
      })
      .catch(() => {
        // Silently use defaults
      })
      .finally(() => setLoading(false));
  }, []);

  return { config, loading };
}
