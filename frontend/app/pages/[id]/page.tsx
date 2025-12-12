"use client";

import { BLOCK_TYPES } from "@/constants/blockType";
import { Block } from "@/types/block";
import {
  extractTypesFromBlocks,
  getFontSize,
  addBlock,
  deleteBlock,
} from "@/utils/block";
import { use, useEffect, useRef, useState } from "react";

type PageProps = {
  params: Promise<{ id: string }>;
};

// TODO: 保存ボタンを押しても保存されない場合がありそう
export default function Page({ params }: PageProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { id } = use(params);

  const [blocks, setBlocks] = useState([
    { id: null, type: BLOCK_TYPES.PARAGRAPH, content: "", position: 0 },
  ]);

  const [deletedBlockIds, setDeletedBlockIds] = useState<string[]>([]);

  const [nextFocusBlockIndex, setNextFocusBlockIndex] = useState<number | null>(
    null
  );

  // blocks更新後、新しいDOM要素が生成されるのを待つ
  useEffect(() => {
    if (
      nextFocusBlockIndex !== null &&
      inputRefs.current[nextFocusBlockIndex]
    ) {
      inputRefs.current[nextFocusBlockIndex].focus();
      setNextFocusBlockIndex(null);
    }
  }, [blocks, nextFocusBlockIndex]);

  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/pages/${id}`
        );
        const page = await response.json();

        if (page.blocks.length > 0) {
          setBlocks(page.blocks);
        }
      } catch (error) {
        console.error("Error fetching blocks:", error);
      }
    };

    fetchBlocks();
  }, [id]);

  // TODO: 関数分離
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
    block: Block
  ) => {
    if (e.key === "Enter") {
      // addBlockを純粋関数にするためにここに書いている
      e.preventDefault();

      const result = addBlock(blocks, index);
      if (!result) return;

      setBlocks(result.newBlocks);
      setNextFocusBlockIndex(result.nextFocusIndex);
    } else if (
      e.key === "Backspace" &&
      block.content === "" &&
      blocks.length > 1
    ) {
      e.preventDefault();

      // 削除されるブロックのIDを追跡
      if (block.id) {
        setDeletedBlockIds((prev) => [...prev, block.id]);
      }

      const result = deleteBlock(blocks, index);

      setBlocks(result.newBlocks);
      setNextFocusBlockIndex(result.nextFocusIndex);
    }
  };

  // TODO: 分割
  // ブロック追加・削除は保存ボタンを押した時にDB反映するがフロントは即時反映とズレが有るので揃えたい
  const handleSavePage = async () => {
    const extractedBlocks = extractTypesFromBlocks(blocks);

    // 削除されたブロックをまず削除
    const deletePromises = deletedBlockIds.map(async (blockId) => {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blocks/${blockId}`, {
        method: "DELETE",
      });
    });

    const savePromises = extractedBlocks.map(async (block, index) => {
      if (!block.id) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/pages/${id}/blocks`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              type: block.type,
              content: block.content,
              position: index,
            }),
          }
        );
        const data = await res.json();
        return { ...block, id: data.id };
      } else {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blocks/${block.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: block.type,
            content: block.content,
            position: index,
          }),
        });
        return block;
      }
    });

    await Promise.all(deletePromises);
    const updatedBlocks = await Promise.all(savePromises);
    setBlocks(updatedBlocks);

    setDeletedBlockIds([]);
  };

  return (
    <div>
      {blocks.map((block, i) => (
        <div key={i}>
          <input
            type="text"
            placeholder="blockの中身"
            value={block.content}
            style={{ fontSize: getFontSize(block.type) }}
            onChange={(event) => {
              const newBlocks = [...blocks];
              newBlocks[i].content = event.target.value;
              setBlocks(newBlocks);
            }}
            onKeyDown={(event) => handleKeyDown(event, i, block)}
            ref={(element) => {
              inputRefs.current[i] = element;
            }}
          />
        </div>
      ))}
      <p>
        <button onClick={handleSavePage}>ページ保存</button>
      </p>
    </div>
  );
}
