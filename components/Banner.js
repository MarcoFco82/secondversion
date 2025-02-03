import React from 'react';
import styles from '../styles/Banner.module.css'; // Importamos los estilos específicos del banner

const Banner = ({ text }) => {
  return (
    <div className={styles.bannerContainer}>
      <div className={styles.bannerText}>
        {text}
      </div>
    </div>
  );
};

export default Banner;