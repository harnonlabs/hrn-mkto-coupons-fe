import React from "react"
import { useAuth0 } from "@auth0/auth0-react"
import { AppContext } from "./../../App"
import Divider from "@mui/material/Divider"

import { Button, Box, Typography, Paper } from "@mui/material"
import PickerCouponsLists from "../../components/PickerCouponsLists/PickerCouponsLists"

export default function TestCouponsScreen() {
  const { user } = useAuth0()
  const [coupon, setCoupon] = React.useState()
  const [couponSpent, setCouponSpent] = React.useState()
  const [selectedCouponsList, setSelectedCouponsList] = React.useState()

  const appContext = React.useContext(AppContext)

  const testCoupon = async (x) => {
    try {
      const request = await fetch(`${process.env.REACT_APP_WORKER_URL}/test`, {
        method: "POST",
        body: JSON.stringify({
          content: {
            email: user.email,
            token: appContext.token,
            couponsList: selectedCouponsList,
          },
        }),
        headers: { "content-type": "application/json" },
      })
      const response = await request.json()
      setCoupon(response.coupon)
      return response
    } catch (err) {
      console.log("ERROR!", err)
    }
  }

  const spendCoupon = async (x) => {
    try {
      const request = await fetch(`${process.env.REACT_APP_WORKER_URL}/spend`, {
        method: "POST",
        body: JSON.stringify({
          content: {
            email: user.email,
            token: appContext.token,
            couponsList: selectedCouponsList,
          },
        }),
        headers: { "content-type": "application/json" },
      })
      const response = await request.json()
      setCouponSpent(response.coupon)
      return response
    } catch (err) {
      console.log("ERROR!", err)
    }
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mt: 2, mb: 2, textAlign: "left" }}>
        Testing
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
          <PickerCouponsLists setter={setSelectedCouponsList} />
          <Button variant="contained" onClick={testCoupon} sx={{ mb: 1 }}>
            Test Coupon
          </Button>
          {coupon && <Box>Coupon: {coupon}</Box>}
          <Divider sx={{ margin: 5 }}>OR</Divider>
          <Button
            variant="contained"
            color="secondary"
            onClick={spendCoupon}
            sx={{ mb: 1 }}
          >
            Spend Coupon
          </Button>
          {couponSpent && <Box>Coupon: {couponSpent}</Box>}
        </Paper>
      </Box>
    </Box>
  )
}
