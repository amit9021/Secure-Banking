import React from "react";
import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import Logo from "./logo";
import styles from "../styles/Header.module.css";

const Header = () => {
  return (
    <AppBar position="static" className={styles.appBar}>
      <Toolbar className={styles.toolbar}>
        <Box display="flex" alignItems="center">
          <Logo />
          <Typography variant="h4" className={styles.title}>
            Infinity Bank
          </Typography>
        </Box>
        <Box>
          <Button
            variant="text"
            className={styles.navButton}
            onClick={() => alert("Navigate to Features")}
          >
            Features
          </Button>
          <Button
            variant="text"
            className={styles.navButton}
            onClick={() => alert("Navigate to Pricing")}
          >
            Pricing
          </Button>
          <Button
            variant="contained"
            color="secondary"
            className={styles.contactButton}
            onClick={() => alert("Navigate to Contact Us")}
          >
            Contact Us
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
