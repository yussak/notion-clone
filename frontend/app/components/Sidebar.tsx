"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();

  // TODO: エラーハンドリングなど
  const handleAddPage = async() => {
    try {
      const response = await fetch('http://localhost:8080/api/pages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json();
      const createdPageId = data.id;

      router.push(`/pages/${createdPageId}`);

    } catch (error) {
      console.error('Error creating page:', error);
    }
  }

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
