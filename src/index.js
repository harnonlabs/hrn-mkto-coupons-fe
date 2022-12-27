import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import App from "./App"
import reportWebVitals from "./reportWebVitals"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import { Auth0Provider } from "@auth0/auth0-react"
import { BrowserRouter } from "react-router-dom"

const theme = createTheme({
  palette: {
    primary: {
      main: "#2C2A4A",
    },
    secondary: {
      main: "#4F518C",
    },
  },
  success: "#7FDEFF",
  error: "#DABFFF",
})

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <Auth0Provider
    domain="harnonlabs.us.auth0.com"
    clientId="wKf0ngU3qQjCbLDvaRlYgxLxXVv9RtT2"
    redirectUri={process.env.REACT_APP_FE_URL}
    useRefreshTokens={true}
    scope="openid profile email manage:coupons"
    audience="https://hrn-auth.harnon.co"
  >
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </Auth0Provider>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
