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


## 第 5 步：接入 Supabase

> 尚未开始

## 第 6 步：打磨可用性

> 尚未开始
