# PR #76 迁移与联调验收（更新至 2026-11-06）

PR 保持未合并。用户报告已在 Supabase 执行迁移并收到 Success / No rows returned；代理未执行生产写入、真实支付或邮件。

## 迁移后验收进度

- 应用回归再次通过：14 个运费测试及 21 个履约测试。
- `tests/shipping-included-payment.test.ts` 新增 3 个支付请求格式测试通过：Stripe 零运费行及税费说明、PayPal 商品总额和零运费拆分、人工报价阻断。网络请求全部模拟，未连接真实 sandbox，不等同于渠道端到端验收。
- `scripts/verify-shipping-included-readonly.sql` 可在已迁移项目中只读核对字段、默认值、已验证约束定义及现有模板值。
- 已配置被 Git 忽略的 `.env.test.local` 和独立本地 PostgreSQL。PayPal 实际 sandbox capture、Stripe 实际 sandbox 付款/签名回调、订单持久化、库存扣减及顺序重复幂等已通过；两渠道的目录和报价使用 fixture，邮件只在内存捕获。详见下方实测记录。
- “已有费率和启用状态未变”需要与迁移前导出/备份比较。脚本本身没有数据更新语句，但单独的迁移后快照无法证明历史值相等。
- 与 main 89bd9f1 合并后的本地编译、TypeScript 和 30 项回归测试通过。剩余：最新 Vercel 检查、实际商品/报价及前台和后台完整页面联调、迁移前历史费率基线对比。PayPal C2 买家缺少 shipping 的案例仍未解释，保持地址校验拦截。PR #76 保持未合并；PR #70 不操作。

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

### PayPal 实际 sandbox 付款与库存核验（2026-11-06）

2026-11-06，旧订单 9XK37532E9206682H 的 GET 返回 404 / RESOURCE_NOT_FOUND / INVALID_RESOURCE_ID。重新通过实际创建路由生成订单 80080979AA534602P，US 测试买家批准后 GET 返回 APPROVED，收货国家及付款人国家均为 US。

执行 `node scripts/verify-paypal-capture-sandbox.cjs capture 80080979AA534602P` 返回 PASS：真实 PayPal sandbox capture 成功，本地原始库存事务保存 payment_status=paid、status=preparing、shipping_cost=0.00 和完整运费/税费说明；库存由 10 减为 8。重复请求返回 idempotent，订单总数保持 1、库存保持 8、通知内存计数为 1，无真实邮件。商品与报价仍为 fixture，数据库为固定本地独立测试库；不代表生产目录报价或 Stripe 付款已验收。create 操作不再依赖本地数据库启动，setup/capture 仍检查固定测试数据库。

以下为此前创建阶段及阻断记录，现有 US 付款通过结果取代此前“完整付款尚未通过”的结论；C2 缺少 shipping 的原因仍未确定。

完整 capture 验收准备：`scripts/verify-paypal-capture-sandbox.cjs` 使用固定本地 127.0.0.1:55477/payment_sandbox，执行实际 data-service 源码及原始 create_paid_order_and_decrement_inventory SQL；目录与报价仍为 fixture，邮件为内存计数。独立容器 reach-payment-sandbox-db 已初始化，库存初值 10。setup 只允许空库，create 创建测试订单，capture 接收订单 ID；成功后应验证库存 8、仅一单、重复 capture 幂等和一次通知。

C2 测试买家批准订单 74V48148GY715104D 后，GET 返回 APPROVED，但 purchase_units[0] 没有 shipping；应用 capture 返回 409，未请求扣款。原因尚未确定，未放松国家或地址校验。已创建 US Personal 测试买家 sb-9axuj53707879@personal.example.com，新的 US 测试订单 9XK37532E9206682H 已创建；浏览器连接在读取买家详情时超时，尚未批准。真实 capture、库存和完整付款链路仍未通过，不得将此准备工作视为验收成功。

用户授权将 Default Application 的 Sandbox Client ID/Secret 保存在被 Git 忽略的 `.env.test.local`，API 固定为 https://api-m.sandbox.paypal.com。执行 `node scripts/verify-paypal-shipping-sandbox.cjs --run-sandbox`，实际创建路由源码使用合成商品/报价 fixture 调用真实 sandbox，并 GET 读取订单核验。

结果 PASS：订单 03426233HJ7618035，状态 CREATED，USD 200.00，shipping=0.00，完整运费已含和税费另行确认说明。未进行买家批准或 capture；未导入数据库/邮件模块。沙盒应用当前无 webhook。此结果不等同于完整付款、订单/库存事务或 webhook 验收。

### Stripe 实际 sandbox 创建会话核验（2026-11-05）

补充执行 `pnpm exec tsx --test --test-concurrency=1 tests/fulfillment-isolated/shipping-included-webhook.test.ts`：3/3 通过。实际 webhook 路由与签名校验处理合成签名事件，通过测试数据服务适配器保存到连接内临时 PostgreSQL 表。验证零运费、完整说明、订单金额/状态/地址、顺序重复仅一单一次通知；无效/过期签名及未付款、金额/币种/国家不匹配不建单。邮件完全替换为内存计数。此测试未调用生产 createPaidOrder 库存事务、真实目录/报价服务，也不是 Stripe 真实事件投递或完整端到端付款验收。

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

2026-11-06 正式站后台只读诊断：用户提供 www.reachprojector.com/admin/products 登录标签页后，打开两款编辑窗口读取并取消，未保存。PX4 Pro 包装 66×48×31 cm、毛重 13 kg、parcel、1 包裹；AWOL Aetherion Pro 包装 74×32×57 cm、毛重 13.6 kg、parcel、1 包裹。两者均勾选“强制人工确认运费”，对应 shipping_quote_required，按现有报价规则直接返回 PRODUCT_REQUIRES_QUOTE，与预览站询价表现一致。取消人工确认属于商品销售策略变化，尚未执行；取消后仍需验证有效线路。PX4 普通 weight 字段另显示 -0.03 kg，包装毛重为独立字段，未擅自改值。

2026-11-06 实际预览站检查：f4b0398 的 Vercel 检查 SUCCESS。通过现有 GitHub 登录进入受保护预览，商品列表加载 7 个实际商品。Hisense PX4 Pro（c5ee3fe7-8308-40a8-ab04-b1bb5d83a9d1，USD 3199）及 AWOL Vision Aetherion Pro（70bf6e4a-c53f-4390-8ea8-23bb4db81046，USD 2100）进入结账、选择 United States 后均显示 Online shipping is unavailable. Please request a quote. 尚未验证实际商品可自动包邮；不能将 fixture 付款通过替代此项。具体为包装数据、人工报价开关、线路条件或接口异常尚待后台检查，未改动商品或费率。预览 admin/products 重定向 admin/login，等待用户登录。前台商品页仍使用通用 DDP/DAP 说明；未发起生产付款。

2026-11-06，在独立 detached worktree 将 9fa80a1 与 origin/main 89bd9f1（PR #74 公司身份与首页更新）执行无提交合并，无冲突。使用 localhost 占位 Supabase 配置执行 `node node_modules/next/dist/bin/next build`，编译、TypeScript 和 241 页生成通过；商品读取因占位数据库不可达产生警告，不代表目录数据加载验收。合并结果上的 shipping-included/shipping-quote/order-status/order-routes 共 30 项测试通过。pnpm 11 的依赖脚本批准检查导致快捷构建命令未启动，直接执行已安装的 Next CLI 完成构建，未修改依赖批准策略。

Stripe 完整付款准备：`scripts/verify-stripe-payment-sandbox.cjs` 使用官方 Stripe CLI 1.55.8（下载校验和匹配）转发实际 sandbox 事件到 127.0.0.1:55478；签名密钥仅在内存中。使用原 webhook/data-service 源码及原库存 RPC，仅处理本脚本会话，商品/报价为 fixture，邮件为内存计数，独立测试商品库存初值 10。已创建实际测试会话并显示正确金额及运费说明，尚待买家付款和回调结果；准备工作不算通过。

2026-11-06 Stripe 实际付款回调验收 PASS，取代上段待付款状态：会话 cs_test_b1yr4yeRmSRpaY99Y92e0vheZPfFKDzeh2B6wf9hrSEmpDHyDdNbOOQ1n3；真实 sandbox 事件 evt_1UYhEUKLpy9D25tuEX6FNXPg 经官方 CLI 转发并通过应用签名验证。Stripe API 再查 payment_status=paid；本地订单仅一条、运费 0.00、完整税费说明保留、库存由 10 减至 8、通知内存计数 1。相同签名事件再次调用实际 webhook 返回 200，未重复建单或扣库存。脚本返回 PASS 后正常退出（exit 0）并关闭本地监听，因此买家稍后跳转到 127.0.0.1 出现连接拒绝；这不代表付款失败。未发送真实邮件或修改生产数据库。

静态迁移检查、线上只读结构核验、隔离数据库脚本、PayPal sandbox capture、Stripe 实际付款签名回调及目标分支编译已完成。商品目录/报价使用 fixture、前台及管理端完整真实数据浏览流程不在本次支付脚本验收范围内，不能称为生产全链路验收。PR #76 保持未合并，不自动部署生产环境。

### 2026-11-09 后台取消人工报价保存修复

用户确认两款商品原意为免运费，人工报价勾选仅用于绕过保存失败，因此授权取消该开关。此前“尚未授权”的状态由此更新；商品实际保存仍待完成。

修复提交 3ad9a8a：后台编辑仅提交改动字段，取消 shipping_quote_required 时旧接口仅校验请求中的包装字段，误将未修改的已有包装判为缺失。接口现在先读取已保存包装，与提交字段合并后校验，显式清空、缺包装、非 parcel 和多包裹仍拒绝，不改写未提交字段。

新增回归测试先复现两项失败，修复后 3/3 通过；相关运费测试合计 17/17 通过，TypeScript 和目标 ESLint 通过。该提交的 Vercel 检查 SUCCESS。在独立验收 worktree 的主分支合并结果中应用此修复，Next 构建、TypeScript 和 241 页生成通过；本地占位数据库不可达的商品读取警告不代表真实目录验收。

预览后台登录过期，已打开登录入口请用户重新登录。随后浏览器连接中断，尚未保存 PX4 Pro / Aetherion Pro 的开关，尚未验证两款实际目录的零运费。PR #76 保持未合并，PR #70 未改动。

### 2026-11-10 实际商品保存与美国结账复核

通过已登录预览后台，分别取消 PX4 Pro 和 AWOL Aetherion Pro 的“强制人工确认运费”，保存返回产品列表；重新打开两款编辑表单确认开关关闭。未修改价格、包装或运费线路。

实际 PX4 Pro 美国结账显示 Shipping included in product price: $0.00，并显示 Import duties and taxes are not guaranteed included; confirm separately. 总额 USD 3199。AWOL 美国结账仍显示 Online shipping is unavailable. Please request a quote.

后台线路只读核对：美国小货为 0.5–20 kg；美国大货为 25–300 kg、续重单位 1 kg、体积除数 6000，已启用，有效期 2026-07-27 至 2027-01-01。AWOL 包装 74×32×57 cm、毛重 13.6 kg，按大货体积重 22.496 kg 进位为 23 kg，未达到 25 kg 门槛。现有数据不足以自动报价，未扩大覆盖、改费率或降低重量门槛。线路编辑窗口只读后取消。

重新运行 product-shipping-update、shipping-included、shipping-quote 测试 17/17 通过，包括 VIDDA 排除和含运费不等于含税。尝试通过现有本地生产配置做数据库只读核验时，项目域名保护检查不匹配，在网络查询前中止；上述线上数据证据来自后台 UI，不能冒称直接数据库查询成功。需要物流确认该 AWOL 包装是否可按 25 kg 起算，或提供覆盖该重量的有效美国线路，才可完成 AWOL 自动包邮。PR #76 未合并。
