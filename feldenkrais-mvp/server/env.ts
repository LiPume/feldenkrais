function requireServerEnv(name: 'DATABASE_URL' | 'DIRECT_URL' | 'SUPABASE_SERVICE_ROLE_KEY'): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required server environment variable: ${name}`);
  }

  return value;
}

export function hasRuntimeDatabaseEnv(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

export function getRuntimeDatabaseUrl(): string {
  return requireServerEnv('DATABASE_URL');
}

export function hasDirectDatabaseEnv(): boolean {
  return Boolean(process.env.DIRECT_URL);
}

export function getDirectDatabaseUrl(): string {
  return requireServerEnv('DIRECT_URL');
}

export function hasSupabaseServiceRoleKey(): boolean {
  return Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export function getSupabaseServiceRoleKey(): string {
  return requireServerEnv('SUPABASE_SERVICE_ROLE_KEY');
}
