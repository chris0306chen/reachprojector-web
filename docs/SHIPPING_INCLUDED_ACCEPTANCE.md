# PR #76 迁移与联调准备（2026-11-05）

PR 保持未合并。用户报告已在 Supabase 执行迁移并收到 Success / No rows returned；代理未执行生产写入、真实支付或邮件。

## 迁移后验收进度

- 应用回归再次通过：14 个运费测试及 21 个履约测试。
- `tests/shipping-included-payment.test.ts` 新增 3 个支付请求格式测试通过：Stripe 零运费行及税费说明、PayPal 商品总额和零运费拆分、人工报价阻断。网络请求全部模拟，未连接真实 sandbox，不等同于渠道端到端验收。
- `scripts/verify-shipping-included-readonly.sql` 可在已迁移项目中只读核对字段、默认值、已验证约束定义及现有模板值。
- 当前工作区只有 `.env.example`，没有独立测试数据库或支付 sandbox 凭据。线上只读结构核验已通过浏览器完成；真实 sandbox 联调仍需要现有测试配置路径，不要在聊天中粘贴密钥。
- “已有费率和启用状态未变”需要与迁移前导出/备份比较。脚本本身没有数据更新语句，但单独的迁移后快照无法证明历史值相等。
- 暂不建议合并：历史值对比以及真实 sandbox 创建/回调/订单持久化链路尚未完成。PR #70 不操作。

## 2026-11-05 在线只读核验

通过用户指定的 Supabase RC projector 项目（ufzzynacrknnmmyczmzl）SQL Editor，执行 BEGIN READ ONLY 包裹的查询并读取实际结果：

- orders.shipping_method：text，可为空。
- shipping_templates.product_ids：uuid[]，NOT NULL，默认 '{}'::uuid[]。
- shipping_templates.is_active：boolean，NOT NULL，默认 false。
- shipping_included_explicit_scope：convalidated=true；定义要求 SHIPPING_INCLUDED 指定非空产品范围、两位大写国家代码及三项非空零费用，符合迁移脚本。
- 模板总数 452，启用 416；SHIPPING_INCLUDED 总数 0、启用 0。

查询页面：https://supabase.com/dashboard/project/ufzzynacrknnmmyczmzl/sql/bb4a2bc9-ac01-40c6-b31f-c01380d8045c

本次仅查询，没有修改数据库。结构核验通过；以上计数不能证明历史费率未变。PR #76 当前 head 1deb210 的 Vercel 检查成功、状态 OPEN / MERGEABLE，未合并。

## 迁移检查结论

`migration-shipping-included.sql` 仅执行 DDL：

- 添加 `product_ids UUID[] NOT NULL DEFAULT '{}'`，已有模板获得空范围。
- 将订单 `shipping_method` 扩为 TEXT，保留现有值。
- 添加仅约束 SHIPPING_INCLUDED 的检查：明确产品范围、国家代码、三项费用必须为零。

没有 INSERT / UPDATE / DELETE，没有修改费率、国家、有效期、`is_active` 或其默认值，不会创建或激活免费模板。注意：应用部署后，用户已批准的 Hisense 非 VIDDA / AWOL 品牌规则会在既有可配送线路内自动生效；这与是否启用新免费模板是两回事。

脚本不是可随意重复执行的初始化脚本：同名约束再次创建会报错。执行前检查 `product_ids` 字段及 `shipping_included_explicit_scope` 约束是否已存在；若存在，先核实定义，不要盲目重跑。若已存在不合规 SHIPPING_INCLUDED 数据，约束添加会失败；不得擅自清理或改价。

部署时在数据库事务中执行迁移，设置合理锁等待上限，发生错误则整体回滚。ALTER TABLE 需要数据库锁，应选择低流量窗口。先备份结构与模板数据；禁止将订单说明字段直接缩回 VARCHAR，以免新说明被截断。

## 已准备、待执行的数据库验证

`tests/shipping-included-migration.sql` 只能在空的一次性测试库运行。将迁移复制到容器 `/tmp/migration-shipping-included.sql` 后，用 `psql -v ON_ERROR_STOP=1 -f /tmp/check.sql` 执行测试文件。

测试检查：已有 DDP/DAP/人工报价行逐字段不变、默认产品范围为空、原订单值不变、空范围和非零免运费被拒绝、新模板默认停用、长订单说明可保存。

2026-11-05 用户启动 Docker Desktop 后，Docker 29.7.2 引擎可用。在独立 postgres:16-alpine 容器 reach-shipping-migration-check 的 shipping_acceptance 数据库执行上述脚本，psql ON_ERROR_STOP=1 返回成功：原费率/启用状态及订单值保留、空产品范围和非零包邮费用被拒绝、新模板默认停用、150 字符订单说明可保存。无生产数据库连接。

同日运行 pnpm test:fulfillment:isolated，独立 PostgreSQL/PostgREST 的 6/6 验收组通过（未付款阻断、全款发货、退款竞态、并发及顺序重复、终态保护）；邮件仅内存计数。测试容器已停止。以上不替代 Stripe/PayPal sandbox 联调，也不证明生产历史费率未变。

## 测试环境联调矩阵

### Stripe 实际 sandbox 创建会话核验（2026-11-05）

用户授权后，现有 sk_test 密钥仅保存在被 Git 忽略的 `.env.test.local`。执行 `node scripts/verify-stripe-shipping-sandbox.cjs --run-sandbox`，固定校验账户 acct_1TvUACKLpy9D25tu。实际创建路由源码调用 Stripe API，商品和运费查询使用合成 fixture，不导入数据库或邮件模块。

结果 PASS：livemode=false、USD 总额 20000 分、包邮行金额 0、metadata.shipping_cost=0.00，Stripe 返回的行描述包含完整运费已含与税费不保证包含说明。测试 session cs_test_b1GgfS9LHzRM84pEikBJQOuAsCxF5ddeqVfQq2TtkfMd2pLb89iSfgV8ZX 已主动 expire，未尝试付款。此结果仅证明真实渠道接受创建请求，不代表真实目录报价、付款完成、签名回调或订单持久化已验收。沙盒控制台当前未配置接收端。

1. 使用独立数据库、Stripe test / PayPal sandbox 配置和合成订单；邮件模块替换为内存捕获，收件人和 BCC 均不得外发。确认隔离后才执行支付操作。
2. 执行迁移并对比模板数量、费率、国家、有效期、启用状态；全部应保持原值。
3. Hisense 非 VIDDA、AWOL：有有效线路、包装完整时运费为零；显示 Shipping included in product price，税费另行确认。
4. 品牌、名称、型号、规格系列出现 VIDDA：即使显式勾选免费模板，仍使用原 DDP/DAP/人工报价。其他品牌同样保留原规则。
5. 未覆盖国家、人工报价产品、过期线路、超重或缺尺寸：不得因品牌或零费模板自动放行。
6. 后台保存停用模板并重新读取，核对产品范围/国家/零费用；启用后仅在既有可配送范围内细化服务，不得新建配送覆盖。
7. 两个支付渠道分别验证商品金额 + 0 运费，币种一致；回调保存订单零费用和完整税费说明，管理端与订单详情读取一致。所有通知只捕获不投递。
8. 在包含已合并 PR #74 的测试构建中验证结账文案，保留其品牌身份/导航调整，不引回旧公司信息。

## 合并条件

静态迁移检查、线上只读结构核验和隔离数据库脚本实测已完成；支付 sandbox 联调和最终目标分支构建仍待执行。PR #76 保持未合并，不自动部署生产环境。
