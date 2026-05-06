import { config as loadEnv } from 'dotenv';
import dns from 'node:dns/promises';

loadEnv({ path: '.env.local' });
loadEnv();

type CheckResult = {
  label: string;
  ok: boolean;
  detail: string;
};

function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

function getSupabasePublicKeyInfo(): { name: string; prefix: string; value: string } {
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (publishableKey) {
    return {
      name: 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
      prefix: publishableKey.slice(0, 20),
      value: publishableKey,
    };
  }

  if (anonKey) {
    return {
      name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      prefix: anonKey.slice(0, 20),
      value: anonKey,
    };
  }

  throw new Error(
    'Missing environment variable: NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY',
  );
}

async function resolveHost(label: string, host: string): Promise<CheckResult> {
  try {
    const result = await dns.lookup(host);

    return {
      label,
      ok: true,
      detail: `${host} -> ${result.address}`,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unknown error';

    return {
      label,
      ok: false,
      detail: `${host} -> ${message}`,
    };
  }
}

async function checkSupabaseHealth(origin: string, publicKey: string): Promise<CheckResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(`${origin}/auth/v1/health`, {
      headers: {
        apikey: publicKey,
        authorization: `Bearer ${publicKey}`,
      },
      signal: controller.signal,
    });

    return {
      label: 'auth_health',
      ok: response.ok,
      detail: `${origin}/auth/v1/health -> HTTP ${response.status}`,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unknown error';

    return {
      label: 'auth_health',
      ok: false,
      detail: `${origin}/auth/v1/health -> ${message}`,
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function main() {
  const publicUrl = new URL(getRequiredEnv('NEXT_PUBLIC_SUPABASE_URL'));
  const databaseUrl = new URL(getRequiredEnv('DATABASE_URL'));
  const directUrl = new URL(getRequiredEnv('DIRECT_URL'));
  const publicKeyInfo = getSupabasePublicKeyInfo();
  const checks = await Promise.all([
    resolveHost('supabase_dns', publicUrl.hostname),
    resolveHost('database_dns', databaseUrl.hostname),
    resolveHost('direct_dns', directUrl.hostname),
    checkSupabaseHealth(publicUrl.origin, publicKeyInfo.value),
  ]);

  console.log(`supabase_url_host=${publicUrl.hostname}`);
  console.log(`public_key_source=${publicKeyInfo.name}`);
  console.log(`public_key_prefix=${publicKeyInfo.prefix}...`);
  console.log(`database_host=${databaseUrl.hostname}:${databaseUrl.port || 'default'}`);
  console.log(`direct_host=${directUrl.hostname}:${directUrl.port || 'default'}`);

  for (const check of checks) {
    console.log(`${check.ok ? 'OK' : 'FAIL'} ${check.label}: ${check.detail}`);
  }

  if (checks.some((check) => !check.ok)) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
