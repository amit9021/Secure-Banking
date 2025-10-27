import React from "react";
import styles from "../pages/style/home.module.css";

const LoginButton = ({ onClick }) => {
  return (
    <button className={styles.loginButton} type="button" onClick={onClick}>
      Log in
    </button>
  );
};

export default LoginButton;
