# AGENTS.md — REACH PROJECTOR

## 项目概览

REACH PROJECTOR 外贸独立站，主营投影仪、打印机、电脑配件等电子产品。Next.js 16 (App Router) + Supabase + Tailwind CSS 4 + shadcn/ui。

## 技术栈

- **Framework**: Next.js 16 (App Router)
- **Core**: React 19
- **Language**: TypeScript 5
- **UI**: shadcn/ui + Tailwind CSS 4
- **Database**: Supabase (PostgreSQL)
- **Package Manager**: pnpm

## 目录结构

```
src/
├── app/
│   ├── page.tsx                    # 首页
│   ├── layout.tsx                  # 全局布局 (Header + Footer + WhatsApp)
│   ├── globals.css                 # 全局样式 + 品牌色
│   ├── sitemap.ts                  # SEO 站点地图
│   ├── robots.ts                   # SEO robots.txt
│   ├── not-found.tsx               # 404 页面
│   ├── products/
│   │   ├── page.tsx                # 产品列表页 (SSR)
│   │   ├── products-client.tsx     # 产品列表客户端组件 (排序/分页)
│   │   └── [slug]/
│   │       ├── page.tsx            # 产品详情页 (SSR + JSON-LD)
│   │       └── product-detail-client.tsx  # 产品详情客户端组件 (含 PayPal)
│   ├── about/page.tsx              # 关于我们
│   ├── contact/
│   │   ├── page.tsx                # 联系我们
│   │   └── contact-form.tsx        # 询盘表单客户端组件
│   ├── order-success/page.tsx      # 支付成功页面
│   └── api/
│       ├── inquiries/route.ts      # 询盘提交 API
│       └── paypal/
│           ├── create-order/route.ts   # PayPal 创建订单 API
│           └── capture-order/route.ts  # PayPal 捕获支付 API
├── components/
│   ├── layout/
│   │   ├── header.tsx              # 导航栏 (响应式 + 下拉菜单)
│   │   ├── footer.tsx              # 页脚
│   │   └── whatsapp-button.tsx     # WhatsApp 浮动按钮
│   ├── product-card.tsx            # 产品卡片组件
│   └── paypal-checkout.tsx         # PayPal 支付组件
├── lib/
│   ├── utils.ts                    # 工具函数 (cn)
│   └── data-service.ts             # Supabase CRUD 服务层 (含订单)
├── storage/database/
│   ├── shared/schema.ts            # Drizzle 表定义
│   └── supabase-client.ts          # Supabase 客户端
└── scripts/
    └── seed.ts                     # 数据库种子数据脚本
```

## 数据库表

- `categories` — 产品分类 (Projectors, Printers, Components)
- `products` — 产品数据 (31 个种子产品)
- `inquiries` — 客户询盘
- `orders` — PayPal 订单记录 (order_id, product_id, amount, currency, payer_email, status)

## 环境变量

- `PAYPAL_CLIENT_ID` — PayPal Sandbox Client ID
- `PAYPAL_SECRET` — PayPal Sandbox Secret
- `PAYPAL_BASE_URL` — PayPal API 基础地址 (sandbox: https://api-m.sandbox.paypal.com)
- `NEXT_PUBLIC_PAYPAL_CLIENT_ID` — 前端 PayPal Client ID (同 PAYPAL_CLIENT_ID)

## 常用命令

```bash
pnpm run dev          # 启动开发服务器
pnpm run build        # 构建生产版本
pnpm run start        # 启动生产服务器
pnpm ts-check         # TypeScript 类型检查
pnpm lint             # ESLint 检查
npx tsx src/scripts/seed.ts  # 重新导入种子数据
```

## 开发规范

- 使用 pnpm，禁止 npm/yarn
- 字段名使用 snake_case（Supabase 规范）
- 所有 Supabase 调用必须检查 `{ data, error }` 并 throw
- 客户端动态数据必须用 'use client' + useEffect + useState
- 品牌色：深蓝 #0F172A + 橙色 #F97316 + 白色
