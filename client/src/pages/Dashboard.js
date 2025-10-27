import React, { useState, useEffect } from "react";
import { GetDashboardData, GetUserData } from "../services/api";
import Transaction from "../components/Transaction";
import Transfer from "../components/Transfer";
import containerStyles from "../styles/Container.module.css";
import {
  Container,
  Box,
  Typography,
  Button,
  Modal,
  IconButton,
  Card,
  Grid
} from "@mui/material";
import { Logout, Refresh, AccountBalance } from "@mui/icons-material";
import Header from "../components/Header";
import styles from "../styles/components.module.css";

function DashboardPage({ setPage }) {
  const [Dashboard, setDash] = useState({
    balance: 0,
    Transaction: []
  });
  const [userName, setUser] = useState("");
  const [showTransfer, setShowTransfer] = useState(false);

  function handleLogOut() {
    localStorage.removeItem("LoginAuth");
    setPage("home");
  }

  const refreshData = async () => {
    try {
      const response = await GetDashboardData();
      const getUserName = await GetUserData();
      if (response) {
        setDash({
          balance: response.Balance,
          Transaction: response.Transactions
        });
        setUser(getUserName);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <Container className={containerStyles.mainContainer}>
      <Header />

      <Card className={styles.card} sx={{ m: 4 }}>
        <Box className={styles.flexBetween}>
          <Typography className={styles.gradientText} variant="h4">
            Welcome, {userName}
          </Typography>
          <IconButton
            color="error"
            onClick={handleLogOut}
            className={styles.button}
          >
            <Logout />
          </IconButton>
        </Box>

        <Grid container spacing={6}>
          <Grid item xs={12} md={6}>
            <Box m={6} className={`${styles.card} ${styles.gradientCard}`}>
              <Box className={styles.flexRow}>
                <AccountBalance sx={{ fontSize: 40 }} />
                <Typography variant="h5" fontWeight="bold">
                  Current Balance
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ my: 2 }}>
                ${Dashboard.balance.toFixed(2)}
              </Typography>
              <Button
                variant="text"
                fullWidth
                onClick={() => setShowTransfer(true)}
                className={styles.primaryButton}
              >
                Transfer Money
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box className={styles.flexBetween}>
              <Typography variant="h5" className={styles.gradientText}>
                Recent Transactions
              </Typography>
              <IconButton onClick={refreshData} color="primary">
                <Refresh />
              </IconButton>
            </Box>
            <Transaction Transactions={Dashboard.Transaction} />
          </Grid>
        </Grid>
      </Card>

      <Modal open={showTransfer} onClose={() => setShowTransfer(false)}>
        <Box sx={{ ...modalStyle }}>
          <Transfer
            balance={Dashboard.balance}
            showPopUp={() => setShowTransfer(false)}
            updateData={refreshData}
          />
        </Box>
      </Modal>
    </Container>
  );
}

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100%",
  maxWidth: 500,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "16px"
};

export default DashboardPage;
