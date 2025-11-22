"use client";

import { use, useEffect, useState } from "react";

export default function Page({ params }) {
  const { id } = use(params);
  const [blockId, setBlockId] = useState(null);
  const [blockType, setBlockType] = useState("paragraph");
  const [blockContent, setBlockContent] = useState("");

  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/pages/${id}`);
        const page = await res.json();

        console.log("fetched page:", page);
        console.log("fetched page.blocks:", page.blocks);

        if (page.blocks.length > 0) {
          const firstBlock = page.blocks[0];
          setBlockId(firstBlock.id);
          setBlockType(firstBlock.type);
          setBlockContent(firstBlock.content);
        }
      } catch (error) {
        console.error("Error fetching blocks:", error);
      }
    };

    fetchBlocks();
  }, [id]);

  // TODO: 分割
  const handleSavePage = async () => {
    if (!blockId) {
      try {
        const response = await fetch(
          `http://localhost:8080/api/pages/${id}/blocks`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              type: blockType,
              content: blockContent,
            }),
          }
        );

        const data = await response.json();

        setBlockId(data.id);
      } catch (error) {
        console.error("Error saving page:", error);
      }
    } else {
      try {
        await fetch(`http://localhost:8080/api/blocks/${blockId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: blockType,
            content: blockContent,
          }),
        });
      } catch (error) {
        console.error("Error saving page:", error);
      }
    }
  };

  return (
    <div>
      id: {id}
      <label for="block-select">block type:</label>
      <select
        name="block"
        id="block-select"
        value={blockType}
        onChange={(e) => setBlockType(e.target.value)}
      >
        <option value="paragraph">段落</option>
        <option value="heading-1">見出し1</option>
        <option value="heading-2">見出し2</option>
        <option value="list">リスト</option>
      </select>
      <input
        type="text"
        placeholder="blockの中身"
        value={blockContent}
        onChange={(e) => setBlockContent(e.target.value)}
      />
      <p>
        <button onClick={handleSavePage}>ページ保存</button>
      </p>
    </div>
  );
}
