import { createClient } from '@supabase/supabase-js';
import { getPublicSupabaseEnv } from '@/lib/env/public';
import { getSupabaseServiceRoleKey } from '@/server/env';

export function createSupabaseAdminClient() {
  const { supabaseUrl } = getPublicSupabaseEnv();
  const serviceRoleKey = getSupabaseServiceRoleKey();

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
