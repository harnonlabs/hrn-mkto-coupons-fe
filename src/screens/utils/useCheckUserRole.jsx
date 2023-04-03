// useCheckUserRole.js
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export function useCheckUserRole() {
  const navigate = useNavigate();
  const location = useLocation();

  async function checkEmailRole(email, token) {
    try {
      const request = await fetch(
        `${process.env.REACT_APP_WORKER_URL}/listUsers`,
        {
          method: 'POST',
          body: JSON.stringify({
            content: { token: token, email: email },
          }),
          headers: { 'content-type': 'application/json' },
        },
      );
      const response = await request.json();

      if (response) {
        const userResponse = response.find((item) => item.email === email);
        if (userResponse) {
          if (userResponse.role !== 3 && location.pathname === '/globalusers') {
            navigate('/account');
          } else {
          }
        }
      }
    } catch (err) {
      console.log('ERROR!', err);
    }
  }
  return [checkEmailRole];
}
