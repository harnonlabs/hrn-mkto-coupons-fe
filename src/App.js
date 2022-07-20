import "./App.css"
import React from "react"
import { Typography, TextField, Button, Box } from "@mui/material"
import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"

import { useAuth0 } from "@auth0/auth0-react"
import LoginButton from "./components/auth0/LoginBtn"
import LogoutButton from "./components/auth0/LogoutButton"
import UserProfile from "./components/auth0/UserProfile"

import H from "./img/H.svg"

const defaultContext = {}
export const AppContext = React.createContext(defaultContext)

function App() {
  const { getAccessTokenSilently } = useAuth0()
  React.useEffect(() => {
    async function callAccessToken() {
      try {
        const accessToken = await getAccessTokenSilently({
          audience: `http://hmn.auth.api`,
          scope: "read:current_user",
        })

        console.log(accessToken)
        // setToken(accessToken)
      } catch (e) {
        console.log(e.message)
      }
    }
    callAccessToken()
  }, [getAccessTokenSilently])

  return (
    <AppContext.Provider value={defaultContext}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Box sx={{ mr: 2 }}>
              <img src={H} width="40" sx={{ mr: 2 }} alt="Harnon.co" />
            </Box>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              HRN MARKETO COUPONS
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>

      <div className="login">
        <LoginButton />
        <LogoutButton />
        <p>space</p>
        <UserProfile />
      </div>
    </AppContext.Provider>
  )
}

export default App
