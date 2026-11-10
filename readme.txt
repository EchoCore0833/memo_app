# メモアプリ共同開発 共通プロンプト

私たちは5人チーム（A〜E）で、メモ帳Webアプリを開発しています。

- フロントエンド：HTML / CSS / JavaScript
- バックエンド：Node.js / Express
- データベース：MySQL
- 実行環境：Docker Compose
- GitHub：https://github.com/EchoCore0833/memo_app

A担当が基本的なCRUD機能を実装済みです。B〜Eはそれぞれ追加機能を担当します。

## 1. 担当機能と使用ファイル

### B：メモの並び替え（F-05）
- 使用ファイル：`frontend/js/features/sort.js`
- 機能：作成日時・更新日時・タイトルによる6種類の並び替え
- 使用関数：`sortMemos(memos, sortType)`

### C：下書き自動保存・復元（F-06）
- 使用ファイル：`frontend/js/features/draft.js`
- 機能：LocalStorageへの下書き保存と復元
- 使用関数：`initializeDraft(options)`、`restoreDraft(options)`、`clearDraft(options)`

### D：編集ガード（F-07）
- 使用ファイル：`frontend/js/features/unsavedWarning.js`
- 機能：未保存の変更を検知し、メモの切り替えやページ離脱時に警告する
- 使用関数：`initializeUnsavedWarning(options)`、`canLeaveMemo(options)`、`markAsSaved(options)`

### E：リアルタイム同期（F-08）
- 使用ファイル：
  - `frontend/js/features/websocket.js`
  - `backend/src/websocket/memoSocket.js`
- 機能：WebSocketによるメモの作成・更新・削除通知
- 使用関数：`initializeWebSocket(options)`、`initializeMemoSocket(server)`、`broadcastMemoChange(event)`

## 2. 全体のファイル構成

```text
memo_app/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── memoController.js
│   │   ├── models/
│   │   │   └── memoModel.js
│   │   ├── routes/
│   │   │   └── memoRoutes.js
│   │   ├── websocket/
│   │   │   └── memoSocket.js
│   │   ├── db.js
│   │   └── server.js
│   └── package.json
│
├── frontend/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── features/
│   │   │   ├── sort.js
│   │   │   ├── draft.js
│   │   │   ├── unsavedWarning.js
│   │   │   └── websocket.js
│   │   ├── api.js
│   │   └── app.js
│   └── index.html
│
├── docker/
├── docs/
├── docker-compose.yml
├── .env.example
└── README.md
```

※主要ファイルを示した構成です。実際のリポジトリを優先してください。

## 3. 開発上の制限

1. 原則として自分の担当ファイルのみ編集する。
2. `app.js`、`api.js`、`server.js`、`memoController.js` はAが管理するため、勝手に変更しない。
3. 既存の関数名・引数・戻り値を変更しない。
4. 基本機能（CRUD）を壊さない。
5. ほかの担当者のファイルを変更しない。
6. 担当ファイル以外の変更やライブラリの追加が必要な場合は、事前にAへ相談する。
7. 現在のコードを確認してから実装し、存在しない処理を推測で追加しない。

## 4. 開発開始

まず私がB・C・D・Eのどの担当なのかを確認してください。

担当が決まったら、該当機能の開発を支援してください。