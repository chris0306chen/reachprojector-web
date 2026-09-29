# Reach Projector editorial workflow

Updated: 2026-09-29. Owner: Reach Projector. Working language: English; operational notes: Chinese.

## 发布授权与当前状态（2026-09-29）

用户已明确要求按计划发布，取代下文历史阶段的“不发布、不合并”限制。首篇距离指南已从独立草稿集合迁入公开 buyingGuides，进入指南列表、路由查找和 sitemap。发布日期设为 2026-09-29，B2B 项目采购保留同一联系入口。其余三篇研究稿仍按日历准备发布。

已完成：首篇发布接入、计算复核及公开查找检查。
正在做：PR 更新、部署与线上检查。
等待用户：无；具体型号或真实案例仍需证据才能加入。
下一步：2026-10-02 B2B 样机验收稿，发布前核对来源、接入数据并检查页面。

以下为草稿阶段历史记录；当前发布状态以本节为准。验证脚本现为 scripts/check-editorial-guide.ts。
## 独占工作区与迁移范围

本阶段仅在 `reachprojector-editorial-next` / `agent/editorial-next` 工作。从旧共享目录选择性复制本任务的 3 个规划文件和 4 篇草稿，未迁移询盘、订单、运费代码，也未修改旧目录。

优先指南已适配 `src/lib/guides.ts` 的 `BuyingGuide` 类型，存放在 `draftBuyingGuides`。公开列表、`getBuyingGuide`、静态参数和 sitemap 仍只读取 `buyingGuides`，因此本稿没有公开路由。此阶段不创建线上预览、不发布、不合并。审核后发布需要另行明确操作。

## 已完成

- 本地盘点：`src/lib/guides.ts` 有 7 篇指南；指南页面有 Article / BreadcrumbList；sitemap 收录英文指南。此结论是本地代码检查，不代表线上收录状态。
- 建立 6 个主题集群、24 个关键词/问题、四周 8 个内容审核档期。
- 完成四篇英文稿和证据记录：100 英寸投影距离、B2B 样机验收、亮度规格解读、B2B 总拥有成本。文件位于 `drafts/001-004` 对应 Markdown 文件；尺寸、距离及能耗示例已复算。
- 用户已确认家庭消费者与 B2B 两条线并行；后续稿件保持待审核状态。
- 优先距离指南已缩减重复 FAQ、强化三米房间的实际决策示例，接入现有数据结构，并通过同一联系入口保留多房间项目采购路径。BenQ / Epson 两个网页来源已于 2026-09-28 重新访问。

## 正在做

- 四篇稿件保持待审核；优先稿的结构化版本进入 PR 审查，尚未发布。

## 检查记录（2026-09-29）

- `pnpm ts-check`：通过。
- `pnpm exec eslint src/lib/guides.ts scripts/check-editorial-drafts.ts`：通过。
- `pnpm exec tsx scripts/check-editorial-drafts.ts`：通过，覆盖草稿公开查找隔离、唯一 slug、B2B 入口及距离示例计算。
- 已检查 guides 页面、静态参数与 sitemap 仅使用公开集合；本阶段没有新增页面渲染逻辑，未执行生产部署或线上页面测试。

## 等待用户

- 四篇稿件审核（不阻塞后续通用稿件准备）；产品举例需要准确型号、区域版本和对应官方资料。
- 可选：重点国家、主推品类、匿名客户问题及 Search Console 数据。这些信息影响优先级，不阻塞通用指南写作。

## 下一步

1. 下一轮准备亮客厅选型稿与 B2B RFQ 更新稿；区域版本的型号、应用和售后细节待具体资料后补充。
2. 审核首稿的结构化版本；距离表已适配为 checklist，来源保留于 sources，未扩展页面渲染器。Markdown 为研究底稿，实际待发布文字以 draftBuyingGuides 为准。
3. 发布时验证页面、canonical、可见内容与 JSON-LD、sitemap、内链；记录实际发布日期及 URL。

## Scope and editorial rules

The default audience is international English-speaking home buyers and business procurement teams. Geography is not inferred from language. Two review slots per week are a planning assumption, not a scheduled publishing automation.

Buying Guides answer evergreen decisions. Blog is reserved for sourced news, anonymized real questions and documented project stories. No Blog route was found in this worktree; do not invent live blog URLs. Place evergreen drafts in the existing guide workflow first.

Use a direct answer, decision criteria, explicit assumptions, practical examples, primary-source links and an appropriate next step. Distinguish manufacturer claims, independently calculated examples and actual measured results. Do not invent tests, customer stories, search volume, certifications, warranties, stock or delivery promises. Reddit supplies question ideas, not product evidence or permission to copy text.

## Research and approval pipeline

Idea → source check → English draft → factual/commercial review → approved → implementation → page QA → publication → measurement → refresh.

Every draft records its query, intent, audience, proposed URL, title, description, evidence, uncertainty, internal links and review state. Technical claims require primary documentation. Commercial claims require current Reach policy or written confirmation. Keep one primary URL per intent; update an existing guide where possible.

Google's guidance calls for crawlable, useful text and structured data consistent with visible content; it does not require a special AI schema. This is the basis for the GEO workflow, not a guarantee of Google, Gemini or ChatGPT citations. Source: [Google Search Central](https://developers.google.com/search/docs/appearance/ai-features), checked 2026-09-24. Product-specific AI visibility claims are outside this plan.

At publication record actual dates, reviewer, live URL and source check date. Preserve original publication date on revisions: the current template uses `updatedAt` for both datePublished and dateModified, which should be addressed during publishing integration. Translate only after English approval and review regional claims separately; do not advertise untranslated pages as localized content.

## Measurement

Baseline currently unavailable. At 14 and 28 days after each actual publication, inspect indexing, impressions, queries, clicks and qualified inquiries where analytics access exists. Compare equal windows and record limitations. Manually sampled AI mentions are observations tied to date, prompt and platform, not a universal ranking. Prioritize useful query coverage and qualified inquiries over article count. Refresh when specifications or policies change; review evergreen drafts quarterly.
