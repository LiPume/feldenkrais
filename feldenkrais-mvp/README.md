# 费登奎斯身体觉察 MVP

最小可用网页版原型，跑通：选择身体部位 → 查找练习 → 查看详情与音频 → 做反馈 → 保存查看记录。

## 快速启动

```bash
cd feldenkrais-mvp
npm install
npm run dev
```

然后打开 http://localhost:3000

## 页面路由

| 路由 | 说明 |
|------|------|
| `/` | 首页，两个入口按钮 |
| `/practice-search` | 找练习（人体图 + 练习列表） |
| `/practices/[slug]` | 练习详情（文字 + 音频） |
| `/feedback` | 反馈记录列表 |
| `/feedback/new` | 新建反馈表单 |

## 技术栈

- Next.js (App Router) + TypeScript
- Tailwind CSS
- 未来接入 Supabase

## 开发阶段

- [x] 第 1 步：项目骨架 + 5 个页面空壳
- [ ] 第 2 步：人体图组件
- [ ] 第 3 步：找练习闭环（mock 数据）
- [ ] 第 4 步：反馈闭环（mock 保存）
- [ ] 第 5 步：接入 Supabase
- [ ] 第 6 步：打磨可用性

## 文档

详细设计文档见 `../docs/describe.md`
