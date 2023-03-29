import * as React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { Typography, Box, TextField, Button, Paper } from '@mui/material';
import { AppContext } from '../../App';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { ResetTvOutlined } from '@mui/icons-material';
import Snackbar from '@mui/material/Snackbar';
import EditIcon from '@mui/icons-material/Edit';
import VerifiedIcon from '@mui/icons-material/Verified';

export default function AccountScreen() {
  const { user, isLoading } = useAuth0();
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [copiedKey, setCopiedKey] = React.useState('');
  const appContext = React.useContext(AppContext);
  const [data, setData] = React.useState([]);
  const [dataFlag, setDataFlag] = React.useState(false);
  const [unauthorized, setUnauthorized] = React.useState(false);
  const [companyName, setCompanyName] = React.useState('');
  const [isSubmitDone, setIsSubmitDone] = React.useState(false);

  React.useEffect(() => {
    async function getUserInfo() {
      try {
        const request = await fetch(
          `${process.env.REACT_APP_WORKER_URL}/listUsers`,
          {
            method: 'POST',
            body: JSON.stringify({
              content: { token: appContext.token, email: user.email },
            }),
            headers: { 'content-type': 'application/json' },
          },
        );
        const response = await request.json();

        if (response) {
          const userResponse = response.find(
            (item) => item.email === user.email,
          );
          setDataFlag(false);

          if (!userResponse) {
            //  getData();
            setDataFlag(true);
          } else {
            setUnauthorized(true);
          }
        }
      } catch (err) {
        console.log('ERROR!', err);
      }
    }
    getUserInfo();
  }, []);

  React.useEffect(() => {
    if (data.length > 0) {
    }
  }, [data]);

  const onCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const setCompany = (name) => {
    setCompanyName(name);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const request = await fetch(
        `${process.env.REACT_APP_WORKER_URL}/createUser`,
        {
          method: 'POST',
          body: JSON.stringify({
            content: {
              email: user.email,
              token: appContext.token,
              companyName,
            },
          }),
          headers: { 'content-type': 'application/json' },
        },
      );
      const response = await request.json();

      setIsSubmitDone(true);
      return response;
    } catch (err) {
      console.log('ERROR!', err);
    }
  };
  console.log('REACT_APP_WORKER_URL', process.env.REACT_APP_WORKER_URL, 'no');

  return (
    <div style={{ height: 400, width: '100%' }}>
      {dataFlag && (
        <>
          <Typography variant="h4" sx={{ mt: 2, mb: 2 }}>
            Create user
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Paper
              sx={{
                width: '35%',
                padding: '2rem',
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
                      sx={{ mb: '1rem' }}
                      onChange={(e) => setCompany(e.target.value)}
                    />
                  </Box>
                  <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={isSubmitDone}
                  >
                    {isSubmitDone ? 'User succesfully created' : 'Create User!'}
                  </Button>
                </form>
              </Box>
            </Paper>
          </Box>
        </>
      )}
      {/* {unauthorized && (
        <Box>
          <Typography variant="h4" sx={{ mt: '1rem', textAlign: 'left' }}>
            {'please do stuff'}
          </Typography>
        </Box>
      )} */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={1000}
        onClose={onCloseSnackbar}
        message={`Key copied to clipboard!`}
      />
    </div>
  );
}
