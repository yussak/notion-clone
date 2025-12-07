"use client";

import { BLOCK_TYPES } from "@/constants/blockType";
import { extractTypesFromBlocks } from "@/utils/block";
import { use, useEffect, useRef, useState } from "react";

type PageProps = {
  params: Promise<{ id: string }>;
};

// TODO: 保存ボタンを押しても保存されない場合がありそう
// TODO: 保存するとブロックの順番が変わることがある
export default function Page({ params }: PageProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { id } = use(params);

  const [blocks, setBlocks] = useState([
    { id: null, type: "paragraph", content: "", order: 0 },
  ]);

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
  // TODO: 追加時にもカーソル移動したい
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
    block: any
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
    } else if (
      e.key === "Backspace" &&
      block.content === "" &&
      blocks.length > 1
    ) {
      e.preventDefault();

      const newBlocks = [...blocks];
      newBlocks.splice(index, 1);
      setBlocks(newBlocks);

      inputRefs.current[index - 1]?.focus();
    }
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

  const getFontSize = (type: string): string => {
    if (type === BLOCK_TYPES.HEADING_1) {
      return "40px";
    } else if (type === BLOCK_TYPES.HEADING_2) {
      return "32px";
    } else {
      return "16px";
    }
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
