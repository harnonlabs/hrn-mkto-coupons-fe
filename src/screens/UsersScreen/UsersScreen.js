import * as React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { DataGrid } from '@mui/x-data-grid';
import { Typography, Box } from '@mui/material';
import { AppContext } from '../../App';
import Snackbar from '@mui/material/Snackbar';
import { useCheckUserValidity } from '../utils/useCheckUserValidity';

export default function UsersSCreen() {
  const { user } = useAuth0()
  const [openSnackbar, setOpenSnackbar] = React.useState(false)
  const appContext = React.useContext(AppContext);
  const [data, setData] = React.useState([]);
  const [dataFlag, setDataFlag] = React.useState(false);
  const [companyName, setCompanyName] = React.useState('');
  const [columna, setColumna] = React.useState([]);
  const [CheckUserValidity] = useCheckUserValidity();

  React.useEffect(() => {
    async function CheckUser() {
      await CheckUserValidity(user.email, appContext.token);
    }
    CheckUser();
  }, []);

  React.useEffect(() => {
    setColumna([
      { field: "email", headerName: "Email", width: 350 },
      { field: "approver", headerName: "Approver", width: 80 },
    ])
  }, [user.email])
  React.useEffect(() => {
    async function getData() {
      try {
        console.log("columna", columna)
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

          setCompanyName(userResponse.companyName)
          let finalArr = []
          const filterCompanyUsers = response.filter(
            (item) => item.companyName === companyName
          )

          finalArr = filterCompanyUsers.map((cl) => {
            return {
              id: cl.email,
              email: cl.email,
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
  }, [appContext.token, companyName, user.email])
  React.useEffect(() => {
    if (data.length > 0) {
      setDataFlag(true)
    }
  }, [data])

  const onCloseSnackbar = () => {
    setOpenSnackbar(false)
  }
  console.log("REACT_APP_WORKER_URL", process.env.REACT_APP_WORKER_URL, "no")

  return (
    <div style={{ height: 400, width: "100%" }}>
      {/* {dataFlag && <p>({data[0].email})</p>} */}
      {dataFlag && (
        <Box key={`dg-user`}>
          <Typography variant="h4" sx={{ mt: 2, mb: 2, textAlign: "left" }}>
            Users
          </Typography>
          <Typography variant="h6" sx={{ mt: "1rem", textAlign: "left" }}>
            {`Company: ${companyName}`}
          </Typography>
          <Box sx={{ display: "flex", mt: 2, mb: 2 }}></Box>
          {/* <Typography variant="h6" sx={{ textAlign: "left" }}>
                {cl.key}
              </Typography> */}
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
      <Snackbar
        open={openSnackbar}
        autoHideDuration={1000}
        onClose={onCloseSnackbar}
        message={`Key copied to clipboard!`}
      />
    </div>
  )
}
