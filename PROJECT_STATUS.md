# Reach Projector 项目状态

> 这是本项目的持续交接记录。每次继续开发、上传产品或上线前，先阅读并更新本文件。

## 当前权威版本

- 项目目录：`D:\文档\rc projector\reachprojector-visual-refresh-main`
- Git 分支：`codex/reach-visual-refresh-main`
- 远程分支：`origin/codex/reach-visual-refresh-main`
- 最近确认提交：`ea95d0d Complete global UI localization`
- 产品采集功能提交：`57a6371 Build reviewed product collection workflow`
- 状态记录提交：`c544fd8 Update Reach project status`
- 远程预览分支：以上提交已推送，Vercel 对 `c544fd8` 返回 `success`
- 核对日期：2026-08-20

不要把以下旧工作区当作最终网站版本：

- `reachprojector-web-main`
- `reachprojector-visual-refresh`

## 已完成

- 网站主体已使用 Taste 与 Impeccable 工作流完成视觉检查和微调。
- 已建立 `PRODUCT.md`、`DESIGN.md` 和首页 Impeccable 页面规范。
- 首页、产品列表、产品详情、场景方案、批发询盘、联系方式、结账、订单查询、订单成功页和政策页面已完成统一调整。
- 已完成英语、中文、西班牙语、俄语和阿拉伯语的主要公共页面本地化。
- TypeScript 类型检查通过。
- 网站已关联 Vercel 项目 `reachprojector-web`。
- 已完成产品采集审核 MVP：授权链接采集、字段级来源证据、缺失字段提示、产品事实审核、SEO/GEO 预览、预检和下架草稿入库。
- 产品采集不会自动填写图片、价格、库存、MOQ、保修、交期、运费、税费或地区可用性，也不会自动上架。
- SEO/GEO 草稿已包含事实摘要、适用对象、应用场景、限制说明、事实型 FAQ、来源链接和审核日期。
- `/admin/products/import` 已改为四步审核流程；Excel/CSV 批量导入继续保留为次要入口。

## 2026-08-20 产品采集后台验证

- TypeScript 类型检查：通过。
- 本次涉及文件 ESLint：通过，无错误或警告。
- Next.js 生产构建：通过。验证使用仅存在于构建进程内的占位环境变量，没有写入真实密钥。
- Vercel Preview 构建：通过（GitHub 提交状态 `Vercel: success`）。
- Impeccable 机械界面检测：已执行；发现的同一行嵌套样式误报已通过整理 JSX 消除。
- 浏览器可视检查：本机 Browser 插件因带空格的插件路径未通过其受信任路径检查，未能执行；没有使用其他浏览器脚本绕过。

## 产品状态

- 用户已确认：后台目前已有 1 个产品。
- 该线上产品的名称、链接、图片完整度、价格、库存、包装尺寸、运费模板和上架状态尚未在本记录中核实。
- 代码历史中存在首个已验证产品草稿：`XGIMI X50 Ultra Max`，文件为 `scripts/seed-draft-xgimi-x50-ultra-max.sql`。
- 在没有查看后台或线上产品页之前，不把代码草稿认定为当前已上架产品。

## 当前待处理

- 核对现有 1 个产品的实际名称、前台链接和上架状态。
- 修复 `src/lib/db-init.ts` 第 244、258 行的两个 ESLint `no-explicit-any` 错误。这两处属于数据库初始化代码，不是前台视觉页面错误。
- 在 Vercel 中确认 Supabase、后台认证、PayPal、Stripe 和 Webhook 的生产环境变量。
- 确认 PayPal 使用正式环境，而不是 Sandbox。
- 用现有产品完成一次上线前全流程测试：产品页、结账、运费、支付、订单写入、后台订单和询盘。
- 全流程通过后，再批量上传和发布其余产品。
- 使用真实后台账号测试一个已获授权的品牌官网产品链接，逐步确认采集、审核、预检和草稿入库。
- 动态渲染或阻止普通 HTTP 访问的网站仍需独立 Crawlee Worker；该 Worker 不应部署在 Vercel 请求进程中。当前 MVP 优先支持可直接读取 HTML 或 Product JSON-LD 的品牌官网。

## 上线判定

满足以下条件后，才能把状态改为“可正式上线”：

- 生产构建成功。
- Vercel 生产环境变量完整。
- 正式支付与 Webhook 验证通过。
- 现有产品的价格、库存、重量、包装尺寸和运费正确。
- 产品购买与询盘流程实测通过。
- 域名、SEO、robots.txt 和 sitemap 在生产环境检查通过。

## 更新规则

每次完成工作后，在本文件中同步更新：

- 修改日期和对应 Git 提交。
- 新增或更新的产品及其状态。
- 已通过的测试。
- 新发现的问题和剩余事项。
- 当前是否达到上线条件。

未经核实的信息必须标记为“待核对”，不能写成已完成。
