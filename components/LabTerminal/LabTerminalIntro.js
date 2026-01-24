import styles from './LabTerminalIntro.module.css';

const translations = {
  en: {
    badge: 'LIVE DEV FEED',
    headline: 'What I\'m building right now',
    subline: 'Real projects, real progress — updated as I code.',
  },
  es: {
    badge: 'EN DESARROLLO',
    headline: 'Lo que estoy construyendo ahora',
    subline: 'Proyectos reales, progreso real — actualizado mientras programo.',
  }
};

export default function LabTerminalIntro({ lang = 'en' }) {
  const t = translations[lang] || translations.en;

  return (
    <div className={styles.introWrapper}>
      <div className={styles.introContent}>
        <span className={styles.badge}>{t.badge}</span>
        <h2 className={styles.headline}>{t.headline}</h2>
        <p className={styles.subline}>{t.subline}</p>
      </div>
    </div>
  );
}
