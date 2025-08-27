import { useEffect, useState } from "react";
import { Snackbar, Alert } from "@mui/material";

interface SnackbarProps {
  message?: string;
  duration?: number; 
}

const MySnackbar = ({ message, duration = 3000 }: SnackbarProps) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (message) {
      setOpen(true);
      const timer = setTimeout(() => setOpen(false), duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration]);

  if (!message) return null;

  const severity = message.toLowerCase().includes("erro") ? "error" : "success";

  return (
    <Snackbar open={open} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
      <Alert onClose={() => setOpen(false)} severity={severity} variant="filled">
        {message}
      </Alert>
    </Snackbar>
  );
};

export default MySnackbar;