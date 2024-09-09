import { createTheme } from "@mui/material";

export const colors = [
  "#FF9A8B", // Light peach
  "#FF6B6B", // Soft red
  "#FFD700", // Gold
  "#A4D4AE", // Soft green
  "#4A90E2", // Soft blue
  "#D0D0D0", // Light gray
];


const theme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#F5F5F5", // Light background color
      paper: "#FFFFFF", // White background for paper elements
    },
    primary: {
      main: "#6C63FF", // Lighter purple shade for primary color
    },
    text: {
      primary: "#333333", // Dark text color for readability
      secondary: "#666666", // Medium dark text color
    },
    divider: "#DDDDDD", // Light divider color
  },
  components: {
    MuiIconButton: {
      defaultProps: {
        size: "small",
      },
    },
    MuiSnackbar: {
      defaultProps: {
        anchorOrigin: {
          vertical: "top",
          horizontal: "center",
        },
      },
    },
    MuiSnackbarContent: {
      styleOverrides: {
        message: {
          fontWeight: 600,
          textTransform: "capitalize",
        },
      },
    },
  },
  typography: {
    fontFamily: "Lato, sans-serif",
    button: {
      textTransform: "unset",
      fontWeight: 700,
    },
    h5: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 700,
    },
  },
  shape: {
    borderRadius: 4, // Slightly rounded corners for a light theme
  },
});

export default theme;
