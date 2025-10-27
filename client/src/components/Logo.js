import React from "react";
import styles from "../home.module.css";

const Logo = () => {
  return (
    <div className={styles.logoContainer}>
      <img
        src="/logo.png"
        alt="Logo"
        className={`${styles.logo} ${styles.logoSmall}`}
      />
    </div>
  );
};

export default Logo;
