import type { ImportedProduct } from "@/lib/product-bulk-import";

export interface ProductGeoContent {
  seoTitle: string;
  metaDescription: string;
  factualSummary: string;
  audience: string[];
  applications: string[];
  limitations: string[];
  faq: Array<{ question: string; answer: string }>;
  provenance: {
    sourceUrl: string | null;
    reviewedAt: string | null;
    basis: "verified_source_facts";
  };
}

function sentence(value: string): string {
  const clean = value.trim().replace(/\s+/g, " ");
  return clean && !/[.!?]$/.test(clean) ? `${clean}.` : clean;
}

export function buildProductGeoContent(product: ImportedProduct): ProductGeoContent {
  const identity = [product.brand, product.model || product.name].filter(Boolean).join(" ").trim();
  const seoTitle = (product.seoTitle || `${identity} | Reach Projector`).slice(0, 70);
  const specificationSummary = product.specifications.slice(0, 6)
    .map((item) => `${item.name}: ${item.value}`)
    .join("; ");
  const factualSummary = [
    sentence(`${product.name} is a ${product.category.toLowerCase()} product from ${product.brand}`),
    product.model ? sentence(`The confirmed model is ${product.model}`) : "",
    specificationSummary ? sentence(`Verified specifications include ${specificationSummary}`) : "",
  ].filter(Boolean).join(" ");
  const metaDescription = (product.metaDescription || product.shortDescription || factualSummary).slice(0, 170);
  const audience = product.category.toLowerCase().includes("projector")
    ? ["Home cinema buyers comparing confirmed projector specifications", "Business buyers evaluating projection equipment"]
    : ["Buyers comparing confirmed product specifications"];
  const applications = product.category.toLowerCase().includes("projector")
    ? ["Projection setups where the listed specifications match the room and screen requirements"]
    : ["Applications that match the verified specifications listed on this page"];
  const limitations = [
    !product.model ? "The source did not provide a confirmed model number." : "",
    !product.specifications.length ? "The source did not provide a structured specification list." : "",
    "Price, inventory, regional version, warranty and shipping terms require confirmation before publication.",
  ].filter(Boolean);
  const faq = [
    ...(product.specifications.length ? [{
      question: `What are the key specifications of ${product.name}?`,
      answer: product.specifications.slice(0, 5).map((item) => `${item.name}: ${item.value}`).join("; "),
    }] : []),
    {
      question: `Is ${product.name} ready to order?`,
      answer: "Availability, price, regional version and shipping terms must be confirmed on the published Reach Projector product page or with the sales team.",
    },
  ];

  return {
    seoTitle,
    metaDescription,
    factualSummary,
    audience,
    applications,
    limitations,
    faq,
    provenance: {
      sourceUrl: product.source?.canonicalUrl || product.source?.url || null,
      reviewedAt: product.source?.retrievedAt || null,
      basis: "verified_source_facts",
    },
  };
}
