import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { hasPublicSupabaseEnv, getPublicSupabaseEnv } from '@/lib/env/public';

export async function updateSupabaseSession(request: NextRequest) {
  if (!hasPublicSupabaseEnv()) {
    return NextResponse.next({
      request,
    });
  }

  let response = NextResponse.next({
    request,
  });
  const { supabaseUrl, supabaseBrowserKey } = getPublicSupabaseEnv();

  const supabase = createServerClient(supabaseUrl, supabaseBrowserKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: Array<{ name: string; value: string; options?: CookieOptions }>) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });

        response = NextResponse.next({
          request,
        });

        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  await supabase.auth.getClaims();
  response.headers.set('Cache-Control', 'private, no-store');

  return response;
}
