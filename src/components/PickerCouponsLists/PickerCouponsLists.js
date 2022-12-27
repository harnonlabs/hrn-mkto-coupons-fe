import * as React from "react"
import Box from "@mui/material/Box"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import FormControl from "@mui/material/FormControl"
import Select from "@mui/material/Select"
import { useAuth0 } from "@auth0/auth0-react"
import { AppContext } from "./../../App"

export default function PickerCouponsLists({ setter }) {
  const { user, isAuthenticated, isLoading } = useAuth0()
  const appContext = React.useContext(AppContext)
  const [couponsList, setCouponsList] = React.useState()
  const [selectedCouponList, setSelectedCouponList] = React.useState("")

  const handleChange = (event) => {
    setSelectedCouponList(event.target.value)
    setter(event.target.value)
  }

  React.useEffect(() => {
    async function getData() {
      try {
        const request = await fetch(
          `${process.env.REACT_APP_WORKER_URL}/list`,
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
          setCouponsList(response)
        }
      } catch (err) {
        console.log("ERROR!", err)
      }
    }
    getData()
  }, [])

  return (
    <Box sx={{ minWidth: 120, mb: "1rem" }}>
      <FormControl fullWidth>
        <InputLabel id="cooupon-list-label">Select a coupon list</InputLabel>
        <Select
          labelId="cooupon-list-label"
          id="coupon-list-select"
          value={selectedCouponList}
          label="Select a coupon list"
          onChange={handleChange}
        >
          {couponsList ? (
            couponsList.map((couponList) => (
              <MenuItem key={couponList.key} value={couponList.key}>
                {couponList.name}
              </MenuItem>
            ))
          ) : (
            <MenuItem value={selectedCouponList}>No Coupons Lists</MenuItem>
          )}
        </Select>
      </FormControl>
    </Box>
  )
}
