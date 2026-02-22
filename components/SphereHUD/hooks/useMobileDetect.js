import { useState, useEffect } from 'react';

/**
 * Detects device tier for progressive quality degradation.
 * Returns performance settings based on viewport width.
 */
export function useMobileDetect() {
  const [tier, setTier] = useState('desktop');

  useEffect(() => {
    const detect = () => {
      const w = window.innerWidth;
      if (w < 768) setTier('mobile');
      else if (w < 1024) setTier('tablet');
      else setTier('desktop');
    };

    detect();
    window.addEventListener('resize', detect);
    return () => window.removeEventListener('resize', detect);
  }, []);

  const config = {
    mobile: {
      dpr: [1, 1],
      particleCount: 80,
      enableBloom: false,
      enableActivityRing: false,
      enablePostProcessing: false,
    },
    tablet: {
      dpr: [1, 1.5],
      particleCount: 120,
      enableBloom: true,
      enableActivityRing: false,
      enablePostProcessing: true,
    },
    desktop: {
      dpr: [1, 2],
      particleCount: 200,
      enableBloom: true,
      enableActivityRing: true,
      enablePostProcessing: true,
    },
  };

  return { tier, ...config[tier] };
}
