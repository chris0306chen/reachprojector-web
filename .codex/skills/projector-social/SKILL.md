---
name: projector-social
description: Research overseas projector audiences and turn evidence into reviewable social content and performance learnings. Use for social insights, Reddit research, weekly topics, content packages, or social performance reviews; exclude mainland-China social platforms.
---

# Projector Social

Support Reach Projector's overseas social operations without publishing or interacting with live accounts by default.

## Select the mode

- **Insight:** collect recent public discussions and extract audience language, objections, questions, and content opportunities.
- **Content:** convert approved insights into platform-native drafts.
- **Review:** analyze the user's exported performance data and recommend what to continue, change, or stop.

If the request would log in, publish, comment, message, follow, spend money, or modify a live account, stop before that action and request explicit authorization. A request to research or draft does not authorize publishing.

## Audience and channel scope

Work only with overseas channels. Treat Reddit, AVS Forum (`avsforum.com`), and YouTube as core evidence sources; use TikTok and Instagram for B2C creative direction, X for timely discussion, and LinkedIn only for OEM, wholesale, education, hospitality, or other B2B topics. Do not confuse AVS Forum with AVForums (`avforums.com`). Do not collect from or create content for Xiaohongshu, Douyin, WeChat, Weibo, or Bilibili.

Keep B2C and B2B outputs separate. When the user has not selected a segment, label the inferred segment and avoid mixing incompatible buying motives.

## Insight mode

1. Check which read-only tools are currently available. Do not assume a fixed Agent Reach upstream command; use `agent-reach doctor` when Agent Reach is installed.
2. Research the last 7 days where the source supports date filtering. For feeds such as Reddit `hot`, filter the returned timestamps rather than assuming the ranking equals a date range.
3. Prefer evidence from Reddit, AVS Forum, YouTube, and public overseas social, retailer-review, and independent-review pages that the available tools may lawfully read.
4. Capture the source URL, source date, collection date, channel, audience segment, verbatim excerpt, engagement context, intent, and confidence. Never invent a quotation or metric.
5. Score each observation for frequency, purchase intent, recency, and fit with products whose specifications are verified in project data.
6. Distinguish user evidence from model inference. Report missing or inaccessible channels instead of silently treating them as sampled.

Do not bypass access controls, CAPTCHAs, rate limits, login barriers, or platform restrictions. Use caching and conservative request rates. Do not collect unnecessary personal data.

### AVS Forum boundary

Use AVS Forum for projector selection, calibration, screen choice, throw distance, room conditions, mounting, gaming, home-theater integration, troubleshooting, and owner feedback. Prefer recent threads with specific equipment, room, budget, or buying constraints.

Until AVS Forum grants or documents permission for automated access, do not crawl, scrape, paginate in bulk, or automate login. Use ordinary public-page viewing, permitted search results, and user-supplied links at a human browsing rate. Record thread URL, post date, forum section, and the specific post used as evidence.

Any proposed AVS Forum participation is a human-authored activity. Codex may produce a factual brief, answer outline, relevant questions, and disclosure reminder, but not a ready-to-paste impersonation of a community member. Never conceal a commercial relationship or use the forum for covert promotion.

## Content mode

Read [references/deliverables.md](references/deliverables.md) before creating a content package.

Treat the Reach Projector website and social channels as one content system. When an insight can answer a durable buying question, first check `src/lib/guides.ts` and either link to an existing Buying Guide or propose a sourced guide update. Social drafts may summarize that guide for discovery, while the website remains the canonical long-form answer. Keep B2C drafts connected to buying guides, products, or solutions; keep B2B drafts connected to wholesale, RFQ, logistics, or project-support pages. Use tracked UTM links from `content/social/OPERATIONS.md` when a reviewed draft is approved for publication.

Create content only from cited insights and verified product information. Never invent ANSI lumens, resolution, throw ratio, price, certification, stock, warranty, delivery time, or test results. Mark any unsupported product claim as `NEEDS VERIFICATION` and omit it from publish-ready copy.

Adapt the idea to each platform rather than duplicating one caption everywhere. Prefer original demonstrations, installation examples, comparisons, and customer questions.

For Reddit, prepare a helpful response for human review only. For AVS Forum, prepare an answer brief rather than ready-to-paste prose. Do not conceal brand affiliation, impersonate a customer, manufacture grassroots interest, or insert a store link unless the community rules and the user's explicit publishing decision permit it.

Save each run under `content/social/YYYY-MM-DD/`. Keep evidence, drafts, and review status separate. Every draft begins as `status: draft`.

## Review mode

Use only metrics the user supplies or authorizes access to. Compare content by audience segment, topic, format, hook, and platform. Prioritize retention, watch time, saves, shares, meaningful comments, tracked site visits, signups, inquiries, add-to-cart events, orders, production effort, and paid spend over follower count.

Do not claim causation from a small sample. Recommend continuing, changing, or stopping themes, and record the next test in `content/social/experiments.csv`.

## Final check

Confirm that all channels are overseas; factual claims are sourced or flagged; B2C and B2B are separated; no live interaction occurred; each draft has a target segment, objective, source links, and review status; and inaccessible sources are visible.
