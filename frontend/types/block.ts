export type Block = {
  id: string | null;
  type: string;
  content: string;
  position: number;
  indentLevel: number;
  parentId?: string;
};
