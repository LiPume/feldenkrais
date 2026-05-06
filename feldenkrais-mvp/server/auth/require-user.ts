import { redirect } from 'next/navigation';
import { hasPublicSupabaseEnv } from '@/lib/env/public';
import { hasRuntimeDatabaseEnv } from '@/server/env';
import { ensureProfileForUser } from '@/server/auth/ensure-profile';
import { createSupabaseServerClient } from '@/server/auth/supabase-server';

export async function requireUser() {
  if (!hasPublicSupabaseEnv() || !hasRuntimeDatabaseEnv()) {
    redirect('/login');
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    redirect('/login');
  }

  const profile = await ensureProfileForUser(data.user);

  return {
    supabase,
    user: data.user,
    profile,
  };
}
