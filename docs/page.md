## 雑メモ

Page が Block を持つ

Block には見出し、段落等色々ある

フロントは Page を表示する

---

WIP:

- [] list ブロック

TODO:

- [] 他のブロックタイプ(list, todo, table など)
- [] ページ 保存ボタンではなくリアルタイム保存
- [] ドラッグ&ドロップでブロック並び替え
- [] /コマンド機能
- [] WYSIWYG エディタ

後でいい

- [] title create, update, delete
- [] ページ一覧表示 → 後で OK
- [] ページ delete → 後で OK
- [] ユーザー認証
- [] ページ階層構造(親子関係)

Done

- [x] pages テーブル、blocks テーブルの作成
- [x] ページ CRUD 基本

  - [x] create
  - [x] read
    - [x] 詳細
  - [x] update
    - [x] 保存ボタンで全ブロック保存

- [x] ブロック CRUD API 基本

  - [x] create
    - [x] Enter で次のブロック追加
    - [x] 「# 」, 「## 」入力で type 変換(リアルタイム)→ プルダウン廃止
    - [x] type 別の CSS 装飾(heading1 は大きく、など)
  - [x] read
  - [x] update
  - [x] delete
    - [x] 空ブロックで Backspace で削除

---

npx prisma migrate dev --name add_pages_table
