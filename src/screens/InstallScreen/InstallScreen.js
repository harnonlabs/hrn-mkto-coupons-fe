import { Typography, Paper, Box } from "@mui/material"
import React from "react"

export default function InstallScreen() {
  return (
    <>
      <Typography variant="h4" sx={{ mt: 2, mb: 2 }}>
        Install in Marketo
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper
          sx={{
            width: "35%",
            padding: "2rem",
          }}
          elevation={4}
        >
          <Typography variant="title">
            In order to use your coupons in Marketo, you will need to create a
            Webhook in Marketo
          </Typography>
          <Typography variant="body">
            <ol>
              <li>
                Go to <b>Admin</b> then <b>Webhooks</b>
              </li>
              <li>
                Complete the new webhook with the following information
                <ul style={{ listStyleType: "none" }}>
                  <li>
                    <b>Webhook name:</b> a recognizible name for your coupons
                    Webhook{" "}
                  </li>
                  <li>
                    <b>URL:</b>{" "}
                    https://worker.harnonlabs.workers.dev/getCoupon?mkto=true
                  </li>
                  <li>
                    <b>Request Type:</b> POST
                  </li>
                  <li>
                    <b>Template:</b>{" "}
                    <Paper sx={{ padding: 1 }}>
                      <code
                        style={{ width: "100px", overflowWrap: "break-word" }}
                      >{`{"content":{"email":{{lead.Email Address:default=none}},"couponsList":"{YOUR_COUPON_LIST_KEY"}}`}</code>
                    </Paper>
                  </li>
                  <li>
                    <b>Request Token Encoding:</b> JSON
                  </li>
                  <li>
                    <b>Response Type:</b> JSON
                  </li>
                </ul>
              </li>
            </ol>
          </Typography>
        </Paper>
      </Box>
    </>
  )
}
