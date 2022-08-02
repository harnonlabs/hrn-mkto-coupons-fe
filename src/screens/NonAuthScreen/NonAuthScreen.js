import React from "react"
import { Box, Typography, Paper } from "@mui/material"
import LoginButton from "../../components/auth0/LoginBtn"
import logo from "./logo.svg"

function NonAuthScreen() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        width: "100vw",
        height: "100vh",
        backgroundColor: "#2C2A4A",
      }}
    >
      <img src={logo} width="200px" alt="Harnon Marketo Coupons" />
      <Paper
        elevation={4}
        sx={{
          width: "30%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: 5,
        }}
      >
        <Typography variant="h4" sx={{ margin: 2 }}>
          Marketo Coupons
        </Typography>
        <Typography variant="body" sx={{ margin: 2 }}>
          Log in with your credentials to start
        </Typography>
        <LoginButton />
      </Paper>
    </Box>
  )
}

export default NonAuthScreen
