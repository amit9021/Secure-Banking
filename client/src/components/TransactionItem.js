import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";

const TransactionItem = ({ transaction }) => {
  const isDeposit = transaction > 0;

  return (
    <Paper
      elevation={1}
      sx={{
        p: 2,
        mb: 1,
        borderRadius: "12px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        bgcolor: isDeposit ? "rgba(0, 200, 83, 0.1)" : "rgba(255, 82, 82, 0.1)",
        transition: "transform 0.2s",
        "&:hover": {
          transform: "translateY(-2px)"
        }
      }}
    >
      <Box display="flex" alignItems="center">
        {isDeposit ? (
          <ArrowUpward sx={{ color: "#00c853", mr: 1 }} />
        ) : (
          <ArrowDownward sx={{ color: "#ff5252", mr: 1 }} />
        )}
        <Typography variant="body1" fontWeight="medium">
          {isDeposit ? "Deposit" : "Transfer"}
        </Typography>
      </Box>
      <Typography
        variant="body1"
        fontWeight="bold"
        sx={{ color: isDeposit ? "#00c853" : "#ff5252" }}
      >
        {isDeposit ? "+" : "-"}${Math.abs(transaction).toFixed(2)}
      </Typography>
    </Paper>
  );
};

export default TransactionItem;
