# 最小询盘管线

范围：状态、负责人、下次跟进时间、内部备注、来源。沿用现有后台和员工账号；不接入 Twenty，不增加客户消息发送，不调整公开表单必填规则。没有自动轮转、到期邮件、报价历史或转交历史。

## 已完成 / 正在做 / 等待用户 / 下一步

- 已完成：字段、迁移、API 权限、后台 UI；11 项接口/逻辑测试、1 项实际 PostgreSQL-WASM 迁移测试、4 项桌面/手机浏览器测试通过；TypeScript 和改动文件 ESLint 通过。
- 正在做：进入 PR 审阅与发布准备，本轮不合并或部署。
- 等待用户：在目标 Supabase 项目执行下述迁移；确认六位业务员的真实账号和主管账号。不会自动创建人员。
- 下一步：迁移后按验收步骤验证，再决定是否合并和发布。

## 权限与使用

- `admin` 为主管，可查看全部询盘、分配和清空负责人。
- 启用且具有 `inquiries` 或 `all` 权限的 `staff` 只能读取和更新 `assigned_to` 等于本人 ID 的询盘；不能改负责人。主管在现有用户管理中配置真实员工账号。
- 每次请求重新读取账号启用状态和权限，不沿用 JWT 中已过时的权限。旧 `/api/rfq` 读写接口使用相同限制；旧更新客户端必须携带 `expected_version`。
- 未分配线索仅主管可见。负责人保存账号 ID；已有姓名形式的归属保留并标为待核对，由主管手动映射。
- 六阶段：待处理、已联系、已报价、谈判中、已成交、已失单。旧 `new` 状态仍作为待处理显示。
- 来源使用 `channel`（网站、邮件、WhatsApp、人工录入）；原始 `inquiry_type` 仍展示，方便区分 RFQ、Wholesale、普通询盘等入口。
- 跟进时间数据库存 UTC，页面统一按北京时间显示和编辑；允许清空。内部备注为空字符串时可清空。
- 保存以 `workflow_version` 作原子条件。记录被他人更新或转交后，旧请求返回 409，不覆盖新值；页面保留未保存输入，需刷新后重新核对。
- 内部备注是当前文本，本期不包含历史版本。权限和浏览器验证使用测试替身；未读取或修改真实客户记录，未发送真实邮件。

## 数据库迁移：用户执行

在部署此 PR 的页面/API **之前** 执行，建议先在测试项目演练。

1. 在目标 Supabase 控制台确认项目名称并备份 `public.inquiries`。确认部署环境已有 `SUPABASE_URL`、`SUPABASE_KEY` 和仅服务器可用的 `SUPABASE_SERVICE_ROLE_KEY`，不要将 service role key 放进前端环境变量。
2. 在 SQL Editor 执行仓库的 `scripts/migration-rfq-workflow.sql`（已有基础询盘结构也可重复执行）。确认 `public.users` 已存在且是现有员工表。
3. 执行 `scripts/migration-inquiry-pipeline.sql`。它新增跟进时间和版本等缺失列、索引，并撤销 `anon`/`authenticated` 对询盘表的直接访问；网站提交及后台访问仍通过服务器 service role。此权限变更依赖现有网站的服务器写入方式，不能用于仍直接从浏览器操作询盘表的其他客户端。
4. 检查脚本最后返回的旧负责人字符串。保留原值，不批量猜测；部署后由主管将其映射到有效员工。
5. 确认列 `assigned_to`、`reply`、`channel`、`next_follow_up_at`、`workflow_version` 存在，再部署 PR。迁移不要求清表，不主动重分配客户，可重复运行。

验收：用受控测试询盘验证主管可分配给业务员 A；A 能读写，B 列表不可见且直接 PUT 无法更新；停用 A 后访问被拒绝。分别验证 RFQ 和普通 Wholesale 留言可见、来源保存、备注和日期可清空。打开两份同一询盘，先保存一份，另一份应提示冲突。公开表单测试可能触发原有管理员通知，应仅使用受控地址。

如需回退应用，先停用新页面；保留新增列和现有数据。不要回退到未做归属校验的旧后台对业务员开放，也不要为回退恢复匿名询盘表访问。

## 本地测试

```powershell
node --test tests/inquiry-pipeline.test.cjs
pnpm exec tsc --noEmit
pnpm exec eslint src/app/admin/inquiries/page.tsx src/components/admin/inquiry-pipeline-editor.tsx src/app/api/admin/inquiries src/app/api/rfq src/lib/inquiry-access.ts src/lib/inquiry-pipeline.ts tests/e2e/inquiry-pipeline.spec.ts
```

浏览器测试只在本地运行，所有询盘接口被拦截，不操作生产记录。一个终端启动：

```powershell
$env:JWT_SECRET='local-inquiry-regression-test-secret-only-2026'
pnpm exec next dev --hostname 127.0.0.1 --port 3114
```

另一个终端执行：

```powershell
$env:SITE_URL='http://127.0.0.1:3114'
pnpm exec playwright test tests/e2e/inquiry-pipeline.spec.ts --output=test-results/inquiry-pipeline
```

可选 SQL 集成测试使用本地安装的 `@electric-sql/pglite`，不作为应用运行依赖：将 `PGLITE_MODULE` 设为该模块的绝对路径后，执行 `node --test tests/inquiry-migration.test.cjs`。未设置时测试明确跳过。覆盖迁移重复执行、历史数据保留、匿名访问拒绝及 service role 访问。
