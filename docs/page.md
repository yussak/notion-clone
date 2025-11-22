雑メモ

Page が Block を持つ

Block には見出し、段落等色々ある

フロントは Page を表示する

---

Phase 1: 最初に実装(今回)
バックエンド:

- [x] pages テーブル、blocks テーブルの作成
      ページ CRUD API
      ブロック CRUD API
      ブロック並び替え API

ページ一覧画面 → 後で良さそう
ページ編集画面
ブロックの表示(textarea or input)
Enter で次のブロック追加
空ブロックで Backspace で削除

# , ## 入力で type 変換(リアルタイム)

type 別の CSS 装飾(heading1 は大きく、など)
保存ボタンで全ブロック保存

Phase 2: 後回し

/コマンド機能
リアルタイム自動保存
ドラッグ&ドロップでブロック並び替え
ページ階層構造(親子関係)
他のブロックタイプ(bulletList, todo, table など)
ユーザー認証
contentEditable ベースの高度なエディタ

---

npx prisma migrate dev --name add_pages_table
