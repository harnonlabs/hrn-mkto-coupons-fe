import * as React from "react"
import { useAuth0 } from "@auth0/auth0-react"
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid"
import { Typography, Box, Paper, TextField, Button } from "@mui/material"
import { AppContext } from "../../App"
import Snackbar from "@mui/material/Snackbar"
import EditIcon from "@mui/icons-material/Edit"
import VerifiedIcon from "@mui/icons-material/Verified"
import Modal from "@mui/material/Modal"
import Select from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"

export default function GlobalUsersSCreen() {
  const { user } = useAuth0()
  const [openSnackbar, setOpenSnackbar] = React.useState(false)
  const appContext = React.useContext(AppContext)
  const [data, setData] = React.useState([])
  const [dataFlag, setDataFlag] = React.useState(false)
  const [companyName, setCompanyName] = React.useState("")
  const [columna, setColumna] = React.useState([])
  const [isSubmitDone, setIsSubmitDone] = React.useState(false)
  const [companyList, setCompanyList] = React.useState([])
  const [companyFlag, setCompanyFlag] = React.useState(false)
  const [openModalUserCompany, setOpenModalUserCompany] = React.useState(false)
  const handleOpenModalUserCompany = () => setOpenModalUserCompany(true)
  const handleCloseModalUserCompany = () => setOpenModalUserCompany(false)
  const [selectedCompany, setSelectedCompany] = React.useState("")
  const [selectedEmail, setSelectedEmail] = React.useState("")
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  }
  React.useEffect(() => {
    if (companyList.length > 0) {
      setCompanyFlag(true)
    }
  }, [companyList])
  React.useEffect(() => {
    setColumna([
      { field: "email", headerName: "Email", width: 350 },
      { field: "company", headerName: "Company", width: 200 },
      { field: "approver", headerName: "Approver", width: 80 },
      {
        field: "actions1",
        type: "actions",
        headerName: "Set approver",
        width: 150,
        getActions: (params) => [
          <GridActionsCellItem
            icon={<VerifiedIcon />}
            label="SetApprover"
            onClick={() => {
              selectApprover(params.row["id"])
            }}
          />,
        ],
      },
      {
        field: "actions2",
        type: "actions",
        headerName: "Select company",
        width: 150,
        getActions: (params) => [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="SetApprover"
            onClick={() => {
              selectCompany(params.row["id"])
            }}
          />,
        ],
      },
    ])
  }, [user.email])
  React.useEffect(() => {
    async function getData() {
      try {
        const request = await fetch(
          `${process.env.REACT_APP_WORKER_URL}/listUsers`,
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
          const userResponse = response.find(
            (item) => item.email === user.email
          )

          //  setCompanyName('global Harnon configuration');
          let finalArr = []

          finalArr = response.map((cl) => {
            return {
              id: cl.email,
              email: cl.email,
              company: cl.companyName,
              approver: cl.approver,
            }
          })

          setData(finalArr)
        }
      } catch (err) {
        console.log("ERROR!", err)
      }
    }
    getData()
  }, [appContext.token, user.email])
  React.useEffect(() => {
    if (data.length > 0) {
      getCompanyList()
      setDataFlag(true)
    }
  }, [data])

  const onCloseSnackbar = () => {
    setOpenSnackbar(false)
  }
  async function updateData() {
    try {
      const request = await fetch(
        `${process.env.REACT_APP_WORKER_URL}/listUsers`,
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
        const userResponse = response.find((item) => item.email === user.email)
        setCompanyName(userResponse.companyName)
        let finalArr = []

        finalArr = response.map((cl) => {
          return {
            id: cl.email,
            email: cl.email,
            company: cl.companyName,
            approver: cl.approver,
          }
        })

        setData(finalArr)
      }
    } catch (err) {
      console.log("ERROR!", err)
    }
  }
  const selectApprover = async (email) => {
    try {
      const request = await fetch(
        `${process.env.REACT_APP_WORKER_URL}/pickUsersApprover`,
        {
          method: "POST",
          body: JSON.stringify({
            content: { token: appContext.token, email: email },
          }),
          headers: { "content-type": "application/json" },
        }
      )
      const response = await request.json()
      if (response) {
        updateData()
      }
    } catch (err) {
      console.log("ERROR!", err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const request = await fetch(
        `${process.env.REACT_APP_WORKER_URL}/createCompany`,
        {
          method: "POST",
          body: JSON.stringify({
            content: {
              email: user.email,
              token: appContext.token,
              companyName,
            },
          }),
          headers: { "content-type": "application/json" },
        }
      )
      const response = await request.json()
      setCompanyName("")
      setIsSubmitDone(true)
      getCompanyList()
      return response
    } catch (err) {
      console.log("ERROR!", err)
    }
  }

  const handleSubmitModal = async () => {
    try {
      const request = await fetch(
        `${process.env.REACT_APP_WORKER_URL}/pickCompany`,
        {
          method: "POST",
          body: JSON.stringify({
            content: {
              email: selectedEmail,
              token: appContext.token,
              companyName: selectedCompany,
            },
          }),
          headers: { "content-type": "application/json" },
        }
      )
      const response = await request.json()
      handleCloseModalUserCompany()
      updateData()
      return response
    } catch (err) {
      console.log("ERROR!", err)
    }
  }
  const setCompany = (name) => {
    setCompanyName(name)
    setIsSubmitDone(false)
  }
  const selectCompany = async (email) => {
    setSelectedEmail(email)
    handleOpenModalUserCompany()
  }

  const getCompanyList = async () => {
    try {
      const request = await fetch(
        `${process.env.REACT_APP_WORKER_URL}/listCompanies`,
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
        const array = response.map((cl) => {
          return cl.companyName
        })

        setCompanyList(array)
      }
    } catch (err) {
      console.log("ERROR!", err)
    }
  }
  const handleChangeSelector = (event) => {
    setSelectedCompany(event.target.value)
  }

  // console.log('REACT_APP_WORKER_URL', process.env.REACT_APP_WORKER_URL, 'no');

  return (
    <div style={{ height: 400, width: "100%" }}>
      <>
        <Typography variant="h4" sx={{ mt: 2, mb: 2 }}>
          Create Company
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
            <Box>
              <form>
                <Box>
                  <TextField
                    required
                    id="outlined-required"
                    label="Company Name"
                    sx={{ mb: "1rem" }}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </Box>
                <Button variant="contained" onClick={handleSubmit}>
                  {"Create Company!"}
                </Button>
                {isSubmitDone && (
                  <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>
                    Created!.
                  </Typography>
                )}
              </form>
            </Box>
          </Paper>
        </Box>
      </>
      {dataFlag && (
        <Box key={`dg-user`}>
          <Typography variant="h4" sx={{ mt: "1rem", textAlign: "left" }}>
            {`Harnon Global Users`}
          </Typography>
          <Box sx={{ display: "flex", mt: 2, mb: 2 }}></Box>

          <DataGrid
            rows={data}
            columns={columna}
            pageSize={50}
            rowsPerPageOptions={[50]}
            autoHeight
            initialState={{
              pinnedColumns: {
                right: ["actions"],
              },
            }}
          />
        </Box>
      )}
      <Modal
        open={openModalUserCompany}
        onClose={handleCloseModalUserCompany}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Select Company
            </Typography>
          </Box>
          <Box>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selectedCompany}
              label="Company"
              onChange={handleChangeSelector}
              sx={{ width: "100%", margin: "1rem 0" }}
            >
              {companyFlag &&
                companyList.map((item) => {
                  return (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  )
                })}
            </Select>
          </Box>
          <Button variant="contained" onClick={handleSubmitModal}>
            {"Select Company!"}
          </Button>
        </Box>
      </Modal>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={1000}
        onClose={onCloseSnackbar}
        message={`Key copied to clipboard!`}
      />
    </div>
  )
}
