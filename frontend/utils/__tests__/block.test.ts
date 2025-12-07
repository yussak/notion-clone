import { describe, it, expect } from "vitest";
import { BLOCK_TYPES } from "@/constants/blockType";
import { extractBlockType, extractTypesFromBlocks } from "../block";

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
