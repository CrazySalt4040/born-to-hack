# BORN TO HACK — v0.3

北朝鮮に生まれ、国家管理下のIT技術者として働く人生を描くフィクションの選択型ゲーム。生存した主人公は国家IT採用とAI面接を通り、幼少期の選択、能力、人脈、健康、家族、運によって人生が分かれます。15歳から高リスク行動が可能。特別な職業を得てもゲームは続き、死亡時に人生を総括します。

## Setup

Node.js **24+** / pnpm **11.25.0**。React / Vite / TypeScript の既存構成を維持しています。

```sh
npm install -g pnpm@11.25.0
pnpm install --frozen-lockfile
pnpm dev
```

http://localhost:5173 を開きます。シード欄を指定すると同じ初期状態になります。同じシード・同じ選択順で同じ人生を再現できます。

```sh
pnpm typecheck
pnpm test
pnpm build
pnpm simulate
```

`dist/` が静的ゲーム、`dist-server/` が任意の総括APIです。GitHub Actionsも同じ手順を実行します。`pnpm-workspace.yaml` はesbuildのビルドスクリプトのみ許可します。

## 遊び方

開始・選択後は1.8秒に1年ずつ日常ログを残して自動進行し、次の岐路で停止します。「一時停止」、3倍速、「次の岐路まで進む」でペースを調整できます。年表・図鑑を開いている間、非表示タブでは進行しません。再読込・セーブ読込後は一時停止から再開します。死亡判定は毎年行い、早送りでも岐路を飛ばしません。日常ログはテンプレート生成で、AI接続は不要です。

## Optional AI ending composition

APIなしでもゲーム・保存・結末表示はすべて動作します。AIは自由な事実を創作せず、ゲームが確定した7文を構成し直します。500件以上の個別執筆済みシナリオではありません。

1. `.env.example` を `.env` にコピーし、必要に応じてサーバー専用 `AI_GATEWAY_API_KEY` / `AI_MODEL` を設定します。モデル名は利用中のGatewayで確認してください。
2. `pnpm build` の後、`node --env-file=.env dist-server/index.js` を実行します（別ターミナル）。環境変数をOS側に設定済みなら `pnpm start:api` でも起動できます。
3. `pnpm dev` を起動。Viteが `/api` を localhost:8787 へ転送します。
4. 死亡画面の「AIによる総括の構成を試す」を押します。確定済みの架空の人生情報がサーバーと設定先AIに送られます。

設定なし・エラー・不正な出力時はテンプレートを保存します。キーはブラウザーへ送られません。プロバイダーから受け取るのは検証対象の文章インデックスだけで、年齢・国籍・職業・家族などを改変できません。結果はローカルセーブとサーバーの内容ハッシュ別ディスクキャッシュに保存します。再表示は生成を呼びません。

APIは127.0.0.1だけで待ち受けます。10リクエスト/分/IP、50万バイトの本文上限、10秒のプロバイダー期限、既定20回/プロセスのAI予算、同一人生の重複リクエスト抑止があります。公開運用には認証・永続ストレージ・分散レート制限とリバースプロキシを追加してください。静的ホスティングだけではAPIは起動しません。開発時に実際のAIキーを使用したテストは行っていません。

## What is implemented

- 一元化したイベント条件と排他条件、繰り返し間隔、死亡後の操作禁止。
- 国家IT採用と**選択式のAI面接イベント**（ライブLLM面接ではありません）。
- 幼少期のフラグが成人後の恩師・友人・秘密イベントに影響。隠しリスクも永続化。
- 42件の岐路イベント。旧版の100件の日常質問は選択キューから外し、年齢や生活状況に応じた日常ログと緩やかな能力成長に置き換えました。元の定義は参照用に保存しています。
- 結婚・離婚・死別、子と孫、事業売却、転落、慢性疾患、引退・再就職、介護、相続、晩年。
- 激レア3系統（総書記・任天堂・パリ/NYC市長）。資格取得と最後の採用/選出を分離し、生涯実績として保存。
- 585エンディングID：29成人職業×5資産帯×4家族状態 + 学生×5資産帯。学生の結婚等の不整合は除外。最終居住地・健康・家族の人数・過去の選択・実績も文章に反映。
- 乱数状態を含むv3保存検証、JSON書き出し/読み込み。旧キーを消去せず、v0.2データの自動移行はしません。
- 画像差し込み用 `ArtSlot`。新規グラフィックは今回追加していません。

## Validation and important limits

[検証結果](docs/VERIFICATION.md) / [機械可読シミュレーション結果](docs/simulation-results.json)

寿命は**WHO 2021・男女計の出生時平均余命72.6年に校正した合成年齢曲線**です。実測年齢別生命表でも1998年出生コホートの予測でもありません。健康・移住・事故等の補正係数もゲームの仮定です。[方法・出典・条件付き余命](docs/MORTALITY.md)を参照してください。

585件のIDマッピングと全30職業の生成遷移をテストしています。2,000人生のランダム方策で248結末・通常26職業を観測しました。激レア実績はこの標本では0件です。条件を満たした状態での成功と継続は個別テスト済みですが、全ID・全激レアルートの出生からの固定シード実例を発見したという意味ではありません。

[v0.2実コード監査](docs/AUDIT-v0.2.md) / [激レアルートと制度上の仮定](docs/RARE-ROUTES.md) / [変更履歴](CHANGELOG.md) / [残課題・グラフィック](docs/BACKLOG.md)

## Structure

| Path | Role |
|---|---|
| `src/engine.ts` | State, deterministic choices, scheduling, endings |
| `src/legacy-events.ts` | Preserved ZIP event narratives |
| `src/life-events.ts` | v0.3 conditions and new scenes |
| `src/daily-life.ts` | Contextual daily logs and gradual learning |
| `src/mortality.ts` | Calibration, hazards, conditional expectancy |
| `src/save.ts` | Versioned validation and persistence format |
| `src/simulation.ts` | Reproducible full-life random policy |
| `src/main.tsx`, `src/ArtSlot.tsx` | UI and future art hooks |
| `server/` | Optional AI composition, HTTP API and durable local cache |
| `scripts/simulate.ts` | Rebuild population report |

Named organizations and future events are fictionalized. No operational cybercrime or evasion instructions are provided.
