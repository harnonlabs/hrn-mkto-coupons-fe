import "./main-screen.css"
import React from "react"
import {
  Typography,
  Button,
  Box,
  TextField,
  Card,
  Chip,
  Paper,
} from "@mui/material"
import ContentCopyIcon from "@mui/icons-material/ContentCopy"
import { useAuth0 } from "@auth0/auth0-react"
import { AppContext } from "../../App"
import { Routes, Route, Link } from "react-router-dom"

function copyToClipboard(e) {
  let copyText = document.getElementById("key-text")
  navigator.clipboard.writeText(copyText.textContent)
  alert("Copied the text: " + copyText.textContent)
}

function LoadCouponScreen() {
  const { user, isAuthenticated, isLoading } = useAuth0()
  const appContext = React.useContext(AppContext)
  const fileReader = new FileReader()
  const [name, setName] = React.useState()
  const [file, setFile] = React.useState()
  const [couponKey, setCouponKey] = React.useState()
  const [csvToJSON, setCsvToJSON] = React.useState([])
  const [isSubmitDone, setIsSubmitDone] = React.useState(false)

  const csvToObj = string => {
    const csvRows = string.slice(string.indexOf("\n") + 1).split("\n")

    const result = csvRows.reduce((acc, cur) => {
      const [coupon, isUsed] = cur.split(";")
      if (coupon === "") {
        return acc
      }
      return { ...acc, [coupon]: { isUsed: false, dateUsed: null } }
    }, {})

    setCsvToJSON(result)

    return result
  }

  const handleOnChange = e => {
    setFile(e.target.files[0])
  }

  const sendToServer = async x => {
    try {
      const request = await fetch(
        `https://worker.harnonlabs.workers.dev/load`,
        {
          method: "POST",
          body: JSON.stringify({
            content: {
              csv: x,
              email: user.email,
              token: appContext.token,
              name,
            },
          }),
          headers: { "content-type": "application/json" },
        }
      )
      const response = await request.json()
      return response
    } catch (err) {
      console.log("ERROR!", err)
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()

    if (file) {
      fileReader.onload = async function (event) {
        const csvOutput = event.target.result
        const json = csvToObj(csvOutput)
        const response = await sendToServer(json)
        if (response.message === "loaded") {
          setIsSubmitDone(true)
          setCouponKey(response.data)
        }
      }

      fileReader.readAsText(file)
    }
  }

  return (
    <>
      <Typography variant="h4" sx={{ mt: 2, mb: 2 }}>
        Load coupons
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper
          sx={{
            width: "35%",
            padding: "2rem",
          }}
          elevation={4}
        >
          <TextField
            required
            id="outlined-required"
            label="Coupons List Name"
            sx={{ mb: "1rem" }}
            onChange={e => setName(e.target.value)}
          />
          <Typography variant="body1" sx={{ mb: 5 }}>
            Load your CSV file with all your coupons included
          </Typography>
          <form name="coupons" id="couponsForm">
            <Box>
              <input
                type={"file"}
                accept={".csv"}
                id={"csvFileInput"}
                onChange={handleOnChange}
                style={{
                  backgroundColor: "#4F518C",
                  color: "#fff",
                  borderRadius: "5px",
                  marginBottom: "1rem",
                }}
              />
            </Box>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={isSubmitDone}
            >
              {isSubmitDone ? "Coupons succesfully loaded!" : "Load coupons!"}
            </Button>
          </form>
          {couponKey && (
            <Box sx={{ mt: "2rem" }}>
              Your coupon key{" "}
              <Chip
                avatar={<ContentCopyIcon />}
                label="Copy!"
                component="a"
                clickable
                onClick={copyToClipboard}
                sx={{ padding: "1rem" }}
                color="primary"
              />
              <Box sx={{ mt: "1rem", fontSize: "0.8rem" }}>
                Save this key. You will need it to enter in Marketo. Take a look
                at our <Link to="/how-to-install">Install Instructions</Link> to
                learn how to do it
              </Box>
            </Box>
          )}
          {couponKey && (
            <Card
              sx={{
                minWidth: 275,
                margin: "1rem",
                padding: "2rem",
                fontSize: "1.5rem",
              }}
            >
              <span id="key-text">{couponKey}</span>
            </Card>
          )}
        </Paper>
      </Box>
    </>
  )
}

export default LoadCouponScreen
