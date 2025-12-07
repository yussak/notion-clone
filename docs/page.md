## 雑メモ

Page が Block を持つ

Block には見出し、段落等色々ある

フロントは Page を表示する

---

Phase 1

- [x] pages テーブル、blocks テーブルの作成
- [] ページ CRUD API

  - [x] create
  - [] title create, update, delete
  - [] read
    - [x] 詳細
    - [] ページ一覧画面 → 後で OK
  - [] update
    - [x] 保存ボタンで全ブロック保存
  - [] delete → 後で OK

- [] ブロック CRUD API

  - [] create
    - [x] Enter で次のブロック追加
    - [x] 「# 」, 「## 」入力で type 変換(リアルタイム)→ プルダウン廃止
    - [x] type 別の CSS 装飾(heading1 は大きく、など)
  - [x] read
  - [x] update
  - [x] delete
    - [x] 空ブロックで Backspace で削除

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
