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

export default function ApprovalsSCreen() {
  const { user, isLoading } = useAuth0();
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [copiedKey, setCopiedKey] = React.useState('');
  const appContext = React.useContext(AppContext);
  const [data, setData] = React.useState([]);
  const [dataFlag, setDataFlag] = React.useState(false);
  const [unauthorized, setUnauthorized] = React.useState(false);
  const columns = [
    { field: 'name', headerName: 'Coupon Name', width: 350 },
    { field: 'approved', headerName: 'Approved', width: 80 },
    {
      field: 'actions',
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
            getData();
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
        let finalArr = [];
        let email = '';
        const x = response.map((cl) => {
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
              approved: value.approved,
              email: email,
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
      {dataFlag &&
        data.map((cl, idx) => {
          return (
            <Box key={`dg-${idx}`}>
              <Typography variant="h4" sx={{ mt: '1rem', textAlign: 'left' }}>
                {cl.name}
              </Typography>
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
