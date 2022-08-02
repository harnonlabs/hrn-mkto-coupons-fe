import React from "react"
import { useAuth0 } from "@auth0/auth0-react"
import { AppContext } from "./../../App"
import { Button, Box } from "@mui/material"

export default function InstallScreen() {
  const appContext = React.useContext(AppContext)
  const { user, isAuthenticated, isLoading } = useAuth0()
  const [message, setMessage] = React.useState()

  const onDelete = async () => {
    try {
      const request = await fetch(
        `https://worker.harnonlabs.workers.dev/delete`,
        {
          method: "POST",
          body: JSON.stringify({
            content: { token: appContext.token, email: user.email },
          }),
          headers: { "content-type": "application/json" },
        }
      )
      const response = await request.json()
      if (response) {
        setMessage(response)
      }
    } catch (err) {
      console.log("ERROR!", err)
    }
  }
  return (
    <Box>
      <Button variant="contained" onClick={onDelete}>
        Delete All Coupons
      </Button>
      {/* {message} */}
    </Box>
  )
}
