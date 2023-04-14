import * as React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { DataGrid } from '@mui/x-data-grid';
import { Typography, Box } from '@mui/material';
import { AppContext } from '../../App';
import Snackbar from '@mui/material/Snackbar';
import { useCheckUserValidity } from '../../utils/useCheckUserValidity';
import { getCompanies, getUsers } from '../../utils/queries';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

export default function UsersSCreen() {
  const { user } = useAuth0();
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
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
      { field: 'email', headerName: 'Email', width: 350 },
      { field: 'approver', headerName: 'Approver', width: 80 },
    ]);
  }, [user.email]);
  React.useEffect(() => {
    async function getData() {
      try {
        // console.log('columna', columna);
        // const request = await fetch(
        //   `${process.env.REACT_APP_WORKER_URL}/listUsers`,
        //   {
        //     method: 'POST',
        //     body: JSON.stringify({
        //       content: { token: appContext.token, email: user.email },
        //     }),
        //     headers: { 'content-type': 'application/json' },
        //   },
        // );
        // const response = await request.json();
        const response = await getUsers();
        if (response) {
          const userResponse = response.find(
            (item) => item.email === user.email,
          );
          const companies = await getCompanies();
          let company = companies.find(
            (item) => item.id === userResponse.company_id,
          );
          company ? setCompanyName(company.name) : setCompanyName('');
          let finalArr = [];
          const filterCompanyUsers = response.filter(
            (item) => item.company_id === userResponse.company_id,
          );

          finalArr = filterCompanyUsers.map((user) => {
            return {
              id: user.email,
              email: user.email,
              approver: user.role === 1 || user.role === 2 ? true : false,
            };
          });
          console.log('a');
          setData(finalArr);
        }
      } catch (err) {
        console.log('ERROR!', err);
      }
    }
    getData();
  }, [user.email]);
  React.useEffect(() => {
    if (data.length > 0) {
      setDataFlag(true);
    }
  }, [data]);

  const onCloseSnackbar = () => {
    setOpenSnackbar(false);
  };
  console.log('REACT_APP_WORKER_URL', process.env.REACT_APP_WORKER_URL, 'no');

  return (
    <div style={{ height: 400, width: '100%' }}>
      {/* {dataFlag && <p>({data[0].email})</p>} */}
      {!dataFlag && (
        <div style={{ height: 300, width: '100%' }}>
          <Stack spacing={1}>
            <Skeleton variant="rectangular" width={300} height={28} />
            <Skeleton variant="rectangular" width={200} height={28} />
            <Skeleton variant="rectangular" width={200} height={28} />
            <Skeleton
              variant="rounded"
              width={window.innerWidth - 100}
              height={300}
            />
          </Stack>
        </div>
      )}
      {dataFlag && (
        <Box key={`dg-user`}>
          <Typography variant="h4" sx={{ mt: 2, mb: 2, textAlign: 'left' }}>
            Users
          </Typography>
          <Typography variant="h6" sx={{ mt: '1rem', textAlign: 'left' }}>
            {`Company: ${companyName}`}
          </Typography>
          <Box sx={{ display: 'flex', mt: 2, mb: 2 }}></Box>
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
                right: ['actions'],
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
  );
}
