import "./App.css"
import React from "react"
import { Typography, TextField, Button, Box } from "@mui/material"
import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import ListItemAvatar from "@mui/material/ListItemAvatar"
import ListSubheader from "@mui/material/ListSubheader"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import Divider from "@mui/material/Divider"
import NewReleasesIcon from "@mui/icons-material/NewReleases"
import H from "./img/H.svg"

function App() {
  const fileReader = new FileReader()
  const [file, setFile] = React.useState()
  const [csvToJSON, setCsvToJSON] = React.useState([])
  const [coupon, setCoupon] = React.useState()
  const [isSubmitDone, setIsSubmitDone] = React.useState(false)
  const [couponTest, setCouponTest] = React.useState()
  const [couponError, setCouponError] = React.useState()

  const csvToObj = string => {
    const csvRows = string.slice(string.indexOf("\n") + 1).split("\n")

    const result = csvRows.reduce((acc, cur) => {
      const [coupon, isUsed] = cur.split(";")
      if (coupon === "") {
        return acc
      }
      return { ...acc, [coupon]: { isUsed, date: null } }
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
        `https://hrn-mkto-coupons.harnonlabs.workers.dev/load`,
        {
          method: "POST",
          body: JSON.stringify({ csv: x }),
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
        if (response.message) {
          setIsSubmitDone(true)
        }
      }

      fileReader.readAsText(file)
    }
  }

  const handleChangeCoupon = e => {
    setCoupon(e.target.value)
  }

  const handleSubmitCoupon = async e => {
    e.preventDefault()

    try {
      const request = await fetch(
        `https://hrn-mkto-coupons.harnonlabs.workers.dev/test?coupon=${coupon}`,
        {
          headers: { "content-type": "application/json" },
        }
      )
      const response = await request.json()
      console.log(response)
      if (response.status === "error") {
        setCouponError(response.errorMessage)
      }
      if (response.status === "found") {
        setCouponTest("Coupon list found!")
      }
      return response
    } catch (err) {
      console.log("ERROR!", err)
    }
  }

  return (
    <>
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

      <div className="App">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h2" sx={{ mt: 2, mb: 2 }}>
            Load coupons
          </Typography>
          <Typography variant="body1">
            Load your CSV file with all your coupons included
          </Typography>
          <form name="coupons" id="couponsForm">
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "50em",
              }}
            >
              <input
                type={"file"}
                accept={".csv"}
                id={"csvFileInput"}
                onChange={handleOnChange}
              />

              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={isSubmitDone}
              >
                {isSubmitDone ? "Coupons succesfully loaded!" : "Load coupons!"}
              </Button>
            </Box>
          </form>

          <form name="getCoupon" id="getCoupon">
            <Divider />
            <List
              sx={{
                width: "100%",
                maxWidth: 360,
                bgcolor: "background.paper",
                mt: 5,
              }}
              subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                  Check if your coupons list was uploaded
                </ListSubheader>
              }
            >
              <ListItem>
                <ListItemText>
                  <TextField
                    label="Type your access key"
                    sx={{ margin: "10px" }}
                    onChange={handleChangeCoupon}
                    name="coupon"
                  />
                </ListItemText>
                <ListItemAvatar>
                  <Button variant="contained" onClick={handleSubmitCoupon}>
                    Test!
                  </Button>
                </ListItemAvatar>
              </ListItem>
              {couponTest && (
                <ListItem>
                  <ListItemText
                    primary={couponTest}
                    secondary="Ready to connect to Marketo!"
                  />
                  <ListItemAvatar>
                    <CheckCircleIcon color="success" sx={{ fontSize: 40 }} />
                  </ListItemAvatar>
                </ListItem>
              )}
              {couponError && (
                <ListItem>
                  <ListItemText
                    primary={couponError}
                    secondary="Try uploading your coupons list again"
                    color="error"
                  />
                  <ListItemAvatar>
                    <NewReleasesIcon color="error" sx={{ fontSize: 40 }} />
                  </ListItemAvatar>
                </ListItem>
              )}
            </List>
          </form>
        </Box>
      </div>
    </>
  )
}

export default App
