import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useAuth0 } from '@auth0/auth0-react';
import { AppContext } from './../../App';
import { getAdminCoupons, getUser, getUserCoupons } from '../../utils/queries';

export default function PickerCouponsLists({
  setter,
  setterEmail,
  ApprovedFilter,
}) {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const appContext = React.useContext(AppContext);
  const [couponsList, setCouponsList] = React.useState();
  const [selectedCouponList, setSelectedCouponList] = React.useState('');
  const [role, setRole] = React.useState(0);
  const [approver, setApprover] = React.useState(false);
  const [couponsExist, setCouponsExist] = React.useState(false);
  const handleChange = (event) => {
    setSelectedCouponList(event.target.value);
    setter(event.target.value);
    const list = couponsList.find((item) => item.key === event.target.value);

    setterEmail(list.email);
  };

  React.useEffect(() => {
    getUserInfo();
  }, []);

  React.useEffect(() => {
    if (role !== 0) {
      if (approver === true || role <= 2) {
        getDataApprover();
      } else if (role === 3) {
        getData();
      }
    }
  }, [role]);

  async function getUserInfo() {
    try {
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

      // if (response) {
      //   const userResponse = response.find((item) => item.email === user.email);
      //   setRole(userResponse.role);
      //   setApprover(userResponse.approver);
      // }
      const userResponse = await getUser(user.email);

      if (userResponse) {
        // const userResponse = response.find((item) => item.email === user.email);

        setRole(userResponse.role);
        if (userResponse.role <= 2) {
          setApprover(true);
        }
      }
    } catch (err) {
      console.log('ERROR!', err);
    }
  }

  async function getData() {
    try {
      // const request = await fetch(`${process.env.REACT_APP_WORKER_URL}/list`, {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     content: { token: appContext.token, email: user.email },
      //   }),
      //   headers: { 'content-type': 'application/json' },
      // });
      // const response = await request.json();
      const response = await getUserCoupons(user.email);
      let filterResponse = [];
      if (ApprovedFilter) {
        filterResponse = response.filter(
          (response) => response.approved === true,
        );
      } else {
        filterResponse = response;
      }

      const CouponList = filterResponse.map((cl) => {
        return {
          name: cl.name,
          key: cl.key,
          email: user.email,
        };
      });

      if (response) {
        setCouponsExist(true);
        setCouponsList(CouponList);
      }
    } catch (err) {
      console.log('ERROR!', err);
    }
  }

  async function getDataApprover() {
    try {
      // const request = await fetch(
      //   `${process.env.REACT_APP_WORKER_URL}/listApprovals`,
      //   {
      //     method: 'POST',
      //     body: JSON.stringify({
      //       content: { token: appContext.token, email: user.email },
      //     }),
      //     headers: { 'content-type': 'application/json' },
      //   },
      // );
      // const response = await request.json();
      const response = await getAdminCoupons(user.email);
      if (response) {
        // const userResponse = response.find((item) => item.email === user.email);
        // let filterCompanyUsers = response.filter(
        //   (item) => item.companyName === userResponse.companyName,
        // );
        // let finalArr = [];
        // if (role === 3) {
        //   filterCompanyUsers = response;
        // }
        const userResponse = response.find((item) => item.name === user.email);

        let filterCompanyUsers = response.filter(
          (item) => item.company_id === userResponse.company_id,
        );

        if (role === 1) {
          filterCompanyUsers = response;
        }
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
        setCouponsExist(true);
        setCouponsList(
          ApprovedFilter
            ? finalArr.filter((finalArr) => finalArr.approved === true)
            : finalArr,
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
          {couponsExist ? (
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
