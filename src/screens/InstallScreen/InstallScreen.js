import { Typography, Paper, Box, CardActionArea } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { AppContext } from '../../App';
import { useCheckUserValidity } from '../../utils/useCheckUserValidity';

function copyToClipboard(e) {
  let copyText = document.getElementById('mktoPayload');
  navigator.clipboard.writeText(copyText.textContent);
  alert('Copied the text: ' + copyText.textContent);
}

export default function InstallScreen() {
  const appContext = React.useContext(AppContext);
  const { user } = useAuth0();
  const [CheckUserValidity] = useCheckUserValidity();

  React.useEffect(() => {
    async function CheckUser() {
      await CheckUserValidity(user.email, appContext.token);
    }
    CheckUser();
  }, []);

  return (
    <>
      <Typography variant="h4" sx={{ mt: 2, mb: 2, textAlign: 'left' }}>
        Install in Marketo
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
            width: '70%',
            padding: '2rem',
          }}
          elevation={4}
        >
          <Typography variant="title">
            In order to use your coupons in Marketo, you will need to create a
            Webhook in Marketo
          </Typography>
          <Typography variant="body" sx={{ textAlign: 'left' }}>
            <ol>
              <li>
                Go to <b>Admin</b> then <b>Field Management</b> and create a new
                custom field named <b>mkto_coupon</b>
              </li>
              <li>
                Go to <b>Admin</b> then <b>Webhooks</b>
              </li>
              <li>
                Complete the new webhook with the following information
                <ul style={{ listStyleType: 'none' }}>
                  <li>
                    <b>Webhook name:</b> a recognizible name for your coupons
                    Webhook{' '}
                  </li>
                  <li>
                    <b>URL:</b>
                    {process.env.REACT_APP_WORKER_URL}
                    /getCoupon?mkto=true
                  </li>
                  <li>
                    <b>Request Type:</b> POST
                  </li>
                  <li>
                    <b>Template:</b>{' '}
                    <Card
                      sx={{ maxWidth: 345, mt: 1, mb: 1 }}
                      onClick={copyToClipboard}
                    >
                      <CardActionArea>
                        <CardContent>
                          <code
                            style={{
                              width: '100px',
                              overflowWrap: 'break-word',
                            }}
                            id="mktoPayload"
                          >{`{"content":{"email":{{lead.Email Address:default=none}},"couponsList":"YOUR_COUPONS_LIST_KEY", "emailAccount":"YOUR_HRN_MKTO_COUPONS_EMAIL_ADDRESS"}}`}</code>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </li>
                  <li>
                    <b>Request Token Encoding:</b> JSON
                  </li>
                  <li>
                    <b>Response Type:</b> JSON
                  </li>
                </ul>
              </li>
              <li>
                <b>Response Mapping</b>
                <ul>
                  <li>
                    <b>Response Attribute:</b> coupon
                  </li>
                  <li>
                    <b>Marketo Field:</b> API_NAME_CUSTOM_MKTOCOUPON_FIELD
                    (mktocoupon if you are following this guide)
                  </li>
                </ul>
              </li>
            </ol>
          </Typography>
        </Paper>
      </Box>
    </>
  );
}
