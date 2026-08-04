import type { ProductSpecificationItem } from "@/lib/product-detail";

export interface SeoGeoSuggestions {
  slug: string;
  seoTitle: string;
  metaDescription: string;
  shortDescription: string;
  features: string[];
  description: string;
  warnings: string[];
}

interface SuggestionInput {
  name: string;
  brand?: string;
  model?: string;
  category?: string;
  specifications: ProductSpecificationItem[];
}

const PRIORITY_FACTS = [
  "resolution", "brightness", "light source", "throw ratio", "contrast",
  "color gamut", "hdr", "input lag", "screen size", "connectivity",
];

const RISKY_CLAIMS = /\b(best|cheapest|lowest price|official|authorized|guaranteed|number one|no\.\s*1)\b/i;

function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 220);
}

function atWordBoundary(value: string, maxLength: number): string {
  if (value.length <= maxLength) return value;
  const shortened = value.slice(0, maxLength + 1);
  const boundary = shortened.lastIndexOf(" ");
  return (boundary >= Math.floor(maxLength * 0.65) ? shortened.slice(0, boundary) : shortened.slice(0, maxLength)).trim();
}

function uniqueFacts(specifications: ProductSpecificationItem[]): ProductSpecificationItem[] {
  const seen = new Set<string>();
  const facts = specifications.filter((item) => {
    const key = item.name.trim().toLowerCase();
    if (!key || !item.value.trim() || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  return facts.sort((left, right) => {
    const leftIndex = PRIORITY_FACTS.findIndex((key) => left.name.toLowerCase().includes(key));
    const rightIndex = PRIORITY_FACTS.findIndex((key) => right.name.toLowerCase().includes(key));
    return (leftIndex < 0 ? 999 : leftIndex) - (rightIndex < 0 ? 999 : rightIndex);
  });
}

export function buildSeoGeoSuggestions(input: SuggestionInput): SeoGeoSuggestions {
  const name = input.name.trim().replace(/\s+/g, " ");
  const brand = input.brand?.trim() || "";
  const model = input.model?.trim() || "";
  const facts = uniqueFacts(input.specifications);
  const identity = name || [brand, model, input.category].filter(Boolean).join(" ");
  const titleBase = identity.toLowerCase().includes(brand.toLowerCase()) || !brand
    ? identity
    : `${brand} ${identity}`;
  const seoTitle = `${atWordBoundary(titleBase, 57)} | REACH`;
  const selectedFacts = facts.slice(0, 3);
  const factPhrase = selectedFacts.map((item) => `${item.name} ${item.value}`).join(", ");
  const useCase = input.category
    ? `for ${input.category.toLowerCase()} buyers and AV projects`
    : "for home theater and commercial AV projects";
  const metaBase = factPhrase
    ? `Explore ${identity} with ${factPhrase}, ${useCase}. Worldwide DDP/DAP shipping and project support available.`
    : `Explore ${identity} specifications for home theater, commercial AV and project installations. Worldwide DDP/DAP shipping and project support available.`;
  const metaDescription = atWordBoundary(metaBase, 165);
  const shortDescription = factPhrase
    ? `${identity} is designed ${useCase}. Key verified specifications include ${factPhrase}.`
    : `${identity} product information for home theater, commercial AV and project planning. Confirm configuration and specifications before ordering.`;
  const features = facts.slice(0, 6).map((item) => `${item.name}: ${item.value}`);
  const factSentences = facts.slice(0, 8).map((item) => `${item.name}: ${item.value}.`).join(" ");
  const description = factSentences
    ? `${identity} is presented for buyer evaluation and AV project planning. ${factSentences}\n\nConfirm regional configuration, installation requirements, shipping terms and commercial details before ordering.`
    : shortDescription;
  const warnings: string[] = [];

  if (!brand) warnings.push("缺少品牌，建议先填写后再生成");
  if (!model) warnings.push("缺少型号，建议补充准确型号");
  if (!input.category) warnings.push("缺少产品分类，场景和产品类型表达可能不够准确");
  if (facts.length < 3) warnings.push("可验证参数少于3项，SEO/GEO内容依据不足");
  if (seoTitle.length < 50) warnings.push(`SEO标题较短（${seoTitle.length}/建议50–65字符）`);
  if (metaDescription.length < 140) warnings.push(`Meta描述较短（${metaDescription.length}/建议140–165字符）`);
  if (RISKY_CLAIMS.test(`${seoTitle} ${metaDescription} ${description}`)) {
    warnings.push("包含 Best、Official、Authorized 等需要证据支持的宣传词");
  }

  return {
    slug: slugify(titleBase),
    seoTitle,
    metaDescription,
    shortDescription: atWordBoundary(shortDescription, 600),
    features,
    description,
    warnings,
  };
}
