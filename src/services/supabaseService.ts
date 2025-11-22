// Supabase backend service stub
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function saveSession(userId: string, session: any) {
  return supabase.from('sessions').insert([{ user_id: userId, ...session }]);
}

export async function getHistory(userId: string) {
  return supabase.from('sessions').select('*').eq('user_id', userId);
}

export async function deleteAccount(userId: string) {
  return supabase.from('users').delete().eq('id', userId);
}
