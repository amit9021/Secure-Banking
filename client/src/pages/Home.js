import React, { useEffect } from "react";
import { CheckAuth } from "../services/api";
import Header from "../components/Header";
import { Container, Typography, Box, Button, Paper, Grid } from "@mui/material";
import {
  AccountBalance,
  Security,
  Speed,
  Login,
  PersonAdd
} from "@mui/icons-material";
import containerStyles from "../styles/Container.module.css";
import styles from "../styles/components.module.css";

function HomePage({ setPage }) {
  useEffect(() => {
    const check = async () => {
      const isAuthenticated = await CheckAuth();
      if (isAuthenticated) {
        setPage("dashboard");
      }
    };
    check();
  }, [setPage]);

  const features = [
    {
      icon: <AccountBalance sx={{ fontSize: 40, color: "#00695c" }} />,
      title: "Smart Banking",
      description:
        "Experience intelligent financial management with our advanced banking solutions."
    },
    {
      icon: <Security sx={{ fontSize: 40, color: "#00695c" }} />,
      title: "Secure Transactions",
      description:
        "Bank with confidence knowing your transactions are protected by state-of-the-art security."
    },
    {
      icon: <Speed sx={{ fontSize: 40, color: "#00695c" }} />,
      title: "Fast Transfers",
      description:
        "Send and receive money instantly with our lightning-fast transfer system."
    }
  ];

  return (
    <Container className={containerStyles.mainContainer}>
      <Header />
      <Box className={styles.contentBox}>
        <Paper className={styles.card}>
          <Grid container spacing={6}>
            <Grid item xs={12} md={6}>
              <Box>
                <Typography
                  variant="h2"
                  className={styles.gradientText}
                  gutterBottom
                >
                  Banking Made Simple
                </Typography>
                <Typography
                  variant="h5"
                  sx={{ color: "#2c3e50", lineHeight: 1.8, mb: 4 }}
                >
                  Experience the future of banking with Infinity Bank. Smart,
                  secure, and seamless financial solutions at your fingertips.
                </Typography>
                <Box className={styles.flexRow}>
                  <Button
                    onClick={() => setPage("login")}
                    className={styles.primaryButton}
                    startIcon={<Login />}
                  >
                    Log-in
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => setPage("register")}
                    className={styles.button}
                    startIcon={<PersonAdd />}
                  >
                    Register
                  </Button>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Grid container spacing={3}>
                {features.map((feature, index) => (
                  <Grid item xs={12} key={index}>
                    <Paper className={`${styles.card} ${styles.cardHover}`}>
                      <Box className={styles.flexRow}>
                        {feature.icon}
                        <Box>
                          <Typography
                            variant="h6"
                            className={styles.gradientText}
                          >
                            {feature.title}
                          </Typography>
                          <Typography sx={{ color: "#475569" }}>
                            {feature.description}
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
}

export default HomePage;
