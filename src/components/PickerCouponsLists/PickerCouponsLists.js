import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useAuth0 } from '@auth0/auth0-react';
import { AppContext } from './../../App';

export default function PickerCouponsLists({ setter, setterEmail }) {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const appContext = React.useContext(AppContext);
  const [couponsList, setCouponsList] = React.useState();
  const [selectedCouponList, setSelectedCouponList] = React.useState('');

  const handleChange = (event) => {
    setSelectedCouponList(event.target.value);
    setter(event.target.value);
    const list = couponsList.find((item) => item.key === event.target.value);
    console.log('selEmail', list.email);
    setterEmail(list.email);
  };

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

          if (userResponse.approver === true) {
            console.log('approver');
            getDataApprover();
          } else {
            console.log('getdata');
            getData();
          }
        }
      } catch (err) {
        console.log('ERROR!', err);
      }
    }
    getUserInfo();
  }, []);

  async function getData() {
    try {
      const request = await fetch(`${process.env.REACT_APP_WORKER_URL}/list`, {
        method: 'POST',
        body: JSON.stringify({
          content: { token: appContext.token, email: user.email },
        }),
        headers: { 'content-type': 'application/json' },
      });
      const response = await request.json();

      const filterResponse = response.filter(
        (response) => response.approved === true,
      );
      const CouponList = filterResponse.map((cl) => {
        return {
          name: cl.name,
          key: cl.key,
          email: user.email,
        };
      });

      if (response) {
        setCouponsList(CouponList);
      }
    } catch (err) {
      console.log('ERROR!', err);
    }
  }

  async function getDataApprover() {
    try {
      const request = await fetch(
        `${process.env.REACT_APP_WORKER_URL}/listApprovals`,
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
        const userResponse = response.find((item) => item.email === user.email);
        const filterCompanyUsers = response.filter(
          (item) => item.companyName === userResponse.companyName,
        );
        let finalArr = [];

        const x = filterCompanyUsers.map((cl) => {
          return {
            name: cl.email,
            key: cl.email,
            coupons: { ...cl.coupons },
          };
        });
        for (let i = 0; i < x.length; i++) {
          let c = x[i]['coupons'];

          for (const [key, value] of Object.entries(c)) {
            finalArr.push({
              name: value.name,
              key: value.key,
              approved: value.approved,
              email: x[i].name,
            });
          }
        }
        console.log(finalArr);
        setCouponsList(
          finalArr.filter((finalArr) => finalArr.approved === true),
        );
      }
    } catch (err) {
      console.log('ERROR!', err);
    }
  }

  return (
    <Box sx={{ minWidth: 120, mb: '1rem' }}>
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
  );
}
