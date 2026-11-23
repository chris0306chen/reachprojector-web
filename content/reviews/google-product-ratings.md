# Google Product Ratings readiness

Product JSON-LD is generated only from approved, product-linked reviews stored in the local review system. Company reviews and Trustpilot reviews are intentionally excluded from `AggregateRating`.

The Merchant Center Product Ratings feed is not enabled in this branch because it requires a verified Google Merchant Center account, feed destination, and Google-approved review source. The review tables retain the product SKU, source channel, verification status, publication status, and media consent needed for a future feed adapter without exposing customer email or order references.
