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
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=
DIRECT_URL=
```

说明：

- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`：前端和服务端共用的 Supabase 项目访问配置
- `DATABASE_URL`：Supabase pooled 连接串，通常是 `pooler.supabase.com` + `6543`
- `DIRECT_URL`：Supabase direct 连接串，应该使用 `db.<project-ref>.supabase.co:5432`，不要继续填 pooler 地址
- `SUPABASE_SERVICE_ROLE_KEY`：学生学号注册、服务端管理任务和后续管理接口使用

## 数据库相关命令

```bash
npm run prisma:generate
npm run prisma:validate
npm run prisma:migrate:dev
npm run db:seed
```

说明：

- Prisma 7 的 CLI 数据源配置放在 `prisma.config.ts`
- 本地开发时 `PrismaClient` 优先使用 `DIRECT_URL`，部署环境继续使用 `DATABASE_URL`
- migration / introspection 通过 `DIRECT_URL` 走 `prisma.config.ts`

## 页面路由

| 路由 | 说明 |
|------|------|
| `/` | 首页，两个入口按钮 |
| `/login` | 学生 / 老师登录入口 |
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
