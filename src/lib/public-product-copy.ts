const DRAFT_ONLY_SENTENCES = [
  'Price, stock, regional configuration, included accessories, warranty and shipping terms require confirmation before publication.',
  'Price, inventory, regional version, warranty and shipping terms require confirmation before publication.',
];

export function cleanPublicProductText(value: string | null | undefined) {
  if (!value) return '';
  return DRAFT_ONLY_SENTENCES.reduce(
    (text, sentence) => text.replace(sentence, ''),
    value
  )
    .replace(/(^|[\s(])\*+(?=[A-Za-z])/g, '$1')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
