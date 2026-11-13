
import { supabase } from './supabase.js';

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password
  });

  if (error) throw error;

  try {
    const profile = await getMyProfile();

    if (profile.status !== 'ACTIVE') {
      await supabase.auth.signOut();
      throw new Error('ACCOUNT_NOT_ACTIVE');
    }

    return {
      user: data.user,
      profile
    };
  } catch (error) {
    await supabase.auth.signOut();
    throw error;
  }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data.user;
}

export async function getMyProfile() {
  const user = await getCurrentUser();

  if (!user) throw new Error('NOT_AUTHENTICATED');

  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, role, status, class_id')
    .eq('id', user.id)
    .single();

  if (error) throw error;

  const allowedRoles = [
    'OWNER',
    'ADMIN',
    'TEACHER',
    'STUDENT'
  ];

  if (!allowedRoles.includes(data.role)) {
    throw new Error('INVALID_ROLE');
  }

  return data;
}

export function onAuthChange(callback) {
  return supabase.auth.onAuthStateChange(callback);
}
