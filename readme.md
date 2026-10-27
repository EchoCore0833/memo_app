# メモアプリ開発環境

Node.js・Express・TypeScript・MongoDBを使用したメモアプリの開発環境。

Docker Composeを使用し、チームメンバー間で開発環境を統一する。

先生から配布されたNginx・PHP-FPM・MySQL環境も残している。

## 1. 必要なソフトウェア

- Git
- Docker Desktop（起動しておく）
- Visual Studio Code（推奨）

Node.jsやMongoDBはDockerコンテナ内で動作するため、PCへの個別インストールは基本的に不要。

## 2. プロジェクトの取得

GitHubからリポジトリをクローンし、VS Codeで開く。

※リポジトリURLはGitHub作成後に追記する。

## 3. 環境変数の設定

プロジェクト直下の `.env.example` をコピーし、`.env` を作成する。

PowerShellの場合：

```powershell
Copy-Item .env.example .env
```

`.env` 内のMySQLパスワードは、各自の開発環境に合わせて設定する。

`.env` はGitHubに登録しない。

## 4. メモアプリの起動

プロジェクトのルートフォルダで実行する。

```powershell
docker compose up -d --build node mongodb
```

Node.jsとMongoDBのコンテナが起動する。

初回はイメージのダウンロードとビルドが行われるため、時間がかかる場合がある。

## 5. 動作確認

ブラウザで以下にアクセスする。

http://localhost:3000/

`Memo App API is running! (Development Mode)` と表示されれば、Expressサーバーは正常に動作している。

MongoDBとの接続は、次のコマンドで確認する。

```powershell
docker compose logs --tail=30 node
```

`MongoDB connected successfully!` と表示されれば接続成功。

## 6. 開発時の操作

### コンテナの状態確認

```powershell
docker compose ps
```

### ログの確認

```powershell
docker compose logs -f node
```

### Node.jsとMongoDBの停止

```powershell
docker compose stop node mongodb
```

### Node.jsとMongoDBの再起動

```powershell
docker compose up -d node mongodb
```

### ライブラリを追加・更新した場合

`backend/package.json` や `backend/package-lock.json` を変更した場合は、Node.jsコンテナを再ビルドする。

```powershell
docker compose up -d --build --force-recreate --renew-anon-volumes node
```

## 7. 配布されたPHP環境

既存のNginx・PHP-FPM・MySQL環境も使用できる。

### 起動

```powershell
docker compose up -d nginx app mysql
```

### Webページ

http://localhost:8000/

### phpMyAdmin

http://localhost:8000/phpmyadmin/

### 停止

```powershell
docker compose stop nginx app mysql
```

## 8. フォルダ構成

```text
memo_app/
├── backend/              Node.js・Express・TypeScript
│   ├── public/
│   ├── src/
│   ├── Dockerfile
│   ├── package.json
│   ├── package-lock.json
│   └── tsconfig.json
├── docker/               配布されたDocker設定
├── htdocs/               配布されたPHP環境
├── .env.example          環境変数の設定例
├── .gitignore
├── docker-compose.yml
└── readme.md
```

## 9. チーム開発時の注意事項

- `.env` やパスワードなどの秘密情報をGitHubに登録しない。
- `node_modules` や `dist` はGitHubに登録しない。
- ライブラリを追加した場合は `package.json` と `package-lock.json` を共有する。
- 開発前にDocker Desktopを起動する。
- Docker Composeのコマンドは原則としてプロジェクトのルートフォルダで実行する。
- MongoDBのデータはDockerの名前付きボリュームに保存する。
- `docker compose down -v` は保存データを削除する可能性があるため、通常の停止には使用しない。