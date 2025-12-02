import { useLanguage } from '../context/LanguageContext';
import styles from '../styles/LanguageSwitcher.module.css';

export default function LanguageSwitcher() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <div className={styles.languageSwitcher}>
      <button 
        onClick={toggleLanguage}
        className={styles.switcherButton}
        aria-label="Switch language"
      >
        <span className={`${styles.langOption} ${language === 'en' ? styles.active : ''}`}>
          EN
        </span>
        <span className={styles.separator}>|</span>
        <span className={`${styles.langOption} ${language === 'es' ? styles.active : ''}`}>
          ES
        </span>
        <span 
          className={styles.slider} 
          style={{ 
            transform: language === 'en' ? 'translateX(0)' : 'translateX(100%)' 
          }}
        />
      </button>
    </div>
  );
}
