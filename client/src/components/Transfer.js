import { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Slider,
  IconButton
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { MakeTransfer } from "../services/api";

export default function Transfer({ balance, showPopUp, updateData }) {
  const [formData, setFormData] = useState({
    reciver: "",
    amount: 0
  });

  function updateField(field, value) {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const response = await MakeTransfer(formData);
    updateData();

    setFormData({
      reciver: "",
      amount: 0
    });
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <IconButton color="primary" onClick={showPopUp} sx={{ mb: 2 }}>
        <Close />
      </IconButton>
      <Typography variant="h4" component="h1" gutterBottom>
        Transfer
      </Typography>
      <TextField
        fullWidth
        margin="normal"
        label="Receiver Address"
        type="email"
        value={formData.reciver}
        required
        onChange={(event) => updateField("reciver", event.target.value)}
      />
      <Typography gutterBottom>Amount</Typography>
      <Slider
        value={formData.amount}
        min={0}
        max={balance}
        step={1}
        onChange={(event, newValue) => updateField("amount", newValue)}
        valueLabelDisplay="auto"
      />
      <Typography gutterBottom>
        Balance after Transfer: ${balance - formData.amount}
      </Typography>
      <Button
        fullWidth
        variant="contained"
        color="primary"
        type="submit"
        sx={{ mt: 2 }}
      >
        Transfer ${formData.amount}
      </Button>
    </Box>
  );
}
