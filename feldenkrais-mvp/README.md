# 费登奎斯身体觉察 MVP

最小可用网页版原型，跑通：选择身体部位 → 查找练习 → 查看详情与音频 → 做反馈 → 保存查看记录。

当前仓库已经开始从 `mock 数据 + localStorage` 迁移到：

- Next.js App Router 全栈
- Supabase Auth / Postgres / Storage
- Prisma schema / migration / query access

## 快速启动

```bash
cd feldenkrais-mvp
npm install
npm run dev
```

然后打开 http://localhost:3000

## 环境变量

先复制一份环境变量模板：

```bash
cp .env.example .env.local
```

然后填写：

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
# 旧项目兼容时可改用 NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=
DIRECT_URL=
```

说明：

- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`：前端和服务端共用的 Supabase 项目访问配置；旧项目仍兼容 `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `DATABASE_URL`：Next.js 运行时登录、鉴权和 Prisma 查询使用的连接串
- `DIRECT_URL`：迁移和管理脚本使用的连接串；以 Supabase 控制台实际提供的值为准，不要自行改 host 规则
- `SUPABASE_SERVICE_ROLE_KEY`：学生学号注册、服务端管理任务和后续管理接口使用；老师邮箱登录本身不依赖它

## 数据库相关命令

```bash
npm run prisma:generate
npm run prisma:validate
npm run prisma:migrate:dev
npm run db:seed
npm run auth:check
```

说明：

- Prisma 7 的 CLI 数据源配置放在 `prisma.config.ts`
- Next.js 运行时统一使用 `DATABASE_URL`
- migration / introspection 通过 `DIRECT_URL` 走 `prisma.config.ts`
- `npm run auth:check` 会校验 Supabase Auth URL、数据库域名解析和 `/auth/v1/health`，适合排查“环境变量明明有值，但登录还是失败”的情况

## 上线前检查

```bash
npm run auth:check
npm run prisma:validate
npx prisma migrate status
npm run lint
npx tsc --noEmit
npm run build
```

数据库安全要求：

- public 业务表必须启用 RLS
- `anon` / `authenticated` 不应直接拥有 public 业务表的 select / insert / update / delete 权限
- 浏览器端 Supabase client 只负责 Auth；正式业务数据统一走 Server Action / Prisma
- 当前 RLS 与权限收口由 migration `20260501193000_lock_down_public_table_access` 负责

## 页面路由

| 路由 | 说明 |
|------|------|
| `/` | 未登录时是公共首页；登录后是按角色分开的工作台 |
| `/login` | 学生学号登录 / 注册入口 |
| `/admin/login` | 老师后台邮箱登录入口 |
| `/admin` | 老师后台兼容入口，会校验角色后跳到 `/teacher` |
| `/teacher` | 老师端首页（已接角色入口，统计页待继续） |
| `/practice-search` | 找练习（人体图 + 练习列表） |
| `/practices/[slug]` | 练习详情（文字 + 音频） |
| `/feedback` | 反馈记录列表 |
| `/feedback/new` | 新建反馈表单 |

## 技术栈

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Supabase Auth / Postgres / Storage
- Prisma

## 开发阶段

- [x] 第 1 步：项目骨架 + 5 个页面空壳
- [x] 第 2 步：人体图组件
- [x] 第 3 步：找练习闭环（mock 数据）
- [x] 第 4 步：反馈闭环（mock 保存）
- [ ] 第 5 步：接入 Supabase + Prisma + Auth
- [ ] 第 6 步：打磨可用性

## 文档

详细设计文档见 `../docs/describe.md`
