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

export default function UsersSCreen() {
  const { user, isLoading } = useAuth0();
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [copiedKey, setCopiedKey] = React.useState('');
  const appContext = React.useContext(AppContext);
  const [data, setData] = React.useState([]);
  const [dataFlag, setDataFlag] = React.useState(false);
  const columns = [
    { field: 'email', headerName: 'Email', width: 350 },
    { field: 'approver', headerName: 'Approver', width: 80 },
    {
      field: 'actions',
      type: 'actions',
      width: 100,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<VerifiedIcon />}
          label="SetApprover"
          onClick={() => {
            selectApprover(params.row['id']);
          }}
        />,
      ],
    },
  ];

  React.useEffect(() => {
    getData();
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
        let finalArr = [];
        finalArr = response.map((cl) => {
          return {
            id: cl.email,
            email: cl.email,
            approver: cl.approver,
          };
        });

        setData(finalArr);
      }
    } catch (err) {
      console.log('ERROR!', err);
    }
  }
  const selectApprover = async (email) => {
    try {
      const request = await fetch(
        `${process.env.REACT_APP_WORKER_URL}/pickUsersApprover`,
        {
          method: 'POST',
          body: JSON.stringify({
            content: { token: appContext.token, email: email },
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
      {/* {dataFlag && <p>({data[0].email})</p>} */}
      {dataFlag && (
        <Box key={`dg-user`}>
          <Typography variant="h4" sx={{ mt: '1rem', textAlign: 'left' }}>
            {'Users'}
          </Typography>
          <Box sx={{ display: 'flex', mt: 2, mb: 2 }}>
            <Chip
              icon={<ContentCopyIcon />}
              label={'cl.email'}
              variant="outlined"
              color="success"
              onClick={copyToClipboard}
              size="small"
              sx={{ padding: 1, borderStyle: 'dashed' }}
            />
          </Box>
          {/* <Typography variant="h6" sx={{ textAlign: "left" }}>
                {cl.key}
              </Typography> */}
          <DataGrid
            rows={data}
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
