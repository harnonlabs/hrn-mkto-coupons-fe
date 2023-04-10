import { supabase } from '../../utils/supabaseClient';

export async function getNextCoupon(email, couponList) {
  let result = { value: 'no coupons left' };

  const user = await supabase
    .from('users')
    .select('id,email')
    .eq('email', email);

  const userData = user.data[0];

  if (userData.error) {
    return [];
  }
  const coupons_list = await supabase
    .from('coupons_list')
    .select('id,key,is_approved,name')
    .eq('user_id', userData.id)
    .eq('key', couponList);

  if (coupons_list.error) {
    return result;
  }
  if (coupons_list.data[0]) {
    const coupon = await supabase
      .from('coupons')
      .select('id,value,is_used,date_used,used_by')
      .eq('coupons_list_id', coupons_list.data[0].id)
      .eq('is_used', false)
      .order('id', { ascending: true })
      .limit(1);

    if (coupon.data.length <= 0) {
      return result;
    } else {
      return coupon.data[0];
    }
  }

  return result;
}

export async function spendNextCoupon(email, couponList, testerEmail) {
  const nextCoupon = await getNextCoupon(email, couponList);
  console.log('nextCoupon', nextCoupon);
  let UseByEmail = email;
  if (email !== testerEmail) {
    UseByEmail = testerEmail;
  }
  if (nextCoupon !== undefined) {
    let CouponUpdate = await supabase
      .from('coupons')
      .update({ is_used: true, used_by: UseByEmail, date_used: 'now()' })
      .eq('id', nextCoupon.id)
      .select();

    console.log('CouponUpdate', CouponUpdate);
    return CouponUpdate.error ? CouponUpdate.error : CouponUpdate.data[0];
  } else {
    return { value: 'no coupons left' };
  }
}
