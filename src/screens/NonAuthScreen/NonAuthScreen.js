import React from "react"
import { Box, Typography } from "@mui/material"
import LoginButton from "../../components/auth0/LoginBtn"

function NonAuthScreen() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <Typography variant="h2">Harnon Marketo Coupons</Typography>
      <LoginButton />
    </Box>
  )
}

export default NonAuthScreen
