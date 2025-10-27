import { Box, Typography } from "@mui/material";

export default function Balance({ balance }) {
  return (
    <Box textAlign="center" mt={3}>
      <Typography variant="h4" component="h1">
        Your Balance
      </Typography>
      <Typography variant="h5" component="h2">
        ${balance.toFixed(2)}
      </Typography>
    </Box>
  );
}
