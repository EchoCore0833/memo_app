# メモアプリ 開発環境

## 1. サーバーサイド

| 項目 | 採用技術 |
|---|---|
| Webサーバ | Node.js / Express |
| データベースサーバ | MySQL 8.4.8 |
| 開発言語 | JavaScript |
| フレームワーク | Express |
| データベース接続 | mysql2 |

サーバーサイドでは、Node.jsとExpressを使用してWeb APIを構築する。データベースにはMySQL 8.4.8を採用し、メモデータの保存・管理を行う。開発言語にはJavaScriptを使用し、mysql2を利用してデータベースとの接続を行う。

## 2. クライアントサイド

| 項目 | 採用技術 |
|---|---|
| 開発言語 | HTML / CSS / JavaScript |
| フレームワーク | なし（Vanilla JavaScript） |

クライアントサイドでは、HTML・CSS・JavaScriptを使用して画面を構築する。フレームワークは使用せず、Vanilla JavaScriptによって画面操作やWeb APIとの通信を実装する。

## 3. 開発・実行環境

Docker Composeを使用して各サービスをコンテナ化し、開発環境を統一する。クライアントサイドの配信にはNginxを使用し、Git・GitHubでソースコードを共有・管理する。# メモアプリ 開発環境

## 1. サーバーサイド

| 項目 | 採用技術 |
|---|---|
| Webサーバ | Node.js / Express |
| データベースサーバ | MongoDB 8 |
| 開発言語 | TypeScript |
| フレームワーク | Express |

サーバーサイドでは、Node.jsとExpressを使用してWeb APIを構築する。データベースにはMongoDBを採用し、データの保存・管理を行う。開発言語にはTypeScriptを使用する。

## 2. クライアントサイド

| 項目 | 採用技術 |
|---|---|
| 開発言語 | HTML / CSS / JavaScript |
| フレームワーク | なし（Vanilla JavaScript） |

クライアントサイドでは、HTML・CSS・JavaScriptを使用して画面を構築する。現時点では専用のフレームワークを導入せず、標準のJavaScriptで開発する。

## 3. 開発・実行環境

Docker Composeを使用して各サービスをコンテナ化し、開発環境を統一する。クライアントサイドの配信にはNginxを使用し、Git・GitHubでソースコードを共有・管理する。