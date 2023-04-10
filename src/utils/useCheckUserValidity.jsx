// useCheckUserValidity.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser } from './queries';

export function useCheckUserValidity() {
  const [isValid, setIsValid] = useState(true);
  const navigate = useNavigate();

  async function checkEmailValidity(email, token) {
    try {
      const userSB = await getUser(email);

      if (!userSB.company_id && userSB.role !== 1) {
        navigate('/account');
      }
      // const request = await fetch(
      //   `${process.env.REACT_APP_WORKER_URL}/listUsers`,
      //   {
      //     method: 'POST',
      //     body: JSON.stringify({
      //       content: { token: token, email: email },
      //     }),
      //     headers: { 'content-type': 'application/json' },
      //   },
      // );
      // const response = await request.json();

      // if (response) {
      //   const userResponse = response.find((item) => item.email === email);

      //   if (!userResponse || userResponse.companyName === '') {
      //     //  getData();
      //     setIsValid(false);
      //     navigate('/account');
      //   } else {
      //     setIsValid(true);
      //   }
      // }
    } catch (err) {
      console.log('ERROR!', err);
    }
  }

  return [checkEmailValidity];
}
