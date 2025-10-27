"use client";
import React, { useState, useEffect } from "react";
import { Fragment } from "react";
import HomePage from "./pages/Home";
import RegisterPage from "./pages/Register";
import LoginPage from "./pages/Login";
import DashboardPage from "./pages/Dashboard";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

function InfinityBank() {
  const [currentPage, setCurrentPage] = useState("home");

  function setPage(page) {
    setCurrentPage(page);
  }

  // Update page title dynamically
  useEffect(() => {
    const titles = {
      home: "Infinity Bank - Home",
      login: "Infinity Bank - Login",
      register: "Infinity Bank - Register",
      dashboard: "Infinity Bank - Dashboard"
    };
    document.title = titles[currentPage] || "Infinity Bank";
  }, [currentPage]);

  // Define MUI theme for consistent styling
  const theme = createTheme({
    palette: {
      primary: {
        main: "#00695c",
        contrastText: "#ffffff"
      },
      secondary: {
        main: "#00695c",
        contrastText: "#ffffff"
      },
      background: {
        default: "#e0f7fa",
        paper: "#ffffff"
      },
      text: {
        primary: "#00695c",
        secondary: "#00695c"
      }
    },
    typography: {
      fontFamily: "'Roboto Mono', monospace"
    }
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div role="main">
        <Fragment>
          {currentPage === "home" && <HomePage setPage={setPage} />}
          {currentPage === "login" && <LoginPage setPage={setPage} />}
          {currentPage === "register" && <RegisterPage setPage={setPage} />}
          {currentPage === "dashboard" && <DashboardPage setPage={setPage} />}
        </Fragment>
      </div>
    </ThemeProvider>
  );
}

export default InfinityBank;
