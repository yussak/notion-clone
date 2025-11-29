"use client";

import { BLOCK_TYPES } from "@/constants/blockType";
import { use, useEffect, useState } from "react";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default function Page({ params }: PageProps) {
  const { id } = use(params);

  const [blocks, setBlocks] = useState([
    { id: null, type: "paragraph", content: "", order: 0 },
  ]);

  const extractBlockType = (content: string) => {
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
    return null;
  };

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

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Enter") {
      // フォーム送信を防ぐ
      e.preventDefault();

      // 一番下の行だけでブロックを追加する
      if (index !== blocks.length - 1) return;

      const newBlocks = [...blocks];
      newBlocks.splice(index + 1, 0, {
        id: null,
        type: "paragraph",
        content: "",
        order: 0,
      });
      setBlocks(newBlocks);
    }
  };

  const extractTypesFromBlocks = (blocks) => {
    const extractedBlocks = blocks.map((block) => {
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

    return extractedBlocks;
  };

  // TODO: 分割
  const handleSavePage = async () => {
    const extractedBlocks = extractTypesFromBlocks(blocks);

    const savePromises = extractedBlocks.map(async (block) => {
      if (!block.id) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/pages/${id}/blocks`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ type: block.type, content: block.content }),
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
          body: JSON.stringify({ type: block.type, content: block.content }),
        });
        return block;
      }
    });

    const updatedBlocks = await Promise.all(savePromises);
    setBlocks(updatedBlocks);
  };

  return (
    <div>
      {blocks.map((block, i) => (
        <div key={i}>
          <input
            type="text"
            placeholder="blockの中身"
            value={block.content}
            onChange={(e) => {
              const newBlocks = [...blocks];
              newBlocks[i].content = e.target.value;
              setBlocks(newBlocks);
            }}
            onKeyDown={(e) => handleKeyDown(e, i)}
          />
        </div>
      ))}
      <p>
        <button onClick={handleSavePage}>ページ保存</button>
      </p>
    </div>
  );
}
