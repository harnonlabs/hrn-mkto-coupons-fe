import React from 'react';
import { AppContext } from './../../App';

export default function CouponsTable() {
  const [couponsData, setCouponsData] = React.useState();
  const context = React.useContext(AppContext);
  React.useEffect(() => {
    async function getCouponsData() {
      const request = await fetch(
        `${process.env.REACT_APP_WORKER_URL}/getCoupons`,
      );
      const response = await request.json();
    }
  }, [couponsData]);
  return <>Coupons Table</>;
}
