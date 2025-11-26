"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();

  const handleAddPage = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to create page");
      }

      const data = await response.json();

      router.push(`/pages/${data.id}`);
    } catch (error) {
      console.error("Error creating page:", error);
    }
  };

  return (
    <nav
      style={{
        width: "240px",
        borderRight: "1px solid #ddd",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      <button onClick={handleAddPage}>ページ追加</button>
      <Link href="/">Home</Link>
      <Link href="/dashboard">Dashboard</Link>
      <Link href="/settings">Settings</Link>
    </nav>
  );
}
