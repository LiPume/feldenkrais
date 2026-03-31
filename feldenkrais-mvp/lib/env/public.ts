function requirePublicEnv(name: 'NEXT_PUBLIC_SUPABASE_URL' | 'NEXT_PUBLIC_SUPABASE_ANON_KEY'): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required public environment variable: ${name}`);
  }

  return value;
}

export function hasPublicSupabaseEnv(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export function getPublicSupabaseEnv() {
  return {
    supabaseUrl: requirePublicEnv('NEXT_PUBLIC_SUPABASE_URL'),
    supabaseAnonKey: requirePublicEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
  };
}
