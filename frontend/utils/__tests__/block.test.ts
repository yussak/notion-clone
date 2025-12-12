import { describe, it, expect } from "vitest";
import { BLOCK_TYPES } from "@/constants/blockType";
import {
  insertBlockAfter,
  extractBlockType,
  extractTypesFromBlocks,
  removeBlockAt,
} from "../block";

describe("extractBlockType", () => {
  describe("ショートカットに該当する場合", () => {
    it("# で始まる場合にHEADING_1に変換される", () => {
      const result = extractBlockType("# タイトル");

      expect(result).toEqual({
        type: BLOCK_TYPES.HEADING_1,
        content: "タイトル",
      });
    });

    it("## で始まる場合にHEADING_2に変換される", () => {
      const result = extractBlockType("## タイトル");

      expect(result).toEqual({
        type: BLOCK_TYPES.HEADING_2,
        content: "タイトル",
      });
    });

    it("- で始まる場合にHEADING_2に変換される", () => {
      const result = extractBlockType("- タイトル");

      expect(result).toEqual({
        type: BLOCK_TYPES.LIST,
        content: "タイトル",
      });
    });
  });

  describe("ショートカットに該当しない場合", () => {
    it("スペースがないときは何も返らない", () => {
      const result = extractBlockType("#タイトル");

      expect(result).toEqual(null);
    });

    it("全角のときは何も返らない", () => {
      const result = extractBlockType("＃　タイトル");

      expect(result).toEqual(null);
    });

    it("ショートカットが存在しないときは何も返らない", () => {
      const result = extractBlockType("##### タイトル");

      expect(result).toEqual(null);
    });
  });
});

describe("extractTypesFromBlocks", () => {
  it("該当するtypeがない場合にブロックがそのまま返る", () => {
    const blocks = [
      { id: "1", type: "paragraph", content: "テキスト1", position: 0 },
      { id: "1", type: "paragraph", content: "#テキスト2", position: 0 },
    ];

    // extractBlockTypeをモックするには別ファイルにする必要があるが、そこまでしなくてもシンプルなので直接読んでいる
    const result = extractTypesFromBlocks(blocks);

    expect(result).toEqual([
      { id: "1", type: "paragraph", content: "テキスト1", position: 0 },
      { id: "1", type: "paragraph", content: "#テキスト2", position: 0 },
    ]);
  });

  it("該当するtypeがあるものとないものが混ざっている場合にブロックが適切に返る", () => {
    const blocks = [
      { id: "1", type: "paragraph", content: "テキスト1", position: 0 },
      { id: "1", type: "heading-2", content: "## テキスト2", position: 0 },
    ];

    const result = extractTypesFromBlocks(blocks);

    expect(result).toEqual([
      { id: "1", type: "paragraph", content: "テキスト1", position: 0 },
      { id: "1", type: "heading-2", content: "テキスト2", position: 0 },
    ]);
  });
});

describe("insertBlockAfter", () => {
  const mockBlocks = [
    { id: "1", type: BLOCK_TYPES.PARAGRAPH, content: "テキスト1", position: 0 },
    { id: "2", type: BLOCK_TYPES.PARAGRAPH, content: "テキスト2", position: 1 },
  ];

  it("指定した位置の次に新しいブロックが追加される", () => {
    const result = insertBlockAfter(mockBlocks, 1);
    expect(result.newBlocks).toHaveLength(3);
    expect(result.newBlocks[2]).toEqual({
      id: null,
      type: BLOCK_TYPES.PARAGRAPH,
      content: "",
      // TODO: 0になるのはおかしい気がするが一旦現状を記録
      position: 0,
    });
  });

  it("元の配列を変更しない", () => {
    const result = insertBlockAfter(mockBlocks, 1);
    expect(mockBlocks).not.toBe(result.newBlocks);
  });

  it("追加後のフォーカス位置が正しい", () => {
    const result = insertBlockAfter(mockBlocks, 2);
    expect(result.nextFocusIndex).toBe(3);
  });
});

describe("removeBlockAt", () => {
  const mockBlocks = [
    { id: "1", type: BLOCK_TYPES.PARAGRAPH, content: "テキスト1", position: 0 },
    { id: "2", type: BLOCK_TYPES.PARAGRAPH, content: "テキスト2", position: 1 },
    { id: "3", type: BLOCK_TYPES.PARAGRAPH, content: "テキスト3", position: 2 },
  ];

  it("指定した位置のブロックが削除される", () => {
    const result = removeBlockAt(mockBlocks, 2);
    expect(result.newBlocks).toHaveLength(2);
    expect(result.newBlocks).toEqual([
      {
        id: "1",
        type: BLOCK_TYPES.PARAGRAPH,
        content: "テキスト1",
        position: 0,
      },
      {
        id: "2",
        type: BLOCK_TYPES.PARAGRAPH,
        content: "テキスト2",
        position: 1,
      },
    ]);
  });

  it("元の配列を変更しない", () => {
    const result = removeBlockAt(mockBlocks, 2);
    expect(mockBlocks).not.toBe(result.newBlocks);
  });

  it("追加後のフォーカス位置が正しい", () => {
    const result = removeBlockAt(mockBlocks, 2);
    expect(result.nextFocusIndex).toBe(1);
  });
});

describe.todo("handleKeyDown", () => {
  // TODO: 書く
  // ここで、insertBlockAfterで末尾のみに追加できるか、などをテストしたい
});
