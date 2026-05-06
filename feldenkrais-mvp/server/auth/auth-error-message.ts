export function toAuthErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) {
    const cause = error.cause as { code?: string; hostname?: string } | undefined;

    if (
      error.message.includes('Can\'t reach database server')
      || error.message.includes('P1001')
    ) {
      return '当前无法连接 Supabase 数据库，请先确认 `DATABASE_URL` 可用后再试。';
    }

    if (cause?.code === 'ENOTFOUND') {
      return '当前无法解析 Supabase 服务域名，请检查 `NEXT_PUBLIC_SUPABASE_URL` 是否填写正确。';
    }

    if (cause?.code === 'ETIMEDOUT') {
      return '当前连接 Supabase 超时，请检查网络、实例状态和相关环境变量。';
    }

    if (cause?.code === 'ECONNREFUSED') {
      return 'Supabase 服务拒绝了连接，请确认项目实例和相关地址配置是否正确。';
    }

    if (error.message.includes('fetch failed')) {
      return '当前无法连接 Supabase 认证服务，请检查 `NEXT_PUBLIC_SUPABASE_URL` 和网络连通性。';
    }

    return error.message;
  }

  return fallback;
}
