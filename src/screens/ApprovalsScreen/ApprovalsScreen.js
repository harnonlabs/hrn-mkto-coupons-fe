import * as React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { Typography, Box, Chip } from '@mui/material';
import { AppContext } from '../../App';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { ResetTvOutlined } from '@mui/icons-material';
import Snackbar from '@mui/material/Snackbar';
import EditIcon from '@mui/icons-material/Edit';
import VerifiedIcon from '@mui/icons-material/Verified';
import { useCheckUserValidity } from '../utils/useCheckUserValidity';

export default function ApprovalsSCreen() {
  const { user, isLoading } = useAuth0();
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [copiedKey, setCopiedKey] = React.useState('');
  const appContext = React.useContext(AppContext);
  const [data, setData] = React.useState([]);
  const [dataFlag, setDataFlag] = React.useState(false);
  const [unauthorized, setUnauthorized] = React.useState(false);
  const [role, setRole] = React.useState(0);
  const [approver, setApprover] = React.useState(false);
  const columns = [
    { field: 'name', headerName: 'Coupon Name', width: 350 },
    { field: 'coupons', headerName: 'Number of coupons', width: 200 },
    { field: 'approved', headerName: 'Is Approved?', width: 120 },
    {
      field: 'actions',
      headerName: 'Approve',
      type: 'actions',
      width: 100,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<VerifiedIcon />}
          label="SetApprover"
          onClick={() => {
            selectApprover(params.row['id'], params.row['email']);
          }}
        />,
      ],
    },
  ];
  const [CheckUserValidity] = useCheckUserValidity();

  React.useEffect(() => {
    async function CheckUser() {
      await CheckUserValidity(user.email, appContext.token);
    }
    CheckUser();
  }, []);

  React.useEffect(() => {
    getUserInfo();
  }, []);

  React.useEffect(() => {
    if (approver === true || role === 3) {
      getData();
    } else {
      setUnauthorized(true);
    }
  }, [role, approver]);

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
        const userResponse = response.find((item) => item.email === user.email);
        setRole(userResponse.role);
        console.log(userResponse.role, 'urr');
        setApprover(userResponse.approver);
      }
    } catch (err) {
      console.log('ERROR!', err);
    }
  }

  React.useEffect(() => {
    if (data.length > 0) {
      setDataFlag(true);
    }
  }, [data]);
  const copyToClipboard = (e) => {
    let copyText = e.target;

    navigator.clipboard.writeText(copyText.textContent);
    setCopiedKey(copyText.textContent);
    setOpenSnackbar(true);
  };

  const onCloseSnackbar = () => {
    setOpenSnackbar(false);
  };
  async function getData() {
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
        let filterCompanyUsers = response.filter(
          (item) => item.companyName === userResponse.companyName,
        );
        console.log(role, 'r');
        if (role === 3) {
          filterCompanyUsers = response;
        }
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
          let result = [];
          for (const [key, value] of Object.entries(c)) {
            result.push({
              id: value.key,
              name: value.name,
              approved: value.approved ? 'Yes' : 'No',
              email: email,
              coupons: Object.keys(value.coupons).length,
            });
          }
          let final = {
            name: x[i]['name'],
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
  const selectApprover = async (key, email) => {
    try {
      const request = await fetch(
        `${process.env.REACT_APP_WORKER_URL}/approveKey`,
        {
          method: 'POST',
          body: JSON.stringify({
            content: { token: appContext.token, email: email, encodedKey: key },
          }),
          headers: { 'content-type': 'application/json' },
        },
      );
      const response = await request.json();
      if (response) {
        getData();
      }
    } catch (err) {
      console.log('ERROR!', err);
    }
  };
  console.log('REACT_APP_WORKER_URL', process.env.REACT_APP_WORKER_URL, 'no');

  return (
    <div style={{ height: 400, width: '100%' }}>
      <Typography variant="h4" sx={{ mt: '1rem', textAlign: 'left' }}>
        Coupons Lists Approvals
      </Typography>
      {dataFlag &&
        data.map((cl, idx) => {
          return (
            <Box key={`dg-${idx}`}>
              <Typography variant="h6" sx={{ mt: '1rem', textAlign: 'left' }}>
                {cl.name}
              </Typography>

              <DataGrid
                rows={cl.coupons}
                columns={columns}
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
          );
        })}
      {unauthorized && (
        <Box>
          <Typography variant="h4" sx={{ mt: '1rem', textAlign: 'left' }}>
            {'Only authorize users can approve coupons list'}
          </Typography>
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
