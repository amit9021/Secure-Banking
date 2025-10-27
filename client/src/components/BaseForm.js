import React from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Paper
} from "@mui/material";
import styles from "../styles/components.module.css";

const BaseForm = ({
  title,
  fields,
  onSubmit,
  errorMsg,
  submitButtonText,
  setPage
}) => {
  return (
    <Box className={styles.contentBox}>
      <Paper
        className={`${styles.card} ${styles.cardHover}`}
        sx={{ maxWidth: 400, width: "100%" }}
      >
        <Typography variant="h4" className={styles.gradientText} gutterBottom>
          {title}
        </Typography>

        <Box component="form" onSubmit={onSubmit} sx={{ mt: 2 }}>
          {fields.map((field) => (
            <TextField
              key={field.name}
              fullWidth
              margin="normal"
              label={field.label}
              type={field.type}
              value={field.value}
              onChange={field.onChange}
              required={field.required}
              error={field.error}
              helperText={field.helperText}
              sx={{ mb: 2 }}
            />
          ))}

          {errorMsg && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMsg}
            </Alert>
          )}

          <Button
            type="submit"
            fullWidth
            className={styles.primaryButton}
            sx={{ mb: 2 }}
          >
            {submitButtonText}
          </Button>

          <Box className={styles.flexRow} sx={{ justifyContent: "center" }}>
            <Typography variant="body2" sx={{ color: "#475569" }}>
              {title === "Login"
                ? "Don't have an account?"
                : "Already have an account?"}
            </Typography>
            <Button
              onClick={() => setPage(title === "Login" ? "register" : "login")}
              sx={{ textTransform: "none" }}
            >
              {title === "Login" ? "Sign Up" : "Sign In"}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default BaseForm;
