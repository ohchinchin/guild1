# Work Log - Guild1

## 2025-05-24
- Task started: Generate a realistic dark fantasy title screen image using the 'nanobanana' extension.
- Initial research: Checking for the 'nanobanana' extension tools and official 'imagen' tools.

## 2026-05-03
- 画像生成コマンドのパスと実行: "A high fantasy warrior, PNG format"
- `mcp_nanobanana_generate_image` を実行したが、APIキー（NANOBANANA_API_KEY）が未設定のためエラーが発生。
- ユーザーにAPIキーの設定を促す。

## 2026-05-04
- `nanobanana` コマンドの衝突を解決。
- 原因: Extension と Skill の両方に `nanobanana` という名前が設定されていたため。
- 対応: MCPツール群を提供する Extension 側を優先するため、ワークスペース設定で Skill 側の `nanobanana` を無効化（`gemini skills disable nanobanana`）。
- 結果: 起動時の衝突警告が解消されたことを確認。

- タイトル画面の背景画像を `bg_title.webp` に変更。
- 闇市場 (Dark Market) の実装完了。
  - 悪名 (Notoriety) 15以上で解放されるUI。
  - 予算 (Budget) を消費して強力な永続効果（戦力アップ、名声ブースト、工作強化）を購入可能。
- 工作・諜報 (Intrigue) のロジック強化。
  - 闇市場アイテム「暗殺教本」によるリスク低減効果の追加。
- 季節イベント（天候・行事）システムの追加。
  - 夏季の「豊作祭」「大干ばつ」、冬季の「大寒波」「星夜の奇跡」など。ターンごとにランダムな経済・名声影響が発生するように拡張。
- `GameContext` のバグ修正とリファクタリング。
  - ツール実行時のコード重複・破損を修正。
- 不自然にサイズが小さかった画像ファイルの作り直し（pollinations.ai / Flux モデル使用）。
  - `bg_dungeons.webp`, `bg_shops.webp`, `bg_board.webp` および各クラスの `*_3.webp` シリーズを修正。
  - `.env` の API キーを正しく読み込み、レート制限を考慮した再生成スクリプト `scripts/fix_images.js` を実行。

### GitHub Pages での画面真っ白問題の修正
- プロジェクト構成の確認
- `vite.config.ts`, `package.json`, `index.html` の調査
- GitHub Actions の設定確認
- 原因の特定と修正:
  - `vite.config.ts` に `base: '/guild1/'` を設定済みであることを確認。
  - `src/App.tsx`, `src/components/ImageDisplay.tsx`, `src/logic/generators.ts` 内の絶対パス（`/images/...`）を `import.meta.env.BASE_URL` を使用するように修正。
- ローカルでのビルド確認を行い、パスが正しく変換されることを確認。
- GitHub への Push を行い、GitHub Actions による自動デプロイを待機。
