export const BLOCK_TYPES = {
  PARAGRAPH: "paragraph",
  HEADING_1: "heading-1",
  HEADING_2: "heading-2",
  LIST: "list",
} as const;

export type BlockType = (typeof BLOCK_TYPES)[keyof typeof BLOCK_TYPES];
