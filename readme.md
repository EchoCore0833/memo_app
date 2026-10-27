# メモアプリ開発環境

5人で開発するメモアプリの共通開発環境です。以下の操作はWindows PowerShellで行います。

| 用途 | 技術・サービス |
|---|---|
| フロントエンド | HTML / CSS / Vanilla JavaScript、Nginx（`frontend`） |
| バックエンド | Node.js 24 / Express / JavaScript（ES Modules、`node`） |
| データベース | MySQL 8.4.8 / mysql2（`mysql`） |
| DB管理画面 | phpMyAdmin（`phpmyadmin`） |
| 配布環境 | Nginx（`nginx`）/ PHP-FPM（`app`） |
| 環境構築 | Docker Compose |

現在はフロントエンドの表示と、APIサーバーからMySQLへの接続を確認する段階です。メモの作成・取得・更新・削除、画面からのAPI通信、WebSocket通信は未実装です。空の実装用ファイルは、今後チームで開発します。

## 1. 必要な準備

1. Gitをインストールします。
2. Docker Desktopをインストールし、起動します。Linuxコンテナを使用します。WindowsでWSL 2などの設定を求められた場合は、Docker Desktopの案内に従って設定してください。
3. GitHubリポジトリへのアクセス権を確認します。非公開の場合はチームへの招待承認とGitHubの認証が必要です。
4. 編集用にVisual Studio Codeなどのエディタを用意します。

Node.js、npm、MySQL、PHPをPCに個別インストールする必要はありません。ブラウザと、初回のイメージ・パッケージ取得に使うインターネット接続が必要です。

PowerShellで確認します。

```powershell
git --version
docker --version
docker compose version
docker info
```

`docker info`でサーバーへの接続エラーが出る場合は、Docker Desktopの起動完了とLinuxコンテナの選択を確認してください。

## 2. GitHubから取得する

保存先のフォルダで実行します。

```powershell
git clone https://github.com/EchoCore0833/memo_app.git
Set-Location .\memo_app
```

以降のコマンドは、`docker-compose.yml`があるこのフォルダで実行してください。VS Codeを使う場合は、このフォルダを開きます。

## 3. 環境変数を設定する

初回だけ、設定例をコピーします。すでに`.env`がある場合は上書きしないでください。

```powershell
Copy-Item .env.example .env
notepad .env
```

| 変数 | 用途 | 設定例の値 |
|---|---|---|
| `MYSQL_ROOT_PASSWORD` | MySQL管理者のパスワード | `change_me` |
| `MYSQL_DATABASE` | 初回作成するDB名 | `phpdb` |
| `MYSQL_USER` | アプリ用の一般ユーザー | `user` |
| `MYSQL_PASSWORD` | 一般ユーザーのパスワード | `change_me` |

初回起動前に、2つのパスワードをそれぞれ別の空でない値へ変更し、保存してください。`MYSQL_USER`には`root`を指定しません。各自のPCのDBなので、パスワードを5人で同じにする必要はありません。パスワードに`$`などの記号を使う場合は、Composeの変数展開を避けるため値をシングルクォートで囲みます。

Node.js用の`DB_HOST`などはComposeが上記の値から渡します。`.env`に追加する必要はありません。現在の設定に必要な4変数は`.env.example`に揃っています。

**すでにMySQLデータがある場合、`.env`だけを変更してもDB内のユーザー・パスワード・DB名は更新されません。** 接続エラーになった場合は元の設定との整合性を確認し、データを削除して解決しないでください。

## 4. 設定を検証して起動する

```powershell
docker compose config --quiet
```

エラーがなければ起動します。

```powershell
docker compose up -d --build
```

全6サービス（MySQL、Node.js、フロントエンド、phpMyAdmin、配布環境のNginx・PHP-FPM）を起動します。初回はダウンロード・ビルド・DB初期化に時間がかかります。Node.jsの依存パッケージはDockerfileの`npm ci`でインストールされます。

MySQLは`docker/mysql/Dockerfile`でMySQL 8.4.8をベースにビルドします。`docker/mysql/my.cnf`を権限`644`でイメージ内にコピーし、Windowsのマウント権限に依存せず読み込めるようにしています。`my.cnf`を変更した場合は、`docker compose up -d --build`を実行して再ビルドし、設定を反映してください。

MySQLは一般ユーザーで対象DBへTCP接続し、`SELECT 1`が成功すると`healthy`になります。Node.jsはこの判定を待って起動します。判定は5秒間隔、タイムアウト5秒、起動猶予30秒、連続失敗12回です。

ポート3000・3306・8000・8080・8081を別のアプリが使用していると起動に失敗します。既存のアプリを確認し、不要なものを停止してください。

## 5. 起動を確認する

### コンテナとMySQL

```powershell
docker compose ps -a
docker compose logs --tail=50 mysql node
```

MySQLが`healthy`、各サービスが`Up`になっていることを確認します。Node.jsのログには次の2行が表示されます。

```text
MySQL connected successfully!
Server running on http://localhost:3000
```

`node --watch`はプログラムのエラー後も待機する場合があるため、`Up`表示だけでなくログとAPIの応答も確認してください。

### ブラウザ

| 確認対象 | URL・接続先 | 確認内容 |
|---|---|---|
| フロントエンド | http://localhost:8080/ | `Memo App`とDocker環境の動作確認文が表示される |
| API | http://localhost:3000/ | `Memo App API is running! (JavaScript + MySQL)`が表示される |
| phpMyAdmin | http://localhost:8081/ | ログイン画面が表示される |
| 配布されたPHP環境 | http://localhost:8000/ | `hello,world!`が表示される |
| MySQL（DBクライアント用） | `127.0.0.1:3306` | ブラウザ用URLではない |

フロントエンドは`localhost`で開いてください。現在のAPIのCORS許可元は`http://localhost:8080`です。

phpMyAdminでは、`.env`の`MYSQL_USER`と`MYSQL_PASSWORD`でログインし、`MYSQL_DATABASE`のDBが見えることを確認します。接続先はComposeで`mysql:3306`に設定済みです。起動直後に接続エラーが出た場合は、MySQLが`healthy`になってから再試行してください。

phpMyAdminの公開先は自分のPCの`127.0.0.1`のみです。他の公開ポートはlocalhost限定の設定ではないため、開発用PCのファイアウォールやネットワーク環境にも注意してください。

新規DBにテーブルがなくても現段階では正常です。`docker/mysql/001_create_memos.sql`は空で、初期化用ディレクトリへのマウントもありません。メモテーブルはまだ自動作成されません。

## 6. 日常の開発操作

### ソースの変更

`backend/`はコンテナに共有され、サーバーは`node --watch`で実行されます。読み込まれているJavaScriptの変更で自動再起動します。反映しない場合はログを確認し、Node.jsを再起動してください。

`frontend/`もコンテナに共有されています。HTML・CSS・JavaScriptの変更後はブラウザを再読み込みします。現在はCSSとAPI通信の実装がまだないため、今後読み込み処理も実装します。

### ログを見る

```powershell
docker compose logs --tail=50 mysql node
docker compose logs -f node
```

ログの追跡は`Ctrl+C`で終了できます。コンテナは停止しません。配布環境は`nginx`・`app`、管理画面は`phpmyadmin`を指定してログを確認できます。

### 作業終了時の停止

```powershell
docker compose stop
```

コンテナとデータを残して停止します。

### 次回の作業開始

Docker Desktopを起動してから実行します。

```powershell
docker compose up -d
```

### Node.jsだけ再起動

```powershell
docker compose restart node
```

MySQLが`healthy`の状態で使用してください。MySQLも停止している場合は、上の`docker compose up -d`を使います。Compose設定や環境変数を変更した場合も、`restart`ではなく`up -d`で反映します。

## 7. 依存パッケージを変更・取得した場合

`/app/node_modules`はNode.jsコンテナ用の匿名ボリュームに保存されます。PCの`backend/node_modules`は使用しません。イメージの再ビルドだけでは古い匿名ボリュームが残る場合があります。

### 他のメンバーの依存変更を取り込んだ場合

`backend/package.json`または`backend/package-lock.json`が変わったら実行します。

```powershell
docker compose up -d --build --force-recreate --renew-anon-volumes node
```

Node.jsイメージを`npm ci`で再ビルドし、Node.js用の匿名ボリュームを更新します。MySQLの名前付きボリューム`mysqldata`は削除しません。

### 自分でパッケージを追加する場合

例として、今後WebSocketを実装する際に`ws`を追加するコマンドです。必要になった時点で実行してください。

```powershell
docker compose exec node npm install ws
docker compose up -d --build --force-recreate --renew-anon-volumes node
```

`backend/package.json`と`backend/package-lock.json`は必ず両方をGit管理します。依存を変更したら両ファイルの差分を確認し、変更されたファイルを同じコミットで共有してください。

### 既存パッケージを更新する場合

起動中のDockerコンテナ内で、`package.json`に指定したバージョン範囲内の更新を行います。以下は`mysql2`を更新する例です。

```powershell
docker compose exec node npm update mysql2
docker compose up -d --build --force-recreate --renew-anon-volumes node
```

更新後は依存ファイルの差分とアプリの動作を確認してください。再ビルドに加えてNode.js用の匿名ボリュームを更新することで、更新済みロックファイルに従った依存を使用します。MySQLの名前付きボリューム`mysqldata`は削除しません。`docker compose down -v`は実行しないでください。

### ロックファイルどおりに再インストールする場合

現在の依存を入れ直すだけなら、次のコマンドでロックファイルどおりに再インストールできます。

```powershell
docker compose exec node npm ci
docker compose restart node
```

`exec`には起動中のNode.jsコンテナが必要です。停止中・依存不足で起動できない場合は、上の再ビルドと匿名ボリューム更新のコマンドを使ってください。

## 8. MySQLのデータを守る

- DBデータは名前付きボリューム`mysqldata`に保存されます。通常の停止には`docker compose stop`を使います。
- **`docker compose down -v`を実行しないでください。DBボリュームを削除するおそれがあります。** Docker Desktopのボリューム削除や不要データの一括削除でも、対象を確認してください。
- 通常の`docker compose down`は名前付きDBボリュームを残しますが、Node.jsの匿名ボリュームは次回起動時に引き継がれないことがあります。日常作業では`stop`と`up -d`に統一します。
- 各メンバーのDBデータはローカルに保存され、GitHubでは共有されません。テーブル変更は今後SQLと適用手順を共有してください。phpMyAdminだけで変更すると他のメンバーに伝わりません。
- 初回起動時だけ、`.env`の値からDBと一般ユーザーが作成されます。既存DBへの変更は、バックアップと変更手順を確認してから行ってください。
- フォルダ名やComposeのプロジェクト名を変えると別のボリュームが使われ、データが消えたように見える場合があります。削除せず、元のプロジェクト名とボリュームを確認してください。

## 9. 5人でのGitHub運用

- 作業前にチームの決めた方法で最新変更を取得し、作業ごとのブランチで開発します。Pull Requestでレビューして統合します。
- `.env`、パスワード、`node_modules/`はPushしません。`.gitignore`に除外設定があります。`git add -f`で無理に追加しないでください。
- `.env.example`、ソースコード、Docker設定、`package.json`、`package-lock.json`は共有します。設定例に本物の秘密情報を書かないでください。
- Composeと依存ファイルは競合しやすいため、変更前に担当者同士で共有します。依存追加後は再ビルド手順も伝えます。
- コミット前に`git status`と`git diff --cached`で、登録するファイルと内容を確認します。

## 10. 現在の主なファイル構成

```text
memo_app/
├── backend/
│   ├── src/
│   │   ├── server.js          API起動・DB接続確認
│   │   ├── db.js              MySQL接続プール
│   │   ├── routes/            今後のルーティング実装用
│   │   ├── controllers/       今後の処理実装用
│   │   └── models/            今後の実装用
│   ├── .dockerignore
│   ├── Dockerfile
│   ├── package.json
│   └── package-lock.json
├── frontend/
│   ├── index.html             動作確認ページ
│   ├── css/style.css          今後の実装用
│   └── js/                    app.js・api.js・websocket.js（今後の実装用）
├── docker/
│   ├── mysql/                 Dockerfile・MySQL設定・未記入のSQLファイル
│   ├── nginx/                 配布環境のNginx設定
│   └── php/                   配布環境のPHP設定
├── htdocs/                    配布環境のPHPページ
├── docs/                      開発・DB資料用（現時点では空）
├── .env.example               共有する環境変数の設定例
├── .env                       各自で作成・Git管理対象外
├── .gitignore
├── docker-compose.yml
└── readme.md
```

起動手順はこのREADMEを、技術構成と実装状況は[App_README.md](App_README.md)を参照してください。
