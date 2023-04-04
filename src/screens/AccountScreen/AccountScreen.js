import * as React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Typography } from '@mui/material';
import { AppContext } from '../../App';

import Snackbar from '@mui/material/Snackbar';

export default function AccountScreen({ accountData }) {
  const { user } = useAuth0();
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const appContext = React.useContext(AppContext);
  const [data, setData] = React.useState([]);
  const [dataFlag, setDataFlag] = React.useState(false);
  const [companyName, setCompanyName] = React.useState('');

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

          if (!userResponse || userResponse.companyName === '') {
            //  getData();
            await createUser();
            accountData(false);
            setDataFlag(true);
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

  const createUser = async () => {
    try {
      const request = await fetch(
        `${process.env.REACT_APP_WORKER_URL}/createUser`,
        {
          method: 'POST',
          body: JSON.stringify({
            content: {
              email: user.email,
              token: appContext.token,
              companyName: '',
            },
          }),
          headers: { 'content-type': 'application/json' },
        },
      );
      const response = await request.json();
      console.log('created response', response);
      //setIsSubmitDone(true);
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
          {' '}
          <Typography variant="h4" sx={{ mt: 2, mb: 2 }}>
            User created, please wait a couple of hours until it is validated
            and approved.
          </Typography>
        </>
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
