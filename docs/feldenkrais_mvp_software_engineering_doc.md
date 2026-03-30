# 费登奎斯身体觉察记录与练习检索 MVP 软件工程文档

## 1. 文档目标

本文档用于指导一个 **最小可用网页版 MVP** 的设计、开发、协作与交付。

目标不是做完整平台，而是用最短路径跑通下面这条闭环：

**选择身体部位 → 查找相关练习 → 进入练习详情 → 完成练习 → 提交反馈记录 → 后续可检索与查看**

本文档服务于三类目的：

1. 产品范围收口：明确第一版做什么、不做什么。
2. 工程实现落地：明确页面、数据结构、模块、接口和开发顺序。
3. AI 协作开发：让 Cursor / GPT 能以统一约束生成代码与文档，避免失控扩张。

---

## 2. 项目背景与阶段定位

该产品服务于费登奎斯课程场景。

长期愿景可能包括：
- 按身体部位检索练习
- 记录练习前后身体感受反馈
- 累积录音、文字、视频、用户反馈
- 后续接入知识库、推荐、关系图谱、智能体

但当前阶段只做 **第一版 MVP**，目标非常明确：

### 第一阶段唯一目标
做出一个能给老师或学员实际试用的网页版原型，验证两件事：

1. **“按身体部位找练习”是否是有效入口**
2. **“练习前后做身体反馈”是否愿意被使用且对老师有价值**

这意味着第一版不是为了展示技术能力，而是为了验证产品闭环。

---

## 3. MVP 范围定义

## 3.1 必须实现的功能

### 功能 A：找练习
用户可以：
- 打开“找练习”页面
- 查看 2D 正面 / 背面人体图
- 点击一个身体区域
- 查看该区域相关练习列表
- 进入练习详情页
- 播放音频或阅读文字说明

### 功能 B：做反馈
用户可以：
- 打开“做反馈”页面
- 查看 2D 人体图
- 点击一个或多个身体区域
- 选择课前 / 课后
- 选择感受标签
- 输入强度评分
- 选择左右差异
- 输入可选备注
- 保存反馈记录

### 功能 C：练习与反馈关联
系统可以：
- 将反馈记录关联到某个练习
- 将练习关联到若干身体区域
- 将反馈记录关联到若干身体区域
- 在后续查看时展示这条反馈属于哪个练习、提到了哪些部位

---

## 3.2 MVP 不做的功能

第一版绝对不要做以下内容：

### 不做 AI 能力
- 不做智能体
- 不做问答推荐
- 不做 RAG / embedding / 知识库问答
- 不做 token 消耗型交互

### 不做复杂人体图
- 不做 3D
- 不做旋转模型
- 不做手指、骨骼、关节级精细划分

### 不做复杂媒体系统
- 不做视频上传管理系统
- 不做视频切片
- 不做复杂播放器功能

### 不做复杂后台
- 不做 CMS
- 不做权限后台
- 不做内容审核流
- 不做多角色管理

### 不做推荐与分析
- 不做个性化推荐
- 不做数据看板
- 不做趋势图和知识图谱

### 不做复杂用户体系
- 第一版默认可不做注册登录
- 如必须保留扩展性，也只保留后续可接入结构，不在本版实现

---

## 4. 目标用户与核心使用场景

## 4.1 目标用户

第一版优先服务：
- 老师本人
- 老师的小范围学员
- 产品验证阶段的内部测试者

不针对：
- 大规模公开用户
- 多机构入驻
- 复杂商业化场景

---

## 4.2 核心场景

### 场景 1：按身体部位找练习
用户感觉颈部、肩部、骨盆、腿部等区域需要练习，于是打开人体图，点击区域，查看相关练习。

### 场景 2：完成练习后记录身体变化
用户做完练习后，打开反馈页，点击感受明显的身体部位，记录感受标签、强度与备注。

### 场景 3：老师回看练习与反馈对应关系
老师查看某个练习对应的典型反馈，初步了解练习是否有效、哪些部位更常被提及。

---

## 5. 产品信息架构

第一版只需要非常小的信息架构。

## 5.1 核心对象

### 对象 1：身体区域 Body Region
系统中的标准化身体部位定义，例如：
- front_head
- front_neck
- front_left_shoulder
- back_neck

### 对象 2：练习 Practice
一条可以被查看、播放、描述的练习内容。
包括：
- 名称
- 简介
- 文字说明
- 音频链接
- 适用身体区域

### 对象 3：反馈 Feedback Record
一次练习前后或单次练习后的身体感受记录。
包括：
- 对应练习
- 阶段（课前 / 课后）
- 相关身体区域
- 感受标签
- 强度评分
- 左右差异
- 备注
- 日期

---

## 5.2 核心关系

- 一个练习可以关联多个身体区域
- 一个身体区域可以关联多个练习
- 一条反馈可以关联多个身体区域
- 一条反馈通常对应一个练习，但可允许为空（为了兼容未来“非练习上下文的身体记录”）

这意味着：
- 练习和身体区域是 **多对多**
- 反馈和身体区域是 **多对多**
- 反馈和练习是 **多对一（可空）**

---

## 6. 页面结构与路由设计

第一版页面数量控制在 5 个。

## 6.1 路由总览

```text
/
/practice-search
/practices/[slug]
/feedback
/feedback/new
```

---

## 6.2 页面说明

### 页面 1：首页 `/`

#### 目标
作为最简入口页，不承担复杂介绍功能。

#### 内容
- 页面标题
- 产品一句话说明
- 两个主按钮：
  - 去找练习
  - 去做反馈

#### 不做
- 不做长介绍
- 不做复杂 banner
- 不做登录入口

---

### 页面 2：找练习页 `/practice-search`

#### 目标
让用户通过人体图找到关联练习。

#### 页面组成
- 顶部标题
- 正面 / 背面切换控件
- 人体图组件
- 当前已选身体区域显示
- 练习列表区域

#### 关键交互
1. 用户点击人体图上的区域
2. 当前区域高亮
3. 练习列表根据区域刷新
4. 点击练习卡片进入详情页

#### 页面状态
- 默认未选中任何区域时，可提示“请点击一个身体部位”
- 选中后显示练习列表
- 若无匹配练习，显示空状态文案

---

### 页面 3：练习详情页 `/practices/[slug]`

#### 目标
展示单个练习内容，并引导去反馈。

#### 页面组成
- 练习标题
- 课程名（可选）
- 关联身体部位标签
- 简介
- 详细文字说明
- 音频播放器
- “做这个练习的反馈”按钮

#### 关键交互
- 点击“做这个练习的反馈”后跳转到：
  `/feedback/new?practiceId=xxx`
- 页面自动带入练习信息

---

### 页面 4：新建反馈页 `/feedback/new`

#### 目标
完成练习前后反馈录入。

#### 页面组成
- 页面标题
- 当前练习信息（如果来自练习详情页）
- 课前 / 课后切换
- 身体图组件（支持多选）
- 感受标签多选
- 强度评分
- 左右差异选择
- 备注输入框
- 保存按钮

#### 关键交互
- 用户可选择一个或多个身体区域
- 感受标签支持多选
- 提交后保存到数据库
- 成功后跳转到反馈列表或显示成功提示

#### 校验建议
- feedback_phase 必填
- 至少选 1 个身体区域
- intensity_score 必填，范围 0-10
- note 可空

---

### 页面 5：反馈记录页 `/feedback`

#### 目标
验证数据已保存，并为老师提供最基础的查看能力。

#### 页面组成
- 反馈记录列表
- 每条记录展示：
  - 日期
  - 练习名
  - 阶段
  - 身体部位
  - 标签
  - 强度
  - 简短备注

#### 不做
- 不做复杂筛选器
- 不做图表
- 不做编辑历史

---

## 7. 用户流程

## 7.1 找练习流程

```text
进入首页
→ 点击“找练习”
→ 打开 practice-search
→ 点击身体区域
→ 查看相关练习列表
→ 点击练习卡片
→ 进入练习详情
→ 播放音频 / 阅读说明
→ 点击“做反馈”
```

---

## 7.2 做反馈流程

```text
进入反馈页
→ 选择练习（自动带入或手动无练习）
→ 选择课前 / 课后
→ 点击身体部位
→ 选择感受标签
→ 输入强度评分
→ 选择左右差异
→ 输入备注（可选）
→ 保存
→ 查看反馈记录列表
```

---

## 8. 数据建模设计

第一版采用最小但可扩展的数据模型。

## 8.1 表：body_regions

用途：维护标准身体区域定义。

### 字段
- `id`: uuid, 主键
- `code`: string, 唯一，例如 `front_head`
- `name_zh`: string，中文名称
- `view_side`: string，`front` / `back`
- `category`: string，可空，用于分类
- `sort_order`: integer，排序
- `svg_key`: string，可空，对应 SVG 元素 ID
- `created_at`: timestamp

### 说明
- `code` 是前后端、数据库和 SVG 的统一锚点
- `svg_key` 可以与 `code` 相同

---

## 8.2 表：practices

用途：存储练习内容。

### 字段
- `id`: uuid, 主键
- `title`: string，练习标题
- `slug`: string, 唯一，用于 URL
- `course_name`: string，可空
- `summary`: text，可空
- `content_text`: text，可空
- `audio_url`: string，可空
- `duration_sec`: integer，可空
- `status`: string，`draft` / `published`
- `created_at`: timestamp
- `updated_at`: timestamp

### 说明
第一版不单独拆“课程表”，直接用 `course_name` 保留轻量课程信息即可。

---

## 8.3 表：practice_body_regions

用途：建立练习与身体区域的多对多关系。

### 字段
- `id`: uuid, 主键
- `practice_id`: uuid, 外键
- `body_region_id`: uuid, 外键

### 约束建议
- `(practice_id, body_region_id)` 唯一

---

## 8.4 表：feedback_records

用途：存储一次反馈记录。

### 字段
- `id`: uuid, 主键
- `practice_id`: uuid, 可空，外键
- `practice_name_snapshot`: string，冗余保存练习名快照
- `feedback_phase`: string，`before` / `after`
- `feedback_date`: date
- `intensity_score`: integer，0-10
- `left_right_diff`: string，可空，`none` / `left_more` / `right_more` / `unclear`
- `note`: text，可空
- `created_at`: timestamp

### 说明
`practice_name_snapshot` 的存在是为了减少因为练习标题后续修改导致的历史阅读不一致问题。

---

## 8.5 表：feedback_record_regions

用途：将一条反馈关联到一个或多个身体区域。

### 字段
- `id`: uuid, 主键
- `feedback_record_id`: uuid, 外键
- `body_region_id`: uuid, 外键

### 约束建议
- `(feedback_record_id, body_region_id)` 唯一

---

## 8.6 表：feedback_record_tags

用途：存储反馈标签多选结果。

### 字段
- `id`: uuid, 主键
- `feedback_record_id`: uuid, 外键
- `tag_code`: string

### 说明
第一版不单独建立标签字典表也可以。
标签可先在前端常量中维护，数据库只存 `tag_code`。

---

## 8.7 建议标签字典（前端常量）

```ts
export const FEELING_TAGS = [
  { code: 'tight', name: '紧' },
  { code: 'relaxed', name: '松' },
  { code: 'sore', name: '酸' },
  { code: 'warm', name: '热' },
  { code: 'numb', name: '麻' },
  { code: 'clear', name: '清楚' },
  { code: 'blurry', name: '模糊' },
  { code: 'light', name: '轻' },
  { code: 'heavy', name: '沉' },
  { code: 'connected', name: '有连接感' },
]
```

---

## 9. 推荐 SQL 初稿

```sql
create table body_regions (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name_zh text not null,
  view_side text not null check (view_side in ('front', 'back')),
  category text,
  sort_order integer not null default 0,
  svg_key text,
  created_at timestamptz not null default now()
);

create table practices (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  course_name text,
  summary text,
  content_text text,
  audio_url text,
  duration_sec integer,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table practice_body_regions (
  id uuid primary key default gen_random_uuid(),
  practice_id uuid not null references practices(id) on delete cascade,
  body_region_id uuid not null references body_regions(id) on delete cascade,
  unique (practice_id, body_region_id)
);

create table feedback_records (
  id uuid primary key default gen_random_uuid(),
  practice_id uuid references practices(id) on delete set null,
  practice_name_snapshot text,
  feedback_phase text not null check (feedback_phase in ('before', 'after')),
  feedback_date date not null,
  intensity_score integer not null check (intensity_score >= 0 and intensity_score <= 10),
  left_right_diff text check (left_right_diff in ('none', 'left_more', 'right_more', 'unclear')),
  note text,
  created_at timestamptz not null default now()
);

create table feedback_record_regions (
  id uuid primary key default gen_random_uuid(),
  feedback_record_id uuid not null references feedback_records(id) on delete cascade,
  body_region_id uuid not null references body_regions(id) on delete cascade,
  unique (feedback_record_id, body_region_id)
);

create table feedback_record_tags (
  id uuid primary key default gen_random_uuid(),
  feedback_record_id uuid not null references feedback_records(id) on delete cascade,
  tag_code text not null
);
```

---

## 10. 前端数据类型建议

```ts
export type BodyRegionCode = string;

export type BodyRegion = {
  id: string;
  code: BodyRegionCode;
  nameZh: string;
  viewSide: 'front' | 'back';
  category?: string | null;
  sortOrder: number;
  svgKey?: string | null;
};

export type Practice = {
  id: string;
  title: string;
  slug: string;
  courseName?: string | null;
  summary?: string | null;
  contentText?: string | null;
  audioUrl?: string | null;
  durationSec?: number | null;
  status: 'draft' | 'published';
  bodyRegionCodes: BodyRegionCode[];
};

export type FeedbackPhase = 'before' | 'after';

export type LeftRightDiff = 'none' | 'left_more' | 'right_more' | 'unclear';

export type FeedbackRecord = {
  id: string;
  practiceId?: string | null;
  practiceNameSnapshot?: string | null;
  feedbackPhase: FeedbackPhase;
  feedbackDate: string;
  bodyRegionCodes: BodyRegionCode[];
  feelingTags: string[];
  intensityScore: number;
  leftRightDiff?: LeftRightDiff | null;
  note?: string | null;
  createdAt?: string;
};
```

---

## 11. 技术选型建议

## 11.1 推荐技术栈

- 前端框架：**Next.js (App Router)**
- 语言：**TypeScript**
- 样式：**Tailwind CSS**
- 数据库 / BaaS：**Supabase**
- 部署：**Vercel**
- 图形：**SVG**

---

## 11.2 选型理由

### 为什么是 Next.js
- 路由和页面结构清晰
- 与 Cursor 配合较好
- 学习资源多
- 前后端可以先写在一个项目里，降低复杂度

### 为什么是 Supabase
- 免费可用
- 自带 PostgreSQL
- 控制台直观
- 方便后续接入鉴权和对象存储

### 为什么是 SVG
- 2D 身体图天然适合 SVG
- 支持点击、高亮、绑定 ID
- 易于按区域拆分

---

## 11.3 第一版工程原则

- 单仓库
- 不引入过多状态管理库
- 不拆微服务
- 不做复杂后端层
- 尽量保持：页面层 + 数据访问层 + 组件层 的清晰结构

---

## 12. 前端目录结构建议

```text
src/
  app/
    page.tsx
    practice-search/page.tsx
    practices/[slug]/page.tsx
    feedback/page.tsx
    feedback/new/page.tsx

  components/
    body-map/
      BodyMap.tsx
      BodyMapFront.tsx
      BodyMapBack.tsx
      BodyRegionPath.tsx
      bodyRegions.ts

    practice/
      PracticeList.tsx
      PracticeCard.tsx
      PracticeDetail.tsx
      AudioPlayer.tsx

    feedback/
      FeedbackForm.tsx
      FeedbackTagSelector.tsx
      IntensitySlider.tsx
      LeftRightSelector.tsx

    ui/
      Button.tsx
      Card.tsx
      SectionTitle.tsx
      EmptyState.tsx

  lib/
    supabase/
      client.ts
      queries.ts
      mutations.ts
    constants/
      feelingTags.ts
      bodyRegionCodes.ts
    utils/
      cn.ts
      date.ts

  types/
    body-region.ts
    practice.ts
    feedback.ts
```

---

## 13. 组件设计

## 13.1 BodyMap 相关组件

### `BodyMap.tsx`
通用人体图容器。

#### 职责
- 控制正面 / 背面
- 管理传入的选中状态
- 管理点击事件回调

#### 建议 props
```ts
{
  side: 'front' | 'back';
  selectedCodes: string[];
  multiSelect?: boolean;
  onToggleRegion: (code: string) => void;
}
```

---

### `BodyMapFront.tsx` / `BodyMapBack.tsx`
分别渲染正面和背面 SVG。

#### 职责
- 只负责 SVG 结构本身
- 不负责业务逻辑

---

### `BodyRegionPath.tsx`
单个部位 path 封装。

#### 职责
- 接收区域 code
- 接收 selected / hover 状态
- 统一点击样式

---

## 13.2 Practice 相关组件

### `PracticeList.tsx`
根据当前 body region 展示练习列表。

### `PracticeCard.tsx`
单个练习展示卡片。
内容包括：
- 标题
- 简介
- 关联区域标签
- 查看详情按钮

### `PracticeDetail.tsx`
详情页主体内容。

### `AudioPlayer.tsx`
音频播放封装。
第一版使用原生 `<audio controls>` 即可。

---

## 13.3 Feedback 相关组件

### `FeedbackForm.tsx`
负责整张反馈表单。

#### 状态包含
- selectedPractice
- feedbackPhase
- selectedBodyRegions
- selectedTags
- intensityScore
- leftRightDiff
- note

### `FeedbackTagSelector.tsx`
标签多选组件。

### `IntensitySlider.tsx`
强度评分选择器。
第一版可以直接用数字按钮或 range input。

### `LeftRightSelector.tsx`
左右差异单选器。

---

## 14. 人体图 SVG 设计规范

## 14.1 组织原则

一个可点击身体区域 = 一个独立 SVG 元素或 `<g>` 分组。

示例：

```html
<svg viewBox="0 0 300 600">
  <g id="front_head" data-region-code="front_head">
    <path d="..." />
  </g>
  <g id="front_neck" data-region-code="front_neck">
    <path d="..." />
  </g>
</svg>
```

---

## 14.2 命名规范

必须统一使用 snake_case：

### 正面
- front_head
- front_neck
- front_left_shoulder
- front_right_shoulder
- front_chest
- front_abdomen
- front_pelvis
- front_left_thigh
- front_right_thigh
- front_left_knee
- front_right_knee
- front_left_lower_leg
- front_right_lower_leg
- front_left_foot
- front_right_foot

### 背面
- back_head
- back_neck
- back_left_shoulder
- back_right_shoulder
- back_upper_back
- back_lower_back
- back_pelvis
- back_left_thigh
- back_right_thigh
- back_left_knee
- back_right_knee
- back_left_lower_leg
- back_right_lower_leg
- back_left_foot
- back_right_foot

---

## 14.3 第一版区域粒度建议

只做大区域，不做精细解剖。

### 推荐数量
- 正面：12-15 个区域
- 背面：12-15 个区域

### 控范围原则
- 头、颈、肩、胸、腹、骨盆、腿、膝、小腿、脚 足够
- 不拆手掌、肘、手指、肋骨、具体脊椎节段

---

## 15. 数据访问与接口设计

第一版可以使用 Next.js Server Actions 或普通异步函数配合 Supabase 客户端，不需要先设计复杂 REST API。

但为了结构清晰，建议在 `lib/supabase/queries.ts` 和 `mutations.ts` 中封装。

---

## 15.1 查询函数建议

### `getBodyRegions(side?)`
用途：获取身体区域列表。

### `getPracticesByBodyRegion(code)`
用途：根据身体区域 code 查询已发布练习。

### `getPracticeBySlug(slug)`
用途：获取单个练习详情及关联区域。

### `getFeedbackRecords()`
用途：获取反馈记录列表。

---

## 15.2 写入函数建议

### `createFeedbackRecord(payload)`
用途：创建反馈主记录并插入区域、标签关联。

#### payload 建议
```ts
{
  practiceId?: string | null;
  practiceNameSnapshot?: string | null;
  feedbackPhase: 'before' | 'after';
  feedbackDate: string;
  bodyRegionCodes: string[];
  feelingTags: string[];
  intensityScore: number;
  leftRightDiff?: 'none' | 'left_more' | 'right_more' | 'unclear' | null;
  note?: string | null;
}
```

---

## 15.3 查询逻辑说明

### 按身体部位查练习
逻辑步骤：
1. 根据 `body_regions.code` 找到 `body_region_id`
2. 在 `practice_body_regions` 里查关联的 `practice_id`
3. 查询 `practices` 表中 `status = 'published'` 的练习

### 获取反馈列表
第一版不做复杂聚合，直接：
1. 查 feedback_records
2. 按 created_at 倒序
3. 再补充该记录关联的身体区域与标签

---

## 16. 状态管理建议

第一版尽量简单：

- 页面内局部状态：`useState`
- 服务端拉取数据：Next.js 页面级异步读取
- 不引入 Redux / Zustand，除非后面明显有跨页面复杂共享状态需求

### 说明
这个项目的难点不在全局状态，而在人体图、数据关联和 MVP 范围控制。
不要在状态管理上过度工程化。

---

## 17. 表单与校验建议

## 17.1 反馈表单最小校验规则

- `feedbackPhase` 必填
- `feedbackDate` 必填
- `bodyRegionCodes.length >= 1`
- `intensityScore` 必填且范围 0-10
- `feelingTags` 可允许 0 个或建议至少 1 个，取决于老师需求
- `note` 可空

---

## 17.2 错误处理原则

- 表单校验错误在前端即时提示
- 数据库写入失败时给出简单错误提示
- 不做复杂重试和错误上报系统

---

## 18. 初始数据策略

第一版不要先做后台录入工具。

### 推荐做法
通过以下两种方式初始化数据：

1. **Supabase SQL 插入少量种子数据**
2. **本地 `seed` 脚本插入数据**

### 初始建议数据量
- 身体区域：前后共 24-30 条
- 练习：3-8 条足够
- 每个练习关联 2-4 个部位

重点不是数据多，而是闭环完整。

---

## 19. 开发顺序

## Day 1：搭项目骨架
- 初始化 Next.js
- 配置 Tailwind
- 建立基础路由
- 创建基础布局
- 首页可进入两个主流程

## Day 2：完成人体图点击交互
- 做正面人体 SVG
- 支持点击高亮
- 输出当前选中的区域 code
- 再补背面切换

## Day 3：完成“找练习”闭环（假数据）
- 先在本地写死练习数据
- 选中部位后过滤练习
- 进入练习详情页
- 音频播放器接入示例地址

## Day 4：完成“做反馈”闭环（本地保存）
- 表单完成
- 身体区域多选
- 标签选择
- 强度和左右差异输入
- 提交后临时保存到 localStorage 或内存 mock

## Day 5：接入 Supabase
- 创建数据库表
- 插入 body_regions 与 practices
- 前端从 Supabase 读取练习
- 反馈写入 Supabase

## Day 6：打磨可用性
- 成功提示
- 空状态
- 错误提示
- 简单响应式布局
- 反馈列表页展示

## Day 7：测试与收口
- 用真实场景走通 5 次流程
- 修正命名和数据关系问题
- 写 README
- 准备演示版本

---

## 20. 工程约束

开发中必须遵守以下约束：

### 范围约束
- 不新增 AI 功能
- 不新增复杂后台
- 不新增推荐功能
- 不把项目扩成平台

### 代码约束
- 优先可读性，而不是炫技
- 小步提交
- 每完成一个页面，先补文档说明
- 所有核心常量集中管理
- 所有身体区域 code 全局统一

### 协作约束
- 文档与代码并行更新
- 每完成一个模块，都要更新模块说明
- 不允许“代码先乱写，文档以后再补”

---

## 21. MVP 验收标准

当下面这些都成立时，第一版就算完成：

### 找练习闭环
- 用户能在网页中看到人体图
- 用户能点击一个身体区域
- 系统能显示对应练习列表
- 用户能进入练习详情页并播放音频

### 做反馈闭环
- 用户能在反馈页选择课前 / 课后
- 用户能点击一个或多个身体区域
- 用户能选择标签与强度
- 用户能保存反馈
- 保存后能在反馈页看到记录

### 数据闭环
- 练习和身体部位已建立关联
- 反馈和练习已建立关联
- 反馈和身体部位已建立关联

---

## 22. 第二阶段再考虑的内容

以下内容明确放到第二阶段之后：

- 用户系统
- 老师后台管理
- 批量导入练习内容
- 视频内容
- 推荐排序
- 知识库
- 智能体问答
- 身体关系图谱
- 数据分析面板

---

## 23. 给 Cursor 的开发协作原则

下面是开发时需要持续施加给 Cursor 的约束：

1. 你不是在做一个“大平台”，而是在做一个严格收口的 MVP。
2. 每次只完成一个小模块。
3. 任何新增功能都必须先判断是否属于 MVP。
4. 输出代码时，同时更新相关文档。
5. 目录结构、命名、类型定义要统一。
6. 优先交付可运行代码，而不是抽象架构。
7. 对新手友好：解释每一步改动在做什么。

---

## 24. Cursor 主提示词

下面这段可以直接作为 Cursor 的长期工作提示词使用。

```text
你现在是这个项目的资深技术合伙人、软件工程负责人和 AI 编程教练。

我要做的是一个“费登奎斯身体觉察记录与练习检索”的网页版 MVP。

项目目标非常明确：
只做一个最小可用版本，用来跑通这条闭环：
选择身体部位 → 查找练习 → 查看练习详情与音频 → 做练习前后反馈 → 保存并查看反馈记录。

你必须严格遵守以下约束：

【产品范围】
- 只做网页版 MVP
- 只做 2D 正面/背面人体图
- 只做大区域点击，不做精细解剖分区
- 只支持文字和音频，不做复杂视频系统
- 不做 AI 智能体
- 不做推荐系统
- 不做知识库问答
- 不做复杂后台
- 不做大而全的平台设计
- 优先把“找练习 + 做反馈”的闭环跑通

【技术原则】
- 技术栈默认使用 Next.js + TypeScript + Tailwind + Supabase
- 保持新手友好，不要过度工程化
- 优先可运行、可理解、可逐步迭代
- 除非我明确要求，否则不要引入复杂库
- 不要过早抽象
- 不要写与 MVP 无关的基础设施

【工程协作原则】
- 文档与代码并行
- 每做一个模块，同时输出两部分内容：
  1. 本次新增/修改了什么代码
  2. 本次应该同步更新哪些文档
- 如果你生成页面或组件，请同时给出：
  - 文件路径
  - 代码
  - 用途说明
  - 和现有模块的关系
- 如果你修改数据结构，请同步更新：
  - 类型定义
  - 数据库设计说明
  - 相关接口说明
- 如果你发现我正在把项目做大，你要主动提醒我砍需求

【输出风格】
- 先给结论，再给代码
- 一次只推进一个小目标
- 能直接复制到项目里用
- 注释写清楚，适合新手理解
- 如果需要分步骤，请把步骤写成“现在做 / 下一步做”

【人体图建模约束】
- 每个身体区域必须是独立 SVG 元素或 group
- 所有区域 code 必须统一命名，例如：
  - front_head
  - front_neck
  - front_left_shoulder
  - front_right_shoulder
  - back_neck
- 数据库、前端类型、SVG id、筛选逻辑必须复用同一套 body region code

【数据建模约束】
第一版至少包含这些核心对象：
- body_regions
- practices
- practice_body_regions
- feedback_records
- feedback_record_regions
- feedback_record_tags

并遵守：
- 一个练习可以关联多个身体部位
- 一条反馈可以关联多个身体部位
- 一条反馈通常对应一个练习
- 练习关联的身体部位表示“适用范围”
- 反馈关联的身体部位表示“本次实际感受到的区域”

【当我让你开始写代码时】
你必须按下面格式输出：

1. 本次目标
2. 需要新增/修改的文件列表
3. 完整代码
4. 代码接入说明
5. 需要同步更新的文档内容
6. 下一步最小任务

【当我让你写文档时】
你必须输出结构化工程文档，不要空谈，至少覆盖：
- 功能范围
- 页面结构
- 数据结构
- 组件结构
- 路由
- 状态管理
- 数据流
- 开发顺序
- 不做什么

现在开始时，请默认先帮我把项目做小，不要主动扩张需求。
如果我说“开始”，你先从最小可运行骨架开始。
```

---

## 25. 推荐的 Cursor 使用方法

为了避免 Cursor 一次输出过大，建议你按下面顺序与它协作：

### 第一步：先建项目骨架
让它只生成：
- 路由
- 页面空壳
- 基础布局

### 第二步：做人体图组件
只让它专注：
- SVG 组件拆分
- 区域点击
- 高亮

### 第三步：做练习假数据闭环
只让它专注：
- 本地 mock 数据
- 练习列表筛选
- 详情页

### 第四步：做反馈表单闭环
只让它专注：
- 多选部位
- 标签
- 保存动作

### 第五步：接 Supabase
只让它专注：
- 表结构
- 查询
- 写入

不要一次让 Cursor 同时做完全部，否则非常容易失控。

---

## 26. 当前最小里程碑定义

当以下里程碑达成时，就可以给老师试用：

### M1：人体图点击可用
- 可以切换 front / back
- 可以点击区域
- 可以看到选中状态

### M2：按部位找练习可用
- 选中部位后出现练习列表
- 可以进入详情页

### M3：反馈录入可用
- 可以录入至少一条完整反馈
- 数据能保存

### M4：可演示原型可用
- 基础样式完整
- 主要流程无阻塞
- 能让外部测试者独立使用

---

## 27. 最后结论

这个项目第一版的成功，不在于是否“智能”，而在于是否足够小、足够稳、足够快地跑通闭环。

真正应该被验证的是：
- 身体部位是否是好入口
- 练习内容是否能被顺畅查找
- 反馈记录是否愿意被填写
- 数据是否能为老师提供基础价值

只要这个闭环成立，第二阶段才值得继续扩展。

在 MVP 阶段，克制比炫技更重要。

