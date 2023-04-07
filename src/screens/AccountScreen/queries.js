import { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabaseClient';

export async function getUser(email) {
  let role = 3;

  if (email === 'internal@harnon.co') {
    role = 1;
  }

  let user = await supabase
    .from('users')
    .select('email,company_id,role')
    .eq('email', email);

  if (user.data.length <= 0) {
    const insertData = await supabase
      .from('users')
      .insert([{ email: email, role: role }]);

    if (insertData.error) {
      console.log(insertData.error);
    }
    user = await supabase.from('users').select('*').eq('email', email);
  }
  return user.data[0];
}
