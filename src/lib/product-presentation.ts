import { formatProductDescription } from "@/lib/product-detail";

export type ProductDescriptionBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; ordered: boolean; items: string[] };

const unorderedItem = /^\s*[-*•]\s+(.+)$/;
const orderedItem = /^\s*\d+[.)]\s+(.+)$/;
const markdownHeading = /^\s*#{1,3}\s+(.+)$/;

const looksLikeHeading = (line: string) => {
  const text = line.trim();
  return text.length > 0 && text.length <= 72 && /[:：]$/.test(text);
};

export function parseProductDescription(value: string, locale = "en"): ProductDescriptionBlock[] {
  const lines = value.replace(/\r\n?/g, "\n").split("\n");
  const blocks: ProductDescriptionBlock[] = [];
  let paragraph: string[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;

  const flushParagraph = () => {
    const text = paragraph.join(" ").replace(/\s+/g, " ").trim();
    if (text) blocks.push({ type: "paragraph", text });
    paragraph = [];
  };
  const flushList = () => {
    if (list?.items.length) blocks.push({ type: "list", ...list });
    list = null;
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }

    const heading = line.match(markdownHeading)?.[1]?.trim();
    if (heading || looksLikeHeading(line)) {
      flushParagraph();
      flushList();
      blocks.push({ type: "heading", text: heading || line.replace(/[:：]\s*$/, "") });
      continue;
    }

    const unordered = line.match(unorderedItem);
    const ordered = line.match(orderedItem);
    const item = unordered?.[1] || ordered?.[1];
    if (item) {
      flushParagraph();
      const isOrdered = Boolean(ordered);
      if (list && list.ordered !== isOrdered) flushList();
      list ||= { ordered: isOrdered, items: [] };
      list.items.push(item.trim());
      continue;
    }

    flushList();
    paragraph.push(line);
  }

  flushParagraph();
  flushList();
  if (blocks.length === 1 && blocks[0].type === "paragraph") {
    return formatProductDescription(value, locale).map((text) => ({ type: "paragraph", text }));
  }
  return blocks;
}

export function moveArrayItem<T>(items: T[], from: number, to: number): T[] {
  if (from === to || from < 0 || to < 0 || from >= items.length || to >= items.length) return items;
  const next = [...items];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}
