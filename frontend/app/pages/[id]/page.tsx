"use client";

import { use, useEffect, useState } from "react";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default function Page({ params }: PageProps) {
  const { id } = use(params);

  const [blocks, setBlocks] = useState([
    { id: null, type: "paragraph", content: "", order: 0 },
  ]);

  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/pages/${id}`);
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

  // TODO: 分割
  const handleSavePage = async () => {
    const savePromises = blocks.map(async (block, i) => {
      if (!block.id) {
        const res = await fetch(
          `http://localhost:8080/api/pages/${id}/blocks`,
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
        await fetch(`http://localhost:8080/api/blocks/${block.id}`, {
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
          <label htmlFor="block-select">type:</label>
          <select
            name="block"
            id="block-select"
            value={block.type}
            onChange={(e) => {
              const newBlocks = [...blocks];
              newBlocks[i].type = e.target.value;
              setBlocks(newBlocks);
            }}
          >
            <option value="paragraph">段落</option>
            <option value="heading-1">見出し1</option>
            <option value="heading-2">見出し2</option>
            <option value="list">リスト</option>
          </select>
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
