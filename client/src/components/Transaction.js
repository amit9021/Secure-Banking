import React from "react";
import { Box } from "@mui/material";
import TransactionItem from "./TransactionItem";

const Transactions = ({ Transactions = [] }) => {
  return (
    <Box
      sx={{
        maxHeight: "400px",
        overflowY: "auto",
        pr: 1,
        "&::-webkit-scrollbar": {
          width: "8px"
        },
        "&::-webkit-scrollbar-track": {
          background: "rgba(0, 105, 92, 0.1)",
          borderRadius: "10px"
        },
        "&::-webkit-scrollbar-thumb": {
          background: "#00695c",
          borderRadius: "10px",
          "&:hover": {
            background: "#004d40"
          }
        },
        mt: 2
      }}
    >
      {Transactions?.map((amount, index) => (
        <TransactionItem key={index} transaction={amount} />
      ))}
    </Box>
  );
};

export default Transactions;
