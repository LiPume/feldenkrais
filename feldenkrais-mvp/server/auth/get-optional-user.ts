import type { User } from '@supabase/supabase-js';
import { hasPublicSupabaseEnv } from '@/lib/env/public';
import { hasDatabaseEnv } from '@/server/env';
import { ensureProfileForUser } from '@/server/auth/ensure-profile';
import { createSupabaseServerClient } from '@/server/auth/supabase-server';

export type OptionalAuthContext = {
  user: User;
  profile: Awaited<ReturnType<typeof ensureProfileForUser>> | null;
};

export async function getOptionalAuthContext(): Promise<OptionalAuthContext | null> {
  if (!hasPublicSupabaseEnv()) {
    return null;
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return null;
  }

  const profile = hasDatabaseEnv()
    ? await ensureProfileForUser(data.user)
    : null;

  return {
    user: data.user,
    profile,
  };
}
