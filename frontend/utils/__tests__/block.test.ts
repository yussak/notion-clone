import { describe, it, expect } from "vitest";
import { BLOCK_TYPES } from "@/constants/blockType";
import { extractBlockType } from "../block";

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
