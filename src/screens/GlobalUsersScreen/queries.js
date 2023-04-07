import { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabaseClient';

export async function createCompany(companyName) {
  let company = await supabase
    .from('company')
    .select('name')
    .eq('name', companyName);

  if (company.data.length <= 0) {
    const insertData = await supabase
      .from('company')
      .insert([{ name: companyName }]);

    if (insertData.error) {
      console.log(insertData.error);
    }

    company = await supabase
      .from('company')
      .select('name')
      .eq('name', companyName);
  }

  return company;
}

export async function setUserCompany(email, companyName) {
  const company = await supabase
    .from('company')
    .select('id,name')
    .eq('name', companyName);
  const userUpdate = await supabase
    .from('users')
    .update({ company_id: company.data[0].id })
    .eq('email', email);

  return userUpdate.error ? userUpdate.error : 'ok';
}
