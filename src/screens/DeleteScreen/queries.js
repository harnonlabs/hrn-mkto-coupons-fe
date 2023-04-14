import { supabase } from '../../utils/supabaseClient';

export async function deleteCouponList(email, key) {
  const coupons_list = await supabase
    .from('coupons_list')
    .update({ is_deleted: true })
    .eq('key', key)
    .select('id,key,is_approved,name,is_deleted');

  if (coupons_list.error) {
    return [];
  }
  return coupons_list.data[0];
}
