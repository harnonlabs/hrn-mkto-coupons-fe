import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

export async function getUser(email) {
  let user = await supabase
    .from('users')
    .select('email,company_id,role')
    .eq('email', email);

  return user.data[0];
}

export async function getUsers(email) {
  let user = await supabase
    .from('users')
    .select('email,company_id,role')
    .order('id', { ascending: true });

  if (user.data.length <= 0) {
  }
  return user.data;
}

export async function getCompanies() {
  const companies = await supabase.from('company').select('id,name');

  return companies.data;
}

export async function setUsersApprover(email) {
  let user = await supabase
    .from('users')
    .select('email,company_id,role')
    .eq('email', email);

  if (user.data.length > 0) {
    let role = user.data[0].role;
    if (role === 2) {
      role = 3;
    } else if (role === 3) {
      role = 2;
    }
    let userUpdate = await supabase
      .from('users')
      .update({ role: role })
      .eq('email', email);

    return userUpdate.error ? userUpdate.error : 'ok';
  }
  return 'ok';
}

export async function getUserCoupons(email) {
  const user = await supabase
    .from('users')
    .select('id,email')
    .eq('email', email);

  const userData = user.data[0];

  if (userData.error) {
    return [];
  }
  let couponsListArray = [];

  const coupons_list = await supabase
    .from('coupons_list')
    .select('id,key,is_approved,name')
    .eq('user_id', userData.id)
    .neq('is_deleted', true)
    .order('id', { ascending: true });

  if (coupons_list.error) {
    return [];
  }
  for (let i = 0; i < coupons_list.data.length; i++) {
    const coupons = await supabase
      .from('coupons')
      .select('id,value,is_used,date_used,used_by')
      .eq('coupons_list_id', coupons_list.data[i].id)
      .order('id', { ascending: true });

    if (coupons.error) {
      return [];
    }
    let couponsArray = [];

    coupons.data.map((coupon) => {
      return couponsArray.push({
        coupon: coupon.value,
        isUsed: coupon.is_used,
        dateUsed: coupon.date_used,
        email: coupon.used_by,
      });
    });

    couponsListArray.push({
      name: coupons_list.data[i].name,
      key: coupons_list.data[i].key,
      approved: coupons_list.data[i].is_approved,
      coupons: couponsArray,
    });
  }

  return couponsListArray;
}

export async function getAdminCoupons(email) {
  const user = await supabase
    .from('users')
    .select('id,email,company_id')
    .eq('email', email);

  const userData = user.data[0];

  if (userData.error) {
    return [];
  }

  const companyUser = await supabase
    .from('users')
    .select('id,email,company_id');
  //.eq('company_id', userData.company_id);

  const companyUserData = companyUser.data;

  if (companyUserData.error) {
    return [];
  }
  let companyCouponsArray = [];

  for (let i = 0; i < companyUserData.length; i++) {
    const UserCoupons = await getUserCoupons(companyUserData[i].email);

    companyCouponsArray.push({
      name: companyUserData[i].email,
      email: companyUserData[i].email,
      key: companyUserData[i].email,
      company_id: companyUserData[i].company_id,
      coupons: UserCoupons,
    });
  }

  return companyCouponsArray;
}
