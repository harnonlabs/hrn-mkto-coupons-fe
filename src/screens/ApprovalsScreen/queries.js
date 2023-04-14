import { supabase } from '../../utils/supabaseClient';

export async function approveCouponList(email, key) {
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
    .update({ is_approved: true })
    .eq('user_id', userData.id)
    .eq('key', key)
    .select('id,key,is_approved,name');

  if (coupons_list.error) {
    return [];
  }
  return coupons_list.data[0];
}
