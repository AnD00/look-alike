# Look-alike

顔写真をアップロードすると、AIが基準画像との類似度を判定するWebアプリケーションです。

## Backend

DeepFace ライブラリを使用して、アップロードされた画像と基準画像を比較し、類似度スコアを返す RESTful API サーバーです。

### 技術スタック

- Python 3.11
- Flask: Web フレームワーク
- Flask-CORS: CORS 対応
- DeepFace: 顔認識ライブラリ (Facenetモデル使用)
- TensorFlow: 機械学習フレームワーク
- Poetry: パッケージ管理

### アーキテクチャ

- app.py: Flaskアプリケーションのエントリーポイント
- routes.py: APIルーティング定義
- face_recognition_service.py: 顔認識処理のコアロジック
- config.py: アプリケーション設定
- logger.py: ロギング設定
- image_utils.py: 画像処理ユーティリティ

### 主な機能

- 画像アップロードによる顔認識
- 複数の基準画像から平均顔ベクトルを生成
- ロジスティック関数による人間の感覚に合わせた類似度スコア計算
- 最も似ている基準画像の特定
- エラーハンドリングとロギング

### インストール

```bash
cd backend
```

```bash
poetry install
```

### 使用方法

#### 1. 基準画像の配置

- src/look_alike/images フォルダに基準画像（.jpg, .jpeg, .png）を配置

#### 2. サーバーの起動

```bash
poetry run python src/look_alike/app.py
```

#### 3. API の使用

```bash
# 画像比較
curl -X POST http://localhost:5001/api/compare -F "userImage=@path/to/your/image.jpg"
```

### API エンドポイント

#### POST /api/compare

アップロードされた画像と基準画像を比較

##### リクエスト

- Method: POST
- Content-Type: multipart/form-data
- Body:
  - `userImage`: 比較する画像ファイル（必須）

##### レスポンス

```json
{
  "similarity": 85.5,
  "best_match_filename": "reference1.jpg"
}
```

##### エラーレスポンス

```json
{
  "error": "エラーメッセージ"
}
```

#### GET /api/reference_image/{filename}

基準画像を取得

##### リクエスト

- Method: GET
- URL Parameter: filename（画像ファイル名）

##### レスポンス

- 画像ファイル

### 設定する値

`backend/src/look_alike/config.py` で設定している値を変更することで、動作をカスタマイズできます。

#### 主な設定項目

- `MODEL_NAME`: 使用する DeepFace モデル（デフォルト: Facenet）
- `SIMILARITY_INFLECTION_POINT`: 類似度50%となる距離の変曲点（デフォルト: 0.4）
- `SIMILARITY_K`: ロジスティック関数の急峻さパラメータ（デフォルト: 22）
- `FACE_CONFIDENCE_THRESHOLD`: 顔検出の信頼度閾値（デフォルト: 0）
- `PORT`: サーバーポート（デフォルト: 5001）
- `DEBUG`: デバッグモード（デフォルト: False）

### トラブルシューティング

#### 1. 基準画像が見つからない場合

- `src/look_alike/images/`フォルダが存在することを確認
- 画像ファイルの拡張子が`.jpg`, `.jpeg`, `.png`であることを確認

#### 2. モデルのダウンロードが遅い場合

- 初回起動時は DeepFace モデルのダウンロードに時間がかかります
- ダウンロード後はキャッシュされるため、2 回目以降は高速に起動します

#### 3. 顔が検出されない場合

- 画像内に顔が明確に写っていることを確認
- `config.py`の`FACE_CONFIDENCE_THRESHOLD`を下げることで検出を緩和できます

## Frontend

Next.js を使用して構築された Web アプリケーションで、ユーザーが画像をアップロードし、類似度スコアを表示します。

### 技術スタック

- Next.js 15.3.4 (with Turbopack)
- React 19.0.0
- TypeScript
- Tailwind CSS v4
- Framer Motion: アニメーション
- Lucide React: アイコン

### アーキテクチャ

- app/: Next.js アプリケーション
  - `components/`: React コンポーネント群
    - `ImageUpload.tsx`: 画像アップロード機能
    - `JudgeButton.tsx`: 判定実行ボタン
    - `ResultDisplay.tsx`: 結果表示コンポーネント
  - `hooks/`: カスタムReactフック
    - `useImageUpload.ts`: 画像アップロード状態管理
    - `useFaceComparison.ts`: 顔比較API呼び出し
    - `useProgress.ts`: プログレスバーアニメーション
  - `services/`: API統合レイヤー
    - `api.ts`: バックエンドAPI通信
  - `types/`: TypeScript型定義
  - `utils/`: ユーティリティ関数
  - `page.tsx`: メインページコンポーネント

### 主な機能

- ドラッグ&ドロップによる画像アップロード
- 画像プレビュー表示
- リアルタイム顔比較処理
- 類似度スコアのアニメーション表示
- 最も似ている基準画像の表示
- プログレスバー付き処理状態表示
- レスポンシブデザイン
- エラーハンドリングとユーザーフィードバック

### インストール

```bash
cd frontend
```

```bash
npm install
```

### 使用方法

#### 1. 環境変数の設定（任意）

デフォルトではバックエンドAPIは`http://127.0.0.1:5001`に接続します。
別のホストを使用する場合は環境変数を設定してください。

```bash
export NEXT_PUBLIC_API_URL=http://your-backend-host:5001
```

#### 2. サーバーの起動

```bash
npm run dev
```

ブラウザで http://localhost:3000 にアクセスしてください。

## 動作の仕組み

1. ユーザーがWebインターフェースから写真をアップロード
2. フロントエンドが画像をFlask APIに送信
3. バックエンドがDeepFace (Facenetモデル)で顔の特徴ベクトルを抽出
4. `backend/src/look_alike/images/`内の全基準画像から生成した平均顔ベクトルと比較
5. コサイン距離をロジスティック関数で人間の感覚に合うスコアに変換
6. 最も類似度の高い基準画像と類似度パーセンテージを返す
7. フロントエンドが結果をアニメーション付きで表示

## セキュリティとプライバシー

- アップロードされた画像は処理後、即座にサーバーから削除されます
- 画像データは一時的にメモリ上でのみ処理され、永続化されません
- 基準画像はサーバー側でのみ管理され、外部からアクセスできません
