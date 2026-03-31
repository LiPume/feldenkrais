# 费登奎斯身体觉察 MVP - 开发记录

本文档记录每个开发步骤的变更，与 `feldenkrais_mvp_software_engineering_doc.md`（完整设计文档）配合使用。

---

## 第 1 步：项目骨架

### 完成时间
2026-03-30

### 本次目标
搭建 Next.js 项目骨架，包含 5 个页面路由空壳和基础全局布局。

### 做了什么

**新建/修改的文件**

| 文件 | 用途 |
|------|------|
| `feldenkrais-mvp/app/layout.tsx` | 全局根布局：顶部导航 + 底部 Footer + 主内容区 |
| `feldenkrais-mvp/app/page.tsx` | 首页：产品标题 + 两个入口按钮 |
| `feldenkrais-mvp/app/practice-search/page.tsx` | 找练习页（空壳） |
| `feldenkrais-mvp/app/practices/[slug]/page.tsx` | 练习详情页（空壳） |
| `feldenkrais-mvp/app/feedback/page.tsx` | 反馈记录列表页（空壳） |
| `feldenkrais-mvp/app/feedback/new/page.tsx` | 新建反馈页（空壳） |
| `feldenkrais-mvp/app/globals.css` | 全局样式（仅保留 Tailwind） |
| `feldenkrais-mvp/README.md` | 项目说明文档 |

### 设计决策

1. **字体**：移除 Next.js 默认 Geist 字体，改用系统默认字体（Tailwind 的 sans），避免中文字体问题
2. **颜色**：使用 Stone 色系（`stone-50` ~ `stone-900`），温暖自然，契合身体觉察主题
3. **导航**：固定顶部导航，左侧品牌名，右侧两个链接（找练习 / 我的反馈）
4. **布局**：最大宽度 `max-w-3xl`，居中，所有内容区共享

---

## 第 2 步：人体图组件

### 完成时间
2026-03-30

### 本次目标
用 SVG 实现正面 / 背面可点击人体图，支持 front/back 切换、区域点击高亮，并嵌入找练习页。

### 做了什么

**新建/修改的文件**

| 文件 | 用途 |
|------|------|
| `feldenkrais-mvp/app/lib/body-region-types.ts` | 类型定义：`BodyRegionCode`、`BodyRegion`、`BodyMapProps` |
| `feldenkrais-mvp/app/lib/body-region-constants.ts` | 区域常量：`FRONT_REGIONS`、`BACK_REGIONS`、`getRegionByCode()` |
| `feldenkrais-mvp/app/components/body-map/BodyMapFront.tsx` | 正面 SVG 人体图（15 个区域） |
| `feldenkrais-mvp/app/components/body-map/BodyMapBack.tsx` | 背面 SVG 人体图（15 个区域） |
| `feldenkrais-mvp/app/components/body-map/BodyMap.tsx` | 主组件：front/back 切换 + 选中状态显示 |
| `feldenkrais-mvp/app/practice-search/page.tsx` | 重写：嵌入 BodyMap + 区域选中状态 |

### 区域代码命名（前端 / SVG / 数据库共用）

**正面（front_*）**：`front_head`、`front_neck`、`front_left_shoulder`、`front_right_shoulder`、`front_chest`、`front_abdomen`、`front_pelvis`、`front_left_thigh`、`front_right_thigh`、`front_left_knee`、`front_right_knee`、`front_left_lower_leg`、`front_right_lower_leg`、`front_left_foot`、`front_right_foot`

**背面（back_*）**：`back_head`、`back_neck`、`back_left_shoulder`、`back_right_shoulder`、`back_upper_back`、`back_lower_back`、`back_pelvis`、`back_left_thigh`、`back_right_thigh`、`back_left_knee`、`back_right_knee`、`back_left_lower_leg`、`back_right_lower_leg`、`back_left_foot`、`back_right_foot`

### 设计决策

- **SVG 路径命名**：`g` 元素的 `id` 与 region code 一一对应
- **颜色**：`#d6d3d1`（stone-300）未选中，`#44403c`（stone-700）选中
- **viewBox**：`0 0 300 600`，正背面共享坐标系
- **找练习页单选**：点击区域高亮，点击已选区域取消选中

---

## 第 3 步：找练习闭环（mock 数据）

### 完成时间
2026-03-30

### 本次目标
接入 mock 练习数据，实现"点击部位 → 显示相关练习列表 → 进入详情页"完整闭环，含音频播放器。

### 做了什么

**新建/修改的文件**

| 文件 | 用途 |
|------|------|
| `feldenkrais-mvp/app/lib/mock-practice-data.ts` | mock 练习数据（7 条）+ 查询函数 |
| `feldenkrais-mvp/app/practice-search/page.tsx` | 重写：过滤练习列表 |
| `feldenkrais-mvp/app/practices/[slug]/page.tsx` | 重写：详情页含音频播放器 |
| `feldenkrais-mvp/public/audio/` | 音频文件目录（4 个真实音频） |

### Mock 数据概览

| slug | 标题 | 音频 |
|------|------|------|
| `perceive-body-diagonal` | 感知身体的对角线 | `/audio/感知身体的对角线.mp3` |
| `soft-arm` | 柔软的手臂 | `/audio/柔软的手臂.mp3` |
| `mini-atm-spine-chain` | 迷你 ATM 脊柱链条 | `/audio/迷你ATM脊柱链条.aac` |
| `good-posture` | 好的姿势 | `/audio/ATM—好的姿势.aac` |
| `neck-free-rotation` | 颈部自由旋转 | 无 |
| `hip-rotation-awareness` | 髋部旋转觉察 | 无 |
| `foot-weight-awareness` | 脚部重量感知 | 无 |

### 音频目录

音频文件放在 `public/audio/` 下，Next.js 通过 `/audio/xxx` 自动提供访问。详情页有音频则显示播放器，无音频则不显示播放器区域。

### 关键交互

1. 点击身体部位 → 右侧过滤显示关联练习列表
2. 点击练习卡片 → 进入 `/practices/[slug]`
3. 详情页：`audio` 播放器 + 步骤文字 + 部位标签
4. "做这个练习的反馈" → `/feedback/new?practiceId=xxx&practiceTitle=xxx`

---

## 第 4 步：反馈闭环（mock 保存）

### 完成时间
2026-03-30

### 本次目标
实现完整反馈表单（部位多选、标签、强度、左右差异、备注），保存到 localStorage，可查看记录列表。

### 做了什么

**新建/修改的文件**

| 文件 | 用途 |
|------|------|
| `feldenkrais-mvp/app/lib/feedback-types.ts` | `FeedbackRecord` 和 `FeedbackFormState` 类型 |
| `feldenkrais-mvp/app/lib/feedback-constants.ts` | 感受标签常量（12 个）+ 左右差异选项 |
| `feldenkrais-mvp/app/lib/feedback-storage.ts` | localStorage 读写：`getFeedbackRecords()`、`saveFeedbackRecord()` |
| `feldenkrais-mvp/app/components/feedback/FeelingTagSelector.tsx` | 感受标签多选组件 |
| `feldenkrais-mvp/app/components/feedback/IntensitySelector.tsx` | 强度评分 0-10 选择器 |
| `feldenkrais-mvp/app/components/feedback/LeftRightSelector.tsx` | 左右差异单选组件 |
| `feldenkrais-mvp/app/feedback/new/page.tsx` | 外层服务端组件（处理 URL params） |
| `feldenkrais-mvp/app/feedback/new/FeedbackFormClient.tsx` | 内层客户端组件：完整表单 |
| `feldenkrais-mvp/app/feedback/page.tsx` | 重写：显示已保存反馈列表 |

### 感受标签（12 个）

紧、松、酸、热、麻、清晰、模糊、轻、沉、有连接感、舒展、稳定

### 左右差异选项

无差异、左侧更明显、右侧更明显、不确定

### 表单字段

| 字段 | 类型 | 必填 |
|------|------|------|
| 练习 | 自动带入或空 | 否 |
| 课前/课后 | 单选 | 是 |
| 身体部位 | 多选 | 是（至少 1 个） |
| 感受标签 | 多选 | 否 |
| 强度评分 | 0-10 | 是 |
| 左右差异 | 单选 | 否 |
| 备注 | 文本 | 否 |

### 设计决策

- **保存介质**：localStorage，key = `feldenkrais_feedback_records`，JSON 数组
- **页面结构**：`page.tsx` 为服务端组件（处理 URL params + dynamic 导出），`FeedbackFormClient.tsx` 为客户端组件（处理表单交互）
- **校验**：前端 alert 提示，无部位选择时阻止提交
- **成功页**：保存后显示成功提示 + 两个按钮（查看反馈 / 返回首页）

### 下一步最小任务

**第 5 步：接入 Supabase**


## 第 5 步：接入 Supabase + Prisma + Auth（基于现有项目演进）

### 完成时间
2026-03-30

### 本次目标
不是推倒重来，而是在你已经完成的第 1–4 步基础上，把项目从 `mock 数据 + localStorage` 演进到：

1. 同一个 Next.js App Router 项目，同时承载学生端和老师端
2. Supabase 负责 Auth / Postgres / Storage
3. Prisma 负责 schema、migration、数据库访问
4. 反馈数据改成 `feedback_session + feedback_body_part_entry` 两层结构
5. 保留现有人体图组件和 body region code，不重新定义一套体系

### 本次新增文件

| 文件 | 用途 |
|------|------|
| `feldenkrais-mvp/prisma/schema.prisma` | 第 5、6 步数据库模型初稿 |
| `feldenkrais-mvp/prisma.config.ts` | Prisma 7 CLI datasource 配置 |
| `feldenkrais-mvp/.env.example` | Supabase + Prisma 环境变量占位 |

### 当前已落地的 Phase 5.1 基础设施

本轮已经实际完成的内容包括：

1. 安装依赖：`@prisma/client`、`prisma`、`@prisma/adapter-pg`、`pg`、`@supabase/ssr`、`zod`、`tsx`
2. 新增 `server/db/prisma.ts`，并按 Prisma 7 的 runtime adapter 模式接入 Postgres
3. 新增 `prisma.config.ts`，把 Prisma CLI 的 datasource 配置从 `schema.prisma` 挪出
4. 新增 `server/auth/*` 与 `server/actions/auth.ts`，包含 Supabase server/browser client、`requireUser`、`requireRole`、profile 自动创建
5. 新增 `app/login/page.tsx`、`components/auth/LoginForm.tsx`、`components/auth/SignOutButton.tsx`
6. 新增 `app/teacher/page.tsx` 占位页和 `app/unauthorized/page.tsx`
7. 更新 `app/layout.tsx` 和 `app/page.tsx`，使项目已经能承载登录态导航
8. 验证通过：`npm run lint`、`npm run prisma:generate`、`npm run prisma:validate`、`npm run build`

### 当前已落地的 Phase 5.2 与 Phase 5.4 进展

本轮继续实际完成了这些工作：

1. 新增 `types/body-region.ts`、`lib/constants/body-regions.ts`、`lib/constants/feedback-labels.ts`，把 body region 和反馈标签抽成可复用的统一来源
2. 现有 `app/lib/body-region-types.ts`、`app/lib/body-region-constants.ts`、`app/lib/feedback-constants.ts` 已改为兼容 re-export，旧页面暂时不用大面积改 import
3. 新增 `prisma/seed-data/body-regions.ts`、`prisma/seed-data/feedback-labels.ts`、`prisma/seed-data/practices.ts`
4. `prisma/seed.ts` 已改为真实 upsert：`body_regions`、`feedback_labels`、`practices`、`practice_body_regions`
5. 已成功执行首个 migration：`feldenkrais-mvp/prisma/migrations/20260331091023_init_core_schema/migration.sql`
6. 已成功 seed 到 Supabase：30 个 body regions、12 个 feedback labels、7 条 practices、41 条 practice-body-region 关联
7. 新增 `server/queries/practices.ts` 与 `types/practice.ts`
8. `app/practice-search/page.tsx`、`app/practices/[slug]/page.tsx`、`app/feedback/new/page.tsx` 已切到数据库查询练习，不再依赖 mock 练习作为正式数据源
9. 新增 `components/practices/PracticeCard.tsx` 与 `components/practices/PracticeSearchClient.tsx`，把找练习页改成“服务端取 practice，客户端处理人体图筛选”的结构
10. `app/feedback/page.tsx` 与 `app/feedback/new/page.tsx` 已增加学生角色保护；老师访问会被拦到 `/unauthorized`
11. `components/auth/LoginForm.tsx` 与 `server/actions/auth.ts` 已支持注册时带上 `student / teacher` 角色 metadata，登录后按已有 profile 角色路由
12. 验证通过：`npm run lint`、`npm run prisma:generate`、`npm run prisma:migrate:dev -- --name init_core_schema`、`npm run db:seed`、`npm run build`

### 改造总原则

1. `front_* / back_*` 这些 body region code 继续作为前端、数据库、统计查询的统一锚点
2. 不再让浏览器直接成为业务数据源，所有正式数据都进入 Supabase Postgres
3. 不再保留“多个部位共用一套反馈值”的表单模型
4. 学生端和老师端仍在同一个 Next.js 项目里，用登录状态与角色控制页面和数据访问
5. 业务读写统一走服务端：Server Components、Server Actions、`server/*` 查询层
6. `localStorage` 只允许作为一次性导入旧数据的临时来源，不再是正式存储
7. Prisma 7 的 datasource 配置放在 `prisma.config.ts`，运行时数据库连接由 `@prisma/adapter-pg` 提供

### A. 现有项目改造建议

#### A.1 可以保留不动或基本保留的部分

| 现有文件 | 处理方式 | 说明 |
|------|------|------|
| `feldenkrais-mvp/public/audio/*` | 保留 | 先继续作为静态音频资源使用，后续再迁移到 Supabase Storage |
| `feldenkrais-mvp/app/components/body-map/BodyMapFront.tsx` | 保留 SVG 路径，迁移目录 | 路径数据已经可用，不要重画 |
| `feldenkrais-mvp/app/components/body-map/BodyMapBack.tsx` | 保留 SVG 路径，迁移目录 | 路径数据已经可用，不要重画 |
| `feldenkrais-mvp/app/lib/body-region-types.ts` | 保留 code 定义，迁移到 `types/` | 这份 code 联动 SVG、数据库、统计，不能改名 |
| `feldenkrais-mvp/app/lib/body-region-constants.ts` | 保留字典内容，迁移到 `lib/constants/` | `nameZh`、`viewSide` 都可以继续使用 |
| `feldenkrais-mvp/app/globals.css` | 保留 | 当前样式极轻，先不拆 |

#### A.2 需要重构的部分

| 现有文件 | 处理方式 | 为什么要改 |
|------|------|------|
| `feldenkrais-mvp/app/components/body-map/BodyMap.tsx` | 迁移到 `components/body-map/BodyMap.tsx` 并补充“当前编辑部位”联动 | 反馈页需要多选 + 当前部位切换，而不只是高亮 |
| `feldenkrais-mvp/app/practice-search/page.tsx` | 改为“服务端取数 + 客户端交互”组合 | 数据源要从 mock 迁到数据库 |
| `feldenkrais-mvp/app/practices/[slug]/page.tsx` | 改为 Prisma 查询 | 详情页不应再依赖 `MOCK_PRACTICES` |
| `feldenkrais-mvp/app/feedback/new/page.tsx` | 改为登录后页面，服务端预取练习、标签、body region 字典 | 后续提交要走 Server Action |
| `feldenkrais-mvp/app/feedback/new/FeedbackFormClient.tsx` | 拆分重写 | 当前 state 结构不支持“每个部位单独编辑” |
| `feldenkrais-mvp/app/feedback/page.tsx` | 改为服务端按当前学生读取数据库 | 学生只能看自己的反馈 |
| `feldenkrais-mvp/app/components/feedback/FeelingTagSelector.tsx` | 保留 UI 思路，改 props | 要支持基于某个 body part entry 编辑 |
| `feldenkrais-mvp/app/components/feedback/IntensitySelector.tsx` | 改 props 为 `number | null` | 避免默认值掩盖“尚未填写” |
| `feldenkrais-mvp/app/components/feedback/LeftRightSelector.tsx` | 改 props 为强类型 | 让 entry 级字段更稳定 |
| `feldenkrais-mvp/app/layout.tsx` | 增加登录态、角色导航、退出登录入口 | 老师端入口和学生端入口要在同一项目里共存 |
| `feldenkrais-mvp/app/page.tsx` | 调整首页 CTA 和登录态文案 | 入口要兼容登录后体验 |

#### A.3 应该废弃或删除的旧实现

| 现有文件 / 逻辑 | 处理方式 | 原因 |
|------|------|------|
| `feldenkrais-mvp/app/lib/feedback-storage.ts` | 删除 | 正式数据不能再保存在 localStorage |
| `feldenkrais-mvp/app/lib/mock-practice-data.ts` | 完成 seed 后删除 | 练习数据应进入数据库；这个文件只保留到导表完成 |
| `feldenkrais-mvp/app/lib/feedback-types.ts` | 删除并由新 `types/feedback.ts` 替代 | 旧类型把多个部位压成了一条共享字段 |
| `practiceTitle` URL query 作为正式写入依据 | 废弃 | 提交时应只相信 `practiceId`，标题由服务端快照 |
| 反馈列表页的 `useEffect + localStorage` 读取方式 | 删除 | 改成服务端查询当前登录用户数据 |

#### A.4 `app/lib` 应该怎么迁移

| 现有位置 | 迁移后位置 | 说明 |
|------|------|------|
| `app/lib/body-region-types.ts` | `types/body-region.ts` | 纯类型，应该从 `app/` 拿出来 |
| `app/lib/body-region-constants.ts` | `lib/constants/body-regions.ts` | 纯常量字典，供客户端和服务端共用 |
| `app/lib/feedback-constants.ts` | `lib/constants/feedback-labels.ts` | 反馈标签字典改成全局常量 |
| `app/lib/feedback-types.ts` | `types/feedback.ts` | 改成 session / entry 结构 |
| `app/lib/mock-practice-data.ts` | 拆成 `prisma/seed-data/practices.ts` + `server/queries/practices.ts` | mock 数据要分成“seed 数据”和“正式查询” |

#### A.5 现有反馈表单逻辑要怎么改成交互上“每个部位单独编辑”

当前错误模型是：

- 先多选多个身体部位
- 再给这一组部位共用一套标签、强度、左右差异、备注

必须改成的新模型是：

1. 页面顶部仍然先选 `课前 / 课后`
2. 人体图仍然允许多选
3. 用户每选中一个 body region，就立即创建一个独立的 entry 草稿
4. 页面右侧只编辑“当前激活的那个部位”
5. 已选部位需要显示成一排 tabs / chips，可切换当前正在编辑的部位
6. 每个部位都有自己的 `intensityScore`、`labelCodes`、`leftRightDiff`、`note`
7. 提交时，不是提交一个共享表单，而是提交一个 `feedback_session` 和多个 `feedback_body_part_entry`

### B. 最终目录结构

建议把当前项目演进为下面这棵树，仍然是一个 Next.js App Router 单仓库项目：

```text
feldenkrais-mvp/
├── app/
│   ├── (public)/
│   │   ├── page.tsx
│   │   └── login/
│   │       └── page.tsx
│   ├── (student)/
│   │   ├── practice-search/
│   │   │   └── page.tsx
│   │   ├── practices/
│   │   │   └── [slug]/
│   │   │       └── page.tsx
│   │   └── feedback/
│   │       ├── page.tsx
│   │       ├── new/
│   │       │   └── page.tsx
│   │       └── import-legacy/
│   │           └── page.tsx
│   ├── teacher/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── practices/
│   │   │   └── [practiceId]/
│   │   │       └── page.tsx
│   │   └── students/
│   │       └── [studentId]/
│   │           └── page.tsx
│   ├── api/
│   │   └── auth/
│   │       └── callback/
│   │           └── route.ts
│   ├── unauthorized/
│   │   └── page.tsx
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   └── SignOutButton.tsx
│   ├── body-map/
│   │   ├── BodyMap.tsx
│   │   ├── BodyMapFront.tsx
│   │   └── BodyMapBack.tsx
│   ├── feedback/
│   │   ├── FeedbackFormClient.tsx
│   │   ├── FeedbackRegionTabs.tsx
│   │   ├── BodyPartEntryEditor.tsx
│   │   ├── FeedbackSessionCard.tsx
│   │   ├── LegacyImportClient.tsx
│   │   ├── FeelingTagSelector.tsx
│   │   ├── IntensitySelector.tsx
│   │   └── LeftRightSelector.tsx
│   ├── practices/
│   │   ├── PracticeCard.tsx
│   │   └── PracticeSearchClient.tsx
│   └── teacher/
│       ├── TeacherPracticeStats.tsx
│       ├── TeacherStudentHistory.tsx
│       └── StudentLookup.tsx
├── lib/
│   ├── constants/
│   │   ├── body-regions.ts
│   │   ├── feedback-labels.ts
│   │   └── routes.ts
│   ├── format/
│   │   ├── date.ts
│   │   └── duration.ts
│   ├── mappers/
│   │   └── feedback.ts
│   └── validation/
│       └── feedback.ts
├── server/
│   ├── actions/
│   │   ├── auth.ts
│   │   └── feedback.ts
│   ├── auth/
│   │   ├── supabase-browser.ts
│   │   ├── supabase-server.ts
│   │   ├── require-user.ts
│   │   ├── require-role.ts
│   │   └── ensure-profile.ts
│   ├── db/
│   │   └── prisma.ts
│   ├── queries/
│   │   ├── practices.ts
│   │   ├── feedback.ts
│   │   ├── teacher.ts
│   │   └── profiles.ts
│   └── services/
│       ├── feedback.service.ts
│       └── teacher-stats.service.ts
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── seed-data/
│       ├── body-regions.ts
│       ├── feedback-labels.ts
│       └── practices.ts
├── types/
│   ├── auth.ts
│   ├── body-region.ts
│   ├── practice.ts
│   ├── feedback.ts
│   └── teacher.ts
└── public/
    └── audio/
```

目录职责要明确：

| 目录 | 放什么 |
|------|------|
| `app/` | 路由、页面、layout、route handlers，只负责页面编排和入口 |
| `components/` | 可复用 UI 组件，尤其是客户端组件 |
| `lib/` | 纯函数、常量、格式化、校验，不直接碰数据库 |
| `server/` | 只在服务端运行的逻辑：Prisma、Auth guard、query、service、server actions |
| `prisma/` | schema、migration、seed 数据 |
| `types/` | 共享 domain types，避免把类型继续塞在 `app/lib` 里 |
| `public/` | 现有静态音频、图标；后续可逐步迁到 Supabase Storage |

### C. 数据库模型设计

#### C.1 关系设计

最终关系应该是：

1. `UserProfile`
   一个 Supabase Auth 用户，在业务侧对应一条 profile 记录，保存角色和展示信息
2. `BodyRegion`
   30 个标准身体区域，继续沿用现有 code
3. `Practice`
   练习主表
4. `PracticeBodyRegion`
   练习和身体区域多对多
5. `FeedbackSession`
   一次反馈会话，保存学生、练习、课前/课后、日期
6. `FeedbackBodyPartEntry`
   这次会话中某一个具体身体部位的反馈明细
7. `FeedbackLabel`
   感受标签字典表
8. `FeedbackBodyPartEntryLabel`
   某个 body part entry 与多个标签的多对多关系

#### C.2 关键设计点

1. `UserProfile.id` 直接复用 Supabase Auth 的 `user.id`
2. Prisma 不直接管理 `auth.users`，而是管理你自己的 `public.user_profiles`
3. `FeedbackSession` 只放会话级字段：学生、练习、阶段、日期
4. `FeedbackBodyPartEntry` 放部位级字段：强度、标签、左右差异、备注
5. `practice_title_snapshot` 在会话层冗余保存，避免练习标题未来修改后历史记录失真
6. `sort_order` 放在 `FeedbackBodyPartEntry`，用于保持用户填写部位时的展示顺序
7. 强度 `0-10` 的范围建议在 Server Action 校验，并在 migration 里补数据库 `check constraint`

#### C.3 `schema.prisma` 初稿

> 已同步到 `feldenkrais-mvp/prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

enum UserRole {
  STUDENT @map("student")
  TEACHER @map("teacher")
}

enum BodyViewSide {
  FRONT @map("front")
  BACK  @map("back")
}

enum PracticeStatus {
  DRAFT     @map("draft")
  PUBLISHED @map("published")
}

enum FeedbackPhase {
  BEFORE @map("before")
  AFTER  @map("after")
}

enum LeftRightDiff {
  NONE       @map("none")
  LEFT_MORE  @map("left_more")
  RIGHT_MORE @map("right_more")
  UNCLEAR    @map("unclear")
}

model UserProfile {
  id               String            @id @db.Uuid
  email            String            @unique
  fullName         String?           @map("full_name")
  role             UserRole          @default(STUDENT)
  createdAt        DateTime          @default(now()) @map("created_at")
  updatedAt        DateTime          @updatedAt @map("updated_at")
  feedbackSessions FeedbackSession[]

  @@index([role])
  @@map("user_profiles")
}

model BodyRegion {
  id               String                  @id @default(uuid()) @db.Uuid
  code             String                  @unique
  nameZh           String                  @map("name_zh")
  viewSide         BodyViewSide            @map("view_side")
  sortOrder        Int                     @default(0) @map("sort_order")
  svgKey           String?                 @map("svg_key")
  createdAt        DateTime                @default(now()) @map("created_at")
  updatedAt        DateTime                @updatedAt @map("updated_at")
  practiceLinks    PracticeBodyRegion[]
  feedbackEntries  FeedbackBodyPartEntry[]

  @@index([viewSide, sortOrder])
  @@map("body_regions")
}

model Practice {
  id                    String               @id @default(uuid()) @db.Uuid
  slug                  String               @unique
  title                 String
  courseName            String?              @map("course_name")
  summary               String?
  contentText           String?              @map("content_text")
  audioUrl              String?              @map("audio_url")
  durationSec           Int?                 @map("duration_sec")
  status                PracticeStatus       @default(PUBLISHED)
  createdAt             DateTime             @default(now()) @map("created_at")
  updatedAt             DateTime             @updatedAt @map("updated_at")
  bodyRegionLinks       PracticeBodyRegion[]
  feedbackSessions      FeedbackSession[]

  @@index([status, updatedAt])
  @@map("practices")
}

model PracticeBodyRegion {
  id           String     @id @default(uuid()) @db.Uuid
  practiceId   String     @map("practice_id") @db.Uuid
  bodyRegionId String     @map("body_region_id") @db.Uuid
  createdAt    DateTime   @default(now()) @map("created_at")
  practice     Practice   @relation(fields: [practiceId], references: [id], onDelete: Cascade)
  bodyRegion   BodyRegion @relation(fields: [bodyRegionId], references: [id], onDelete: Restrict)

  @@unique([practiceId, bodyRegionId])
  @@index([bodyRegionId, practiceId])
  @@map("practice_body_regions")
}

model FeedbackSession {
  id                    String                  @id @default(uuid()) @db.Uuid
  studentProfileId      String                  @map("student_profile_id") @db.Uuid
  practiceId            String?                 @map("practice_id") @db.Uuid
  practiceTitleSnapshot String?                 @map("practice_title_snapshot")
  feedbackPhase         FeedbackPhase           @map("feedback_phase")
  feedbackDate          DateTime                @map("feedback_date") @db.Date
  createdAt             DateTime                @default(now()) @map("created_at")
  updatedAt             DateTime                @updatedAt @map("updated_at")
  studentProfile        UserProfile             @relation(fields: [studentProfileId], references: [id], onDelete: Cascade)
  practice              Practice?               @relation(fields: [practiceId], references: [id], onDelete: SetNull)
  bodyPartEntries       FeedbackBodyPartEntry[]

  @@index([studentProfileId, feedbackDate])
  @@index([practiceId, feedbackDate])
  @@index([feedbackPhase, feedbackDate])
  @@map("feedback_sessions")
}

model FeedbackBodyPartEntry {
  id             String                       @id @default(uuid()) @db.Uuid
  sessionId      String                       @map("session_id") @db.Uuid
  bodyRegionId   String                       @map("body_region_id") @db.Uuid
  sortOrder      Int                          @default(0) @map("sort_order")
  intensityScore Int                          @map("intensity_score")
  leftRightDiff  LeftRightDiff?               @map("left_right_diff")
  note           String?
  createdAt      DateTime                     @default(now()) @map("created_at")
  updatedAt      DateTime                     @updatedAt @map("updated_at")
  session        FeedbackSession              @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  bodyRegion     BodyRegion                   @relation(fields: [bodyRegionId], references: [id], onDelete: Restrict)
  labels         FeedbackBodyPartEntryLabel[]

  @@unique([sessionId, bodyRegionId])
  @@index([sessionId, sortOrder])
  @@index([bodyRegionId, createdAt])
  @@map("feedback_body_part_entries")
}

model FeedbackLabel {
  id         String                       @id @default(uuid()) @db.Uuid
  code       String                       @unique
  nameZh     String                       @map("name_zh")
  sortOrder  Int                          @default(0) @map("sort_order")
  isActive   Boolean                      @default(true) @map("is_active")
  createdAt  DateTime                     @default(now()) @map("created_at")
  updatedAt  DateTime                     @updatedAt @map("updated_at")
  entryLinks FeedbackBodyPartEntryLabel[]

  @@index([isActive, sortOrder])
  @@map("feedback_labels")
}

model FeedbackBodyPartEntryLabel {
  id        String                @id @default(uuid()) @db.Uuid
  entryId   String                @map("entry_id") @db.Uuid
  labelId   String                @map("label_id") @db.Uuid
  createdAt DateTime              @default(now()) @map("created_at")
  entry     FeedbackBodyPartEntry @relation(fields: [entryId], references: [id], onDelete: Cascade)
  label     FeedbackLabel         @relation(fields: [labelId], references: [id], onDelete: Restrict)

  @@unique([entryId, labelId])
  @@index([labelId, entryId])
  @@map("feedback_body_part_entry_labels")
}
```

### D. 第 5 步 + 第 6 步的真实开发顺序

#### Phase 5.1：初始化 Supabase + Prisma

- 目标：把现有 Next.js 项目接到 Supabase Auth + Postgres，并准备 Prisma client
- 修改文件：`feldenkrais-mvp/package.json`、`feldenkrais-mvp/README.md`、`feldenkrais-mvp/app/layout.tsx`
- 新增文件：`feldenkrais-mvp/.env.example`、`feldenkrais-mvp/prisma/schema.prisma`、`feldenkrais-mvp/server/db/prisma.ts`、`feldenkrais-mvp/server/auth/supabase-server.ts`、`feldenkrais-mvp/server/auth/supabase-browser.ts`
- 完成标准：环境变量齐全，`prisma validate` 通过，服务端能读取当前 Supabase session

#### Phase 5.2：建表 + seed 身体部位、标签、练习

- 目标：把现有 body region、感受标签、mock 练习正式落到数据库
- 修改文件：`feldenkrais-mvp/app/lib/body-region-constants.ts`、`feldenkrais-mvp/app/lib/feedback-constants.ts`、`feldenkrais-mvp/app/lib/mock-practice-data.ts`
- 新增文件：`feldenkrais-mvp/prisma/seed.ts`、`feldenkrais-mvp/prisma/seed-data/body-regions.ts`、`feldenkrais-mvp/prisma/seed-data/feedback-labels.ts`、`feldenkrais-mvp/prisma/seed-data/practices.ts`
- 完成标准：数据库里有 30 个 body region、12 个 feedback label、现有 7 条 practice 及其多对多关系

#### Phase 5.3：接入登录和 profile

- 目标：实现学生登录、老师登录、profile 自动创建与角色控制
- 修改文件：`feldenkrais-mvp/app/layout.tsx`、`feldenkrais-mvp/app/page.tsx`、`feldenkrais-mvp/app/feedback/page.tsx`
- 新增文件：`feldenkrais-mvp/app/(public)/login/page.tsx`、`feldenkrais-mvp/app/api/auth/callback/route.ts`、`feldenkrais-mvp/components/auth/LoginForm.tsx`、`feldenkrais-mvp/components/auth/SignOutButton.tsx`、`feldenkrais-mvp/server/actions/auth.ts`、`feldenkrais-mvp/server/auth/require-user.ts`、`feldenkrais-mvp/server/auth/require-role.ts`、`feldenkrais-mvp/server/auth/ensure-profile.ts`
- 完成标准：学生登录后只能进入学生页面；老师登录后可进入 `/teacher`；未登录访问学生页面会被重定向到 `/login`

#### Phase 5.4：把找练习页和练习详情页改成读数据库

- 目标：用 Prisma 查询替换 mock 练习数据
- 修改文件：`feldenkrais-mvp/app/practice-search/page.tsx`、`feldenkrais-mvp/app/practices/[slug]/page.tsx`、`feldenkrais-mvp/app/feedback/new/page.tsx`
- 新增文件：`feldenkrais-mvp/server/queries/practices.ts`、`feldenkrais-mvp/types/practice.ts`、`feldenkrais-mvp/components/practices/PracticeCard.tsx`、`feldenkrais-mvp/components/practices/PracticeSearchClient.tsx`
- 完成标准：找练习页、详情页、反馈页都只依赖数据库练习数据；`app/lib/mock-practice-data.ts` 完成退役

#### Phase 6.1：重构反馈表单，改成按部位逐个编辑

- 目标：把旧的共享字段表单，重构成 session + per-body-entry 编辑 UI
- 修改文件：`feldenkrais-mvp/app/feedback/new/page.tsx`、`feldenkrais-mvp/app/feedback/new/FeedbackFormClient.tsx`、`feldenkrais-mvp/app/components/feedback/FeelingTagSelector.tsx`、`feldenkrais-mvp/app/components/feedback/IntensitySelector.tsx`、`feldenkrais-mvp/app/components/feedback/LeftRightSelector.tsx`
- 新增文件：`feldenkrais-mvp/types/feedback.ts`、`feldenkrais-mvp/components/feedback/FeedbackFormClient.tsx`、`feldenkrais-mvp/components/feedback/FeedbackRegionTabs.tsx`、`feldenkrais-mvp/components/feedback/BodyPartEntryEditor.tsx`、`feldenkrais-mvp/lib/validation/feedback.ts`
- 完成标准：选中多个部位后，每个部位都可以切换编辑，且拥有自己的强度、标签、左右差异、备注

#### Phase 6.2：把提交改成写入 `feedback_session + feedback_body_part_entries`

- 目标：正式把反馈写入数据库，并下线 localStorage
- 修改文件：`feldenkrais-mvp/app/feedback/new/page.tsx`、`feldenkrais-mvp/app/feedback/new/FeedbackFormClient.tsx`
- 新增文件：`feldenkrais-mvp/server/actions/feedback.ts`、`feldenkrais-mvp/server/services/feedback.service.ts`、`feldenkrais-mvp/server/queries/feedback.ts`
- 删除文件：`feldenkrais-mvp/app/lib/feedback-storage.ts`
- 完成标准：一次提交会创建 1 条 `feedback_sessions` 和多条 `feedback_body_part_entries`，每条 entry 都能挂多个标签

#### Phase 6.3：重构反馈列表页，读数据库并处理旧数据导入

- 目标：学生只能看到自己的数据库反馈，同时提供一次性导入旧 localStorage 的能力
- 修改文件：`feldenkrais-mvp/app/feedback/page.tsx`
- 新增文件：`feldenkrais-mvp/components/feedback/FeedbackSessionCard.tsx`、`feldenkrais-mvp/app/feedback/import-legacy/page.tsx`、`feldenkrais-mvp/components/feedback/LegacyImportClient.tsx`
- 完成标准：反馈列表页只显示当前登录学生自己的记录；旧浏览器里的 `feldenkrais_feedback_records` 可以被一次性导入数据库

#### Phase 6.4：新增老师端基础统计页

- 目标：在同一个 Next.js 项目中上线最小可用老师端
- 修改文件：`feldenkrais-mvp/app/layout.tsx`
- 新增文件：`feldenkrais-mvp/app/teacher/layout.tsx`、`feldenkrais-mvp/app/teacher/page.tsx`、`feldenkrais-mvp/app/teacher/practices/[practiceId]/page.tsx`、`feldenkrais-mvp/app/teacher/students/[studentId]/page.tsx`、`feldenkrais-mvp/components/teacher/TeacherPracticeStats.tsx`、`feldenkrais-mvp/components/teacher/TeacherStudentHistory.tsx`、`feldenkrais-mvp/server/queries/teacher.ts`、`feldenkrais-mvp/server/services/teacher-stats.service.ts`
- 完成标准：老师能看到练习反馈总数、身体部位计数、常见标签、某个学生的反馈历史

### E. 现有反馈表单该怎么改 UI

#### E.1 身体部位多选区怎么改

1. 左侧仍然使用当前 `BodyMap` 组件，但点击部位时不再只是维护一个 `bodyRegionCodes` 数组，而是同时初始化该部位对应的 entry 草稿
2. 人体图下方不再只显示静态标签，而是显示“已选部位 tabs”
3. 每个 tab 需要显示部位中文名、是否已完成填写、当前强度简写，例如 `强度 8`
4. 用户点击某个 tab，就切换右侧编辑器为该部位
5. 用户取消某个部位时，需要同步删除该部位对应的 entry 草稿

#### E.2 用户选了多个部位后，页面应该怎样显示

页面应该变成“两列结构但右侧是单部位编辑器”：

1. 顶部放练习信息、`课前 / 课后`、日期
2. 左列放人体图和已选部位 tabs
3. 右列放“正在编辑：左肩”这类当前部位标题，以及感受标签、强度评分、左右差异、备注
4. 底部显示 `已完成 2 / 3 个部位` 和提交按钮

#### E.3 如何让每个部位单独设置强度、标签、左右差异、备注

具体做法：

1. 选中部位时创建 `entriesByRegionCode[code]`
2. 右侧编辑器只绑定 `activeRegionCode` 对应的 entry
3. 切换 tab 时，只切换 `activeRegionCode`
4. `FeelingTagSelector`、`IntensitySelector`、`LeftRightSelector`、`textarea` 都只写入当前 active entry
5. 表单提交前，把 `entriesByRegionCode` 转成数组，按 `sortOrder` 提交

#### E.4 提交时前端 state 应该长什么样

```ts
export type FeedbackBodyPartDraft = {
  bodyRegionCode: BodyRegionCode;
  sortOrder: number;
  intensityScore: number | null;
  labelCodes: string[];
  leftRightDiff: LeftRightDiff | null;
  note: string;
};

export type FeedbackSessionDraft = {
  practiceId?: string;
  feedbackPhase: 'before' | 'after';
  feedbackDate: string;
  selectedRegionCodes: BodyRegionCode[];
  activeRegionCode: BodyRegionCode | null;
  entriesByRegionCode: Partial<Record<BodyRegionCode, FeedbackBodyPartDraft>>;
};
```

#### E.5 提交到服务端 payload 应该长什么样

```ts
export type CreateFeedbackSessionPayload = {
  practiceId?: string;
  feedbackPhase: 'before' | 'after';
  feedbackDate: string;
  entries: Array<{
    bodyRegionCode: BodyRegionCode;
    sortOrder: number;
    intensityScore: number;
    labelCodes: string[];
    leftRightDiff: LeftRightDiff | null;
    note: string;
  }>;
};
```

#### E.6 表单校验应该怎么改

1. 至少选择 1 个部位
2. `entries.length` 必须和 `selectedRegionCodes.length` 一致
3. 每个 entry 都必须有 `intensityScore`
4. `intensityScore` 必须在 `0-10`
5. `labelCodes` 可以为空数组
6. `leftRightDiff` 可以为 `null`
7. `note` 可以为空字符串

### F. 老师端最小可用统计

#### F.1 老师端需要哪些页面

1. `/teacher`
   作为老师首页，展示练习列表、反馈总量、学生查找入口
2. `/teacher/practices/[practiceId]`
   查看某个练习下的反馈总数、身体部位计数、常见标签、最近反馈
3. `/teacher/students/[studentId]`
   查看某个学生的反馈历史

#### F.2 这些页面的查询逻辑怎么设计

`/teacher`：

1. 查询所有已发布练习及每个练习的反馈 session 数量
2. 查询最近有反馈的学生列表
3. 提供到具体练习页和学生页的跳转

`/teacher/practices/[practiceId]`：

1. 统计 `feedback_sessions` 中 `practice_id = 当前练习` 的总数
2. 统计该练习下 `feedback_body_part_entries` 的 `body_region_id` 出现次数
3. 统计该练习下 `feedback_body_part_entry_labels` 中各 label 出现次数
4. 查询最近若干条 session，便于老师点击进入某个学生历史页

`/teacher/students/[studentId]`：

1. 查询该学生所有 `feedback_sessions`
2. include 练习信息、body part entries、labels、body region
3. 按 `feedback_date desc, created_at desc` 排序

#### F.3 查询实现建议

1. 常规列表查询优先用 Prisma `findMany`
2. 简单计数优先用 Prisma `_count`
3. 身体部位计数和标签计数这类聚合，优先放在 `server/queries/teacher.ts`
4. 如果 Prisma 聚合 API 写起来明显比 SQL 更绕，直接在服务端用 `prisma.$queryRaw` 做只读聚合查询，不要把复杂统计硬塞进页面组件

#### F.4 需要哪些索引优化

建议至少加这些索引：

1. `feedback_sessions(student_profile_id, feedback_date)`
2. `feedback_sessions(practice_id, feedback_date)`
3. `feedback_sessions(feedback_phase, feedback_date)`
4. `feedback_body_part_entries(session_id, body_region_id)` 唯一索引
5. `feedback_body_part_entries(session_id, sort_order)`
6. `feedback_body_part_entries(body_region_id, created_at)`
7. `feedback_body_part_entry_labels(label_id, entry_id)`
8. `practice_body_regions(body_region_id, practice_id)`
9. `user_profiles(role)`

### G. 迁移到数据库和旧实现下线方式

#### G.1 localStorage 到数据库怎么迁

迁移策略应该是“一次性导入，然后彻底下线”：

1. 新增 `app/feedback/import-legacy/page.tsx`
2. 这个页面只在已登录学生状态下可访问
3. 浏览器读取旧 key：`feldenkrais_feedback_records`
4. 前端把旧记录映射为新 payload，调用 Server Action 导入数据库
5. 导入成功后提示用户清空本地数据，并自动删除 localStorage key

#### G.2 旧数据导入时怎么映射到新结构

旧结构没有“每个部位各自独立的强度/标签/备注”，所以迁移一定是有损的，但仍然可以最大化保留历史：

1. 旧的一条 `FeedbackRecord`
2. 变成新的一条 `FeedbackSession`
3. 旧记录中的每个 `bodyRegionCode`
4. 各自复制出一条 `FeedbackBodyPartEntry`
5. 每条 entry 都继承旧记录里同一套 `feelingTags / intensityScore / leftRightDiff / note`

这意味着：

1. 历史数据可以保留
2. 但无法从旧结构中“还原出每个部位原本不同的值”，因为旧数据里根本不存在这些信息
3. 所以导入后要在产品说明里标明：`2026-03-30` 前的历史反馈来自旧版结构

#### G.3 旧实现应该按什么顺序下线

1. 先接 Supabase + Prisma
2. 再完成新 schema 和 seed
3. 再完成登录与 profile
4. 再把练习数据改到数据库
5. 再重构反馈表单 state 和 UI
6. 再把提交切到数据库
7. 再开放一次性导入旧 localStorage
8. 最后删除 `feedback-storage.ts` 和 `mock-practice-data.ts`

### 结论

你现在的项目不需要推倒重来，只需要沿着下面这条线继续往下演进：

1. 保留人体图、body region code、现有页面 URL
2. 把 `app/lib` 里的类型和常量拆到 `types/`、`lib/`、`server/`
3. 用 Supabase Auth + Prisma 接管正式数据
4. 把反馈从“单条共享字段”升级成“session + 多个 body part entry”
5. 在同一个 Next.js 项目里增加老师端 `/teacher/*`

到这一步为止，第 5 步和第 6 步的技术路线、目录结构、数据库模型、UI/state/payload、老师端最小方案都已经明确，可以直接按 Phase 5.1 开始落代码。

## 2026-03-31 开发日志

### Step 5 已落地项回顾

当前仓库已经不再停留在方案阶段，以下基础设施已经真实接入：

1. Prisma 7 + Supabase Postgres 已接通，并已完成首个 migration 与 seed
2. Supabase Auth 登录、注册、角色 profile 同步已接通
3. 练习页和练习详情页已从数据库读取，不再把 mock 数据当正式数据源
4. 学生页 `/feedback`、`/feedback/new` 与老师页 `/teacher` 已有角色保护

### Step 6 本轮已完成

这一轮已经把反馈从旧的 `localStorage + 一条记录共用一套字段` 升级成数据库正式结构：

1. 新增 `types/feedback.ts`
   统一反馈 phase、label、左右差异、表单 draft、session 列表、老师端统计等类型
2. 新增 `lib/validation/feedback.ts`
   用 Zod 校验 `CreateFeedbackSessionPayload`
3. 新增 `server/services/feedback.ts`
   把前端 payload 写入 `feedback_sessions / feedback_body_part_entries / feedback_body_part_entry_labels`
4. 新增 `server/actions/feedback.ts`
   学生提交反馈时走 Server Action，不再写浏览器本地存储
5. 新增 `server/queries/feedback.ts`
   学生反馈列表和老师查看学生历史统一走数据库查询
6. 新增 `server/queries/teacher-feedback.ts`
   提供老师首页所需的练习反馈数、身体部位计数、标签计数、学生反馈入口
7. 新增 `components/feedback/FeedbackFormClient.tsx`
   反馈表单已改成“左侧多选身体部位，右侧按 active body part 逐个编辑”
8. 新增 `components/feedback/FeedbackBodyPartEditor.tsx`
   每个部位单独编辑强度、标签、左右差异、备注
9. 新增 `components/feedback/FeedbackSessionCard.tsx`
   列表页按 session 展示，每个 session 内部展开多个 body part entry
10. 新增 `components/teacher/TeacherDashboard.tsx`
    老师端首页已能展示最小统计
11. 新增页面 `app/teacher/students/[studentId]/page.tsx`
    老师可以查看某个学生的完整反馈历史
12. 新增页面 `app/feedback/import-legacy/page.tsx`
    学生可把旧版 `localStorage` 反馈一次性导入数据库
13. 新增 `components/feedback/LegacyImportClient.tsx`
    在客户端读取旧 key、预览旧记录、触发批量导入、导入后清空旧本地数据
14. 新增 `lib/constants/legacy-feedback.ts`
    专门保存旧 `localStorage` key 和旧 mock 练习 ID 到正式 slug 的映射
15. 新增页面 `app/teacher/practices/[practiceId]/page.tsx`
    老师可以下钻查看单个练习的反馈总数、身体部位分布、标签分布和最近反馈
16. 新增 `components/teacher/TeacherPracticeDetail.tsx`
    提供练习详情页 UI，串起练习统计、最近反馈和学生历史入口
17. 新增 `components/teacher/TeacherStatList.tsx`
    抽出老师端通用统计列表，复用于老师首页和练习详情页
18. 新增 `components/teacher/TeacherFeedbackFiltersForm.tsx`
    老师首页和练习详情页都已支持 `phase / dateFrom / dateTo` 的 URL 筛选
19. 新增 `lib/validation/teacher-feedback-filters.ts`
    统一解析和规整老师端筛选 query params
20. 老师端练习详情页最近反馈已支持 cursor 分页
    使用 `after / before` query params 翻页，翻页时会保留当前筛选条件
21. 首页、顶部导航、登录页都新增了显性的老师入口
    不再需要先猜 `/teacher` 路径，老师入口在首页和导航里都能直接看到
22. 修复了老师注册角色写入 bug
    `authenticateWithPassword` 现在会真正把表单里的 `role` 传给 Supabase 注册接口
23. 首页已重做为更清晰的双角色入口布局
    改掉原先分散、拥挤的卡片排版，学生和老师入口都保留但层次更清楚
24. 无权限页已移除临时老师角色修复入口
    当前回到更简单的流程：权限不对时直接重新注册或换账号登录

### 本轮删除 / 下线的旧实现

以下旧实现已经从正式链路中移除：

1. `feldenkrais-mvp/app/lib/feedback-storage.ts`
   已删除，不再允许通过 localStorage 作为正式保存介质
2. `feldenkrais-mvp/app/feedback/new/FeedbackFormClient.tsx`
   已删除，反馈表单改由 `components/feedback/FeedbackFormClient.tsx` 承担
3. `feldenkrais-mvp/components/feedback/FeedbackListClient.tsx`
   已删除，反馈列表改为服务端查询数据库
4. `feldenkrais-mvp/app/lib/mock-practice-data.ts`
   已删除，练习 mock 文件不再保留在正式仓库主链路中

### 当前真实状态

截至 `2026-03-31`，项目当前已经具备：

1. 学生登录后，可从数据库提交反馈 session
2. 一次反馈可包含多个身体部位，每个部位有独立的强度、标签、左右差异、备注
3. 学生“我的反馈”页面已从数据库读取自己的反馈历史
4. 老师首页可看到：
   - 各练习反馈数
   - 身体部位被记录次数
   - 常见反馈标签
   - 学生反馈历史入口
5. 老师可进入 `/teacher/students/[studentId]` 查看单个学生的历史反馈
6. 学生可进入 `/feedback/import-legacy` 把旧版浏览器本地反馈迁移到数据库
7. 老师可进入 `/teacher/practices/[practiceId]` 查看单个练习的反馈详情
8. 老师首页和练习详情页都支持按阶段、日期范围筛选统计结果
9. 老师端练习详情页最近反馈支持“较新反馈 / 较旧反馈”分页
10. 首页和顶部导航都能直接看到老师入口
11. 首页视觉结构已重新整理，学生入口和老师入口更清楚

### 仍待继续的下一步

当前还有几项适合紧接着继续做：

1. 手工验收真实导入流程
   在浏览器中放入一份旧 key `feldenkrais_feedback_records`，验证导入后 session / body part entries 是否正确拆分
2. 更细的老师端筛选
   如果后续老师需要更强分析能力，可以继续补学生筛选、练习筛选或标签筛选
3. 老师端最近反馈总数 / 页级说明优化
   当前已有分页能力，后续可以再补更明确的“当前窗口位置”提示
4. 老师角色治理规则收口
   当前 MVP 允许注册时自选老师 / 学生；如果后续进入真实使用阶段，建议改成邀请制或后台指派老师角色
5. 登录与权限提示页还可继续统一视觉语言
   当前首页已重做，但登录页和部分辅助页还可以继续精修
