# Overseas social operating model

1. Collect public, recent audience evidence without interacting with live accounts.
2. Select a B2C or B2B segment and one measurable objective.
3. Produce platform-native drafts backed by source links and verified product claims.
4. Link durable questions to the relevant Buying Guide in `src/lib/guides.ts`; propose a sourced guide update when the site does not yet answer the question.
5. A human reviews product accuracy, platform rules, brand voice, visuals, destination URL, UTM parameters, and timing.
6. A human publishes during the initial pilot.
7. Export performance data weekly and record the next test.

## Initial 30-day cadence

- 3 original short videos per week for TikTok, Instagram Reels, and/or YouTube Shorts.
- 1 Instagram carousel per week when the topic is visually teachable.
- 1 newsletter section per week for consented subscribers.
- Reddit participation only after manual review and subreddit-rule checks.
- AVS Forum is a core insight source; participation is manually researched and human-written, with no automated scraping or posting.
- X is optional and should reuse validated ideas rather than create daily filler.
- LinkedIn is separate and used only for B2B/OEM campaigns.

## Publishing boundary

No credential, cookie, access token, or account password belongs in this repository. Draft creation never authorizes publishing. Live publishing, commenting, messaging, following, advertising, or account changes require separate explicit authorization and a platform-specific connection.

When integrations are introduced, start with draft or approval-queue access where supported. Use official APIs or approved connectors, least-privilege permissions, revocable tokens, and a named human approver. Do not automate Reddit or AVS Forum participation.

## Weekly decision metrics

Judge content using the metrics actually available: opening retention, watch time, completion, saves, shares, meaningful comments, profile visits, tracked site visits, signups, inquiries, add-to-cart events, orders, production effort, and paid spend.

Use consistent UTM parameters:

```text
utm_source=<platform>&utm_medium=organic_social&utm_campaign=<campaign>&utm_content=<asset_id>
```

Do not compare unlike audiences or infer sales impact without tracked visits and conversion data.
