function requireServerEnv(name: 'DATABASE_URL' | 'DIRECT_URL' | 'SUPABASE_SERVICE_ROLE_KEY'): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required server environment variable: ${name}`);
  }

  return value;
}

export function hasDatabaseEnv(): boolean {
  return Boolean(process.env.DATABASE_URL && process.env.DIRECT_URL);
}

export function getDatabaseEnv() {
  return {
    databaseUrl: requireServerEnv('DATABASE_URL'),
    directUrl: requireServerEnv('DIRECT_URL'),
  };
}

export function hasSupabaseServiceRoleKey(): boolean {
  return Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export function getSupabaseServiceRoleKey(): string {
  return requireServerEnv('SUPABASE_SERVICE_ROLE_KEY');
}
