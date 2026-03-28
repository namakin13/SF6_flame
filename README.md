# SF6 Frame Viewer

ストリートファイター6のフレームデータを素早く確認できるデスクトップアプリです。
ゲーム中でも邪魔にならないよう、常時最前面表示・透明度調整・ドラッグ移動に対応しています。

## 機能

- 全キャラクターのフレームデータ表示（通常技・必殺技・SA など）
- キーワード検索でわざ名を絞り込み
- 常時最前面表示のON/OFF切替
- ウィンドウ透明度の調整
- フレームデータのオンライン更新

## 技術スタック

- [Tauri v2](https://tauri.app/) (Rust + WebView)
- React 19 + TypeScript
- Vite

## 開発環境のセットアップ

### 前提条件

- [Node.js](https://nodejs.org/)
- [Rust](https://www.rust-lang.org/tools/install)
- [Tauri の前提条件](https://tauri.app/start/prerequisites/)（Windows: Microsoft C++ Build Tools / WebView2）

### インストール

```bash
npm install
```

### 開発サーバー起動

```bash
npm run dev
```

### ビルド（MSIインストーラー生成）

```bash
npm run build
```

## フレームデータの更新

アプリ起動後、タイトルバーの「↺ 更新」ボタンからデータを最新版に更新できます。
