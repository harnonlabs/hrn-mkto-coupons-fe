import { supabase } from '../../utils/supabaseClient';

export async function createCouponList(email, name, coupons) {
  let csprng = await fetch('https://csprng.xyz/v1/api');
  let { Data: encodedKey } = await csprng.json();
  let keyExist = true;

  while (keyExist) {
    let checkkey = await supabase
      .from('coupons_list')
      .select('id,key')
      .eq('key', encodedKey);
    if (checkkey.data[0]) {
      csprng = await fetch('https://csprng.xyz/v1/api');
      encodedKey = await csprng.json();
    } else {
      keyExist = false;
    }
  }

  let user = await supabase
    .from('users')
    .select('id,email,company_id,role')
    .eq('email', email);
  let userData = user.data[0];

  const couponsListInsert = await supabase
    .from('coupons_list')
    .upsert([
      {
        company_id: userData.company_id,
        user_id: userData.id,
        name: name,
        key: encodedKey,
      },
    ])
    .select();
  let couponsListData = couponsListInsert.data[0];

  const newArray = coupons.map((coupon) => {
    return {
      coupons_list_id: couponsListData.id,
      value: coupon,
      is_used: false,
    };
  });

  console.log('newArray', newArray);
  const couponsInsert = await supabase.from('coupons').upsert(newArray);
  console.log(couponsInsert);

  return encodedKey;
  for (let i = 0; i < coupons.length; i++) {
    const couponsInsert = await supabase.from('coupons').upsert([
      {
        coupons_list_id: couponsListData.id,
        value: coupons[i],
        is_used: false,
      },
    ]);
    if (couponsInsert.error) {
      console.log(couponsInsert.error);
    }
  }

  //console.log(newResult);
  return encodedKey;
}
