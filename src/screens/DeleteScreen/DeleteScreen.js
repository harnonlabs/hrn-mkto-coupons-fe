import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { AppContext } from './../../App';
import { Button, Box, Paper } from '@mui/material';
import { useCheckUserValidity } from '../../utils/useCheckUserValidity';
import PickerCouponsLists from '../../components/PickerCouponsLists/PickerCouponsLists';
import { deleteCouponList } from './queries';

export default function InstallScreen() {
  const appContext = React.useContext(AppContext);
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [message, setMessage] = React.useState();
  const [CheckUserValidity] = useCheckUserValidity();
  const [isSubmitDone, setIsSubmitDone] = React.useState(false);
  const [selectedCouponsList, setSelectedCouponsList] = React.useState();
  const [selectedCouponsListEmail, setSelectedCouponsListEmail] =
    React.useState();
  React.useEffect(() => {
    async function CheckUser() {
      await CheckUserValidity(user.email, appContext.token);
    }
    CheckUser();
  }, []);

  const onDelete = async () => {
    try {
      // console.log('test getcoupon');
      // const request = await fetch(
      //   `${process.env.REACT_APP_WORKER_URL}/getCoupon`,
      //   {
      //     method: 'POST',
      //     body: JSON.stringify({
      //       content: {
      //         token: appContext.token,
      //         email: user.email,
      //         couponsList: 'TYWJI3DW5yVx7Q98LedaLotqddAy0Kg2bWFd9+OVhDw=',
      //       },
      //     }),
      //     headers: { 'content-type': 'application/json' },
      //   },
      // );
      // const response = await request.json();
      const response = await deleteCouponList(
        selectedCouponsListEmail,
        selectedCouponsList,
        user.email,
      );

      console.log('resp', response);
      if (response) {
        setIsSubmitDone(true);
        setMessage('Coupon list deleted successfully!');
      }
    } catch (err) {
      console.log('ERROR!', err);
    }
  };

  const onDeleteAll = async () => {
    try {
      const request = await fetch(
        `${process.env.REACT_APP_WORKER_URL}/deleteAll`,
        {
          method: 'POST',
          body: JSON.stringify({
            content: { token: appContext.token, email: user.email },
          }),
          headers: { 'content-type': 'application/json' },
        },
      );
      const response = await request.json();
      // if (response) {
      //   setMessage('Coupon list deleted successfully');
      // }
    } catch (err) {
      console.log('ERROR!', err);
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Paper
          sx={{
            width: '55%',
            padding: '2rem',
          }}
          elevation={4}
        >
          <PickerCouponsLists
            setter={setSelectedCouponsList}
            setterEmail={setSelectedCouponsListEmail}
            ApprovedFilter={false}
          />

          <Button
            variant="contained"
            onClick={onDelete}
            disabled={isSubmitDone}
          >
            Delete coupon list
          </Button>
          {message && <Box> {message}</Box>}
        </Paper>
      </Box>

      {/* <Button variant="contained" color="secondary" onClick={onDeleteAll}>
        DELETE ALL!
      </Button> */}
      {/* {message} */}
    </Box>
  );
}
