import { useState, useEffect } from 'react';
import styles from './SphereIntro.module.css';

const translations = {
  en: {
    badge: 'LIVE DEV FEED',
    headline: "What I'm building right now",
    subline: 'Real projects, real progress — updated as I code.',
  },
  es: {
    badge: 'EN DESARROLLO',
    headline: 'Lo que estoy construyendo ahora',
    subline: 'Proyectos reales, progreso real — actualizado mientras programo.',
  },
};

function useMexicoCityClock() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'America/Mexico_City',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    const update = () => setTime(fmt.format(new Date()));
    update();
    const interval = setInterval(update, 60_000);
    return () => clearInterval(interval);
  }, []);

  return time;
}

export default function SphereIntro({ lang = 'en' }) {
  const t = translations[lang] || translations.en;
  const clock = useMexicoCityClock();

  return (
    <div className={styles.introWrapper}>
      <div className={styles.introContent}>
        <div className={styles.badgeRow}>
          <span className={styles.badge}>{t.badge}</span>
          {clock && <span className={styles.clock}>{clock} CDMX</span>}
        </div>
        <h2 className={styles.headline}>{t.headline}</h2>
        <p className={styles.subline}>{t.subline}</p>
      </div>
    </div>
  );
}
