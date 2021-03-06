import * as React from "react"
import { useAuth0 } from "@auth0/auth0-react"
import { DataGrid } from "@mui/x-data-grid"
import { Typography, Box, Chip } from "@mui/material"
import { AppContext } from "../../App"
import ContentCopyIcon from "@mui/icons-material/ContentCopy"
import { ResetTvOutlined } from "@mui/icons-material"
import Snackbar from "@mui/material/Snackbar"

const columns = [
  { field: "coupon", headerName: "Coupon Number", width: 150 },
  { field: "isUsed", headerName: "Is Used?", width: 80 },
  { field: "dateUsed", headerName: "Date Used", width: 150 },
]

export default function DataTable() {
  const { user, isAuthenticated, isLoading } = useAuth0()
  const [openSnackbar, setOpenSnackbar] = React.useState(false)
  const [copiedKey, setCopiedKey] = React.useState("")
  const appContext = React.useContext(AppContext)
  const [data, setData] = React.useState([])

  React.useEffect(() => {
    async function getData() {
      try {
        const request = await fetch(
          `https://worker.harnonlabs.workers.dev/view`,
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
          let finalArr = []
          const x = response.map(cl => {
            return { name: cl.name, key: cl.key, coupons: { ...cl.coupons } }
          })
          for (let i = 0; i < x.length; i++) {
            let c = x[i]["coupons"]
            let result = []
            for (const [key, value] of Object.entries(c)) {
              result.push({ id: key, coupon: key, ...value })
            }
            let final = {
              name: x[i]["name"],
              key: x[i]["key"],
              coupons: result,
            }
            finalArr.push(final)
          }
          setData(finalArr)
        }
      } catch (err) {
        console.log("ERROR!", err)
      }
    }
    getData()
  }, [])

  const copyToClipboard = e => {
    let copyText = e.target
    console.log(e.target)
    navigator.clipboard.writeText(copyText.textContent)
    setCopiedKey(copyText.textContent)
    setOpenSnackbar(true)
  }

  const onCloseSnackbar = () => {
    setOpenSnackbar(false)
  }

  return (
    <div style={{ height: 400, width: "100%" }}>
      {data &&
        data.map((cl, idx) => {
          return (
            <Box key={`dg-${idx}`}>
              <Typography variant="h4" sx={{ mt: "1rem", textAlign: "left" }}>
                {cl.name}
              </Typography>
              <Box sx={{ display: "flex", mt: 2, mb: 2 }}>
                <Chip
                  icon={<ContentCopyIcon />}
                  label={cl.key}
                  variant="outlined"
                  color="success"
                  onClick={copyToClipboard}
                  size="small"
                  sx={{ padding: 1, borderStyle: "dashed" }}
                />
              </Box>
              {/* <Typography variant="h6" sx={{ textAlign: "left" }}>
                {cl.key}
              </Typography> */}
              <DataGrid
                rows={cl.coupons}
                columns={columns}
                pageSize={50}
                rowsPerPageOptions={[50]}
                autoHeight
                // checkboxSelection
              />
            </Box>
          )
        })}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={1000}
        onClose={onCloseSnackbar}
        message={`Key copied to clipboard!`}
      />
    </div>
  )
}
