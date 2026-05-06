'use client';

import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import { getPublicSupabaseEnv } from '@/lib/env/public';

let browserClient: SupabaseClient | undefined;

export function createSupabaseBrowserClient(): SupabaseClient {
  if (!browserClient) {
    const { supabaseUrl, supabaseBrowserKey } = getPublicSupabaseEnv();
    browserClient = createBrowserClient(supabaseUrl, supabaseBrowserKey);
  }

  return browserClient;
}
