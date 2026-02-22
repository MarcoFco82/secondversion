import { useState, useEffect } from 'react';

const DEFAULTS = {
  hexCount: 30,
  bloomThreshold: 0.6,
  bloomIntensity: 0.8,
  bloomSmoothing: 0.4,
  particleColor: '#38bdf8',
  particleSize: 0.008,
  particleOpacity: 0.6,
  strokeColor: '#38bdf8',
  strokeOpacity: 1.0,
  ghostSphereColor: '#38bdf8',
  ghostSphereOpacity: 0.06,
  inactiveFillOpacity: 0.02,
  activeEmissiveBase: 0.3,
  activeEmissiveHover: 0.8,
  activeEmissiveSelected: 2.0,
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
