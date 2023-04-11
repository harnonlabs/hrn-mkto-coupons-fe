import * as React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { DataGrid } from '@mui/x-data-grid';
import { Typography, Box, Chip } from '@mui/material';
import { AppContext } from '../../App';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { ResetTvOutlined } from '@mui/icons-material';
import Snackbar from '@mui/material/Snackbar';
import dayjs from 'dayjs';
import { useCheckUserValidity } from '../../utils/useCheckUserValidity';
import { getUser, getAdminCoupons, getUserCoupons } from '../../utils/queries';

export default function DataTable() {
  const { user, isLoading } = useAuth0();
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [copiedKey, setCopiedKey] = React.useState('');
  const appContext = React.useContext(AppContext);
  const [data, setData] = React.useState([]);
  const [dataApprover, setDataApprover] = React.useState([]);
  const [CheckUserValidity] = useCheckUserValidity();
  const [flagApprover, setFlagApprover] = React.useState(false);
  const [flagUser, setFlagUser] = React.useState(false);
  const [columns, setColumns] = React.useState([]);
  const [role, setRole] = React.useState(0);
  const [approver, setApprover] = React.useState(false);
  React.useEffect(() => {
    async function CheckUser() {
      await CheckUserValidity(user.email, appContext.token);
    }
    CheckUser();
  }, []);
  React.useEffect(() => {
    if (data.length > 0) {
      setColumns([
        { field: 'coupons', headerName: 'Coupon Number', width: 150 },
        { field: 'isUsed', headerName: 'Is Used?', width: 80 },
        { field: 'dateUsed', headerName: 'Date Used', width: 200 },
        { field: 'email', headerName: 'email', width: 250 },
      ]);
      setFlagUser(true);
    }
  }, [data]);
  React.useEffect(() => {
    if (dataApprover.length > 0) {
      setColumns([
        { field: 'coupons', headerName: 'coupons', width: 80 },
        // { field: "approved", headerName: "Approved", width: 80 },
        { field: 'isUsed', headerName: 'Is Used?', width: 80 },
        { field: 'dateUsed', headerName: 'Date Used', width: 200 },
        { field: 'email', headerName: 'email', width: 250 },
      ]);
      setFlagApprover(true);
    }
  }, [dataApprover]);

  React.useEffect(() => {
    getUserInfo();
  }, []);

  React.useEffect(() => {
    if (role !== 0) {
      if (approver === true || role <= 2) {
        getDataApprover();
      } else {
        getDataUser();
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
        const userResponse = response.find((item) => item.name === user.email);
        console.log(role, response);
        let filterCompanyUsers = response.filter(
          (item) => item.company_id === userResponse.company_id,
        );
        if (role === 1) {
          filterCompanyUsers = response;
        }
        console.log(role, filterCompanyUsers, response);

        //console.log(role, response);
        let finalArr = [];
        let email = '';
        const x = filterCompanyUsers.map((cl) => {
          return {
            name: cl.email,
            key: cl.email,
            coupons: { ...cl.coupons },
          };
        });
        for (let i = 0; i < x.length; i++) {
          email = x[i].name;
          let c = x[i]['coupons'];
          let mid = [];
          let result = [];
          let num = 0;
          for (const [key, value] of Object.entries(c)) {
            num = Math.floor(Math.random() * 100000);

            mid = [];
            for (const [keyCoupon, valueCoupon] of Object.entries(
              Object.keys(value.coupons),
            )) {
              if (value.coupons[valueCoupon].dateUsed) {
                const stringDate = new Date(
                  value.coupons[valueCoupon].dateUsed,
                );
                value.coupons[valueCoupon].dateUsed = dayjs(stringDate).format(
                  'YYYY-MM-DD hh:mm:ss',
                );
              }
              //console.log(value.coupons);
              // console.log(valueCoupon);

              mid.push({
                id: value.key + valueCoupon + num,
                coupons: value.coupons[valueCoupon].coupon,
                isUsed: value.coupons[valueCoupon].isUsed,
                dateUsed: value.coupons[valueCoupon].dateUsed
                  ? dayjs(value.coupons[valueCoupon].dateUsed).format(
                      'YYYY-MM-DD hh:mm:ss',
                    )
                  : null,
                email: value.coupons[valueCoupon].email,
              });
            }

            result.push({
              id: value.key + value.name + num,
              name: value.name,
              key: value.approved ? value.key : null,
              approved: value.approved,
              email: email,
              coupons: mid,
            });
          }
          let final = {
            name: x[i]['name'],
            key: x[i]['key'],
            coupons: result,
          };
          finalArr.push(final);
        }

        setDataApprover(finalArr);
      }
    } catch (err) {
      console.log('ERROR!', err);
    }
  }
  async function getDataUser() {
    try {
      // const request = await fetch(`${process.env.REACT_APP_WORKER_URL}/view`, {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     content: { token: appContext.token, email: user.email },
      //   }),
      //   headers: { 'content-type': 'application/json' },
      // });
      // const response = await request.json();
      const response = await getUserCoupons(user.email);

      if (response) {
        let finalArr = [];
        const x = response.map((cl) => {
          return {
            name: cl.name,
            key: cl.key,
            approved: cl.approved,
            coupons: { ...cl.coupons },
          };
        });
        for (let i = 0; i < x.length; i++) {
          let c = x[i]['coupons'];
          let result = [];
          for (const [key, value] of Object.entries(c)) {
            console.log(value.coupons);
            if (value.dateUsed) {
              const stringDate = new Date(value.dateUsed);
              value.dateUsed = dayjs(stringDate).format('YYYY-MM-DD hh:mm:ss');
            }
            result.push({ id: key, coupon: key, ...value });
          }
          let final = {
            name: x[i]['name'],
            approved: x[i]['approved'],
            key: x[i]['key'],
            coupons: result,
          };
          finalArr.push(final);
        }

        setData(finalArr);
      }
    } catch (err) {
      console.log('ERROR!', err);
    }
  }

  const copyToClipboard = (e) => {
    let copyText = e.target;

    navigator.clipboard.writeText(copyText.textContent);
    setCopiedKey(copyText.textContent);
    setOpenSnackbar(true);
  };

  const onCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  console.log('REACT_APP_WORKER_URL', process.env.REACT_APP_WORKER_URL, 'no');

  return (
    <div style={{ height: 400, width: '100%' }}>
      <Typography variant="h4" sx={{ mt: 2, mb: 2, textAlign: 'left' }}>
        My Coupons
      </Typography>
      {flagUser &&
        data.map((cl, idx) => {
          return (
            <Box key={`dg-${idx}-${cl.name}`}>
              <Typography variant="h6" sx={{ mt: '1rem', textAlign: 'left' }}>
                {cl.name}
              </Typography>
              {cl.approved ? (
                <Box sx={{ display: 'flex', mt: 2, mb: 2 }}>
                  <Chip
                    icon={<ContentCopyIcon />}
                    label={cl.key}
                    variant="outlined"
                    color="success"
                    onClick={copyToClipboard}
                    size="small"
                    sx={{ padding: 1, borderStyle: 'dashed' }}
                  />
                </Box>
              ) : (
                <Box sx={{ display: 'flex', mt: 2, mb: 2 }}>
                  <Chip
                    label="Pending for approval"
                    variant="outlined"
                    color="warning"
                    size="small"
                    sx={{ padding: 1, borderStyle: 'dashed' }}
                  />
                </Box>
              )}
              {/* <Typography variant="h6" sx={{ textAlign: "left" }}>
                {cl.key}
              </Typography> */}
              <DataGrid
                rows={cl.coupons}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                autoHeight
                // checkboxSelection
              />
            </Box>
          );
        })}
      {flagApprover &&
        dataApprover.map((cl, idx) => {
          return (
            <Box key={`dg-${idx}`}>
              <Typography variant="h5" sx={{ mt: '1rem', textAlign: 'left' }}>
                {cl.name}
              </Typography>
              {cl.coupons.length <= 0 ? (
                <Typography
                  variant="title"
                  sx={{ mt: '1rem', textAlign: 'left' }}
                >
                  No coupons created
                </Typography>
              ) : (
                <></>
              )}
              {cl.coupons.map((item) => (
                <div key={`dx${item.name}`}>
                  <Typography
                    variant="h6"
                    sx={{ mt: '1rem', textAlign: 'left', color: '#666666' }}
                  >
                    {item.name}
                  </Typography>
                  {item.approved ? (
                    <Box sx={{ display: 'flex', mt: 2, mb: 2 }}>
                      <Chip
                        icon={<ContentCopyIcon />}
                        label={item.key}
                        variant="outlined"
                        color="success"
                        onClick={copyToClipboard}
                        size="small"
                        sx={{ padding: 1, borderStyle: 'dashed' }}
                      />
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', mt: 2, mb: 2 }}>
                      <Chip
                        label="Pending for approval"
                        variant="outlined"
                        color="warning"
                        size="small"
                        sx={{ padding: 1, borderStyle: 'dashed' }}
                      />
                    </Box>
                  )}

                  <DataGrid
                    rows={item.coupons}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    autoHeight
                    initialState={{
                      pinnedColumns: {
                        right: ['actions'],
                      },
                    }}
                  />
                </div>
              ))}
            </Box>
          );
        })}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={1000}
        onClose={onCloseSnackbar}
        message={`Key copied to clipboard!`}
      />
    </div>
  );
}
