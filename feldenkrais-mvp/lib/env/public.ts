function requirePublicEnv(name: 'NEXT_PUBLIC_SUPABASE_URL' | 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY' | 'NEXT_PUBLIC_SUPABASE_ANON_KEY'): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required public environment variable: ${name}`);
  }

  return value;
}

function getSupabaseBrowserKey(): string | null {
  return process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ?? null;
}

function requireSupabaseBrowserKey(): string {
  const value = getSupabaseBrowserKey();

  if (!value) {
    throw new Error(
      'Missing required public environment variable: NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY',
    );
  }

  return value;
}

export function hasPublicSupabaseEnv(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    getSupabaseBrowserKey(),
  );
}

export function getPublicSupabaseEnv() {
  return {
    supabaseUrl: requirePublicEnv('NEXT_PUBLIC_SUPABASE_URL'),
    supabaseBrowserKey: requireSupabaseBrowserKey(),
  };
}
