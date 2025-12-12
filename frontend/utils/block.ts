import { BLOCK_TYPES } from "@/constants/blockType";
import { Block } from "@/types/block";

export const extractBlockType = (content: string) => {
  const shortcuts: Record<string, string> = {
    "# ": BLOCK_TYPES.HEADING_1,
    "## ": BLOCK_TYPES.HEADING_2,
    "- ": BLOCK_TYPES.LIST,
  };

  for (const [prefix, type] of Object.entries(shortcuts)) {
    if (content.startsWith(prefix)) {
      return {
        type,
        content: content.slice(prefix.length),
      };
    }
  }

  // マッチしない場合paragraphでそのまま返そうかと思ったがこの関数の責務はtypeの取得に絞ろうと思ったのでnullを返す
  return null;
};

export const extractTypesFromBlocks = (blocks: Block[]) => {
  return blocks.map((block) => {
    const extractedBlock = extractBlockType(block.content);
    if (extractedBlock) {
      return {
        ...block,
        type: extractedBlock.type,
        content: extractedBlock.content,
      };
    }
    return block;
  });
};

export const getFontSize = (type: string): string => {
  if (type === BLOCK_TYPES.HEADING_1) {
    return "40px";
  } else if (type === BLOCK_TYPES.HEADING_2) {
    return "32px";
  } else {
    return "16px";
  }
};

export const addBlock = (blocks, currentIndex: number) => {
  // 一番下の行だけでブロックを追加する
  if (currentIndex !== blocks.length - 1) return;

  const newBlocks = [...blocks];
  newBlocks.splice(currentIndex + 1, 0, {
    id: null,
    type: BLOCK_TYPES.PARAGRAPH,
    content: "",
    position: 0,
  });

  return { newBlocks, nextFocusIndex: currentIndex + 1 };
};

export const deleteBlock = (blocks, currentIndex: number) => {
  const newBlocks = [...blocks];
  newBlocks.splice(currentIndex, 1);

  return { newBlocks, nextFocusIndex: currentIndex - 1 };
};
