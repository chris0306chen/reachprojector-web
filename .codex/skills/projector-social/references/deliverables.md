# Content package format

Create only the deliverables useful for the approved audience and available evidence. Do not force all channels into every run.

## Evidence brief

Include the collection window, channels actually sampled, target segment, funnel stage, evidence-backed pains and objections, content opportunities, source URLs and dates, limitations, and claims needing verification.

## Draft metadata

Start every draft with:

```yaml
status: draft
audience: B2C or B2B
segment: specific segment
platform: platform name
objective: awareness, engagement, email signup, inquiry, or sale
evidence_ids: []
product_claims_verified: false
human_review_required: true
```

## Platform adaptations

- **TikTok/Reels/Shorts:** hook, visual shot list, spoken script, on-screen text, caption, and one measurable call to action. Default to 20-45 seconds unless the idea needs longer.
- **Instagram carousel:** cover promise plus 4-7 slides, caption, and visual notes.
- **X:** one concise post or a short thread only when the idea benefits from sequential explanation.
- **Newsletter:** subject, preview text, 100-200 word section, and one call to action. Use only for a consented mailing list.
- **Reddit:** answer directly, state relevant affiliation, avoid links by default, and remind the reviewer to check subreddit rules.
- **AVS Forum:** provide a factual answer outline, useful diagnostic questions, verified specifications, source links, and an affiliation-disclosure reminder. The human participant must write the final post in their own words and verify the thread and forum rules.
- **LinkedIn:** use only for B2B topics and focus on operational outcomes, sourcing, customization, service, or project requirements.

## File layout

```text
content/social/YYYY-MM-DD/
|-- evidence.md
|-- brief.md
`-- drafts/
    |-- short-video.md
    |-- instagram.md
    |-- x.md
    |-- newsletter.md
    |-- reddit.md
    `-- avs-forum-brief.md
```

Omit empty platform files. Generation does not imply approval.
