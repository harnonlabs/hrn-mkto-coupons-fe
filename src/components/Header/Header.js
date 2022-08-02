import React from "react"
import { Typography, Box } from "@mui/material"
import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import LoginButton from "./../../components/auth0/LoginBtn"
import LogoutButton from "./../../components/auth0/LogoutButton"
import H from "./../../img/H.svg"

export default function Header() {
  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              backgroundColor: "red",
            }}
          >
            <Box sx={{ mr: 2 }}>
              <img src={H} width="40" sx={{ mr: 2 }} alt="Harnon.co" />
            </Box>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              HRN MARKETO COUPONS
            </Typography>
            <LoginButton />
            <LogoutButton />
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  )
}
