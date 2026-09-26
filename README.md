# RUtype for ZeppOS (SlavType)

[中文](#中文) ｜ [日本語](#日本語) ｜ [English](#english)

## 中文

SlavType 是一个给 ZeppOS 手表用的俄语输入法。ZeppOS 原生不支持西里尔字母输入，这个应用就是补上这块。在手表上遇到需要打字的地方（比如搜索、备注），可以切换到这个键盘输入俄语。

### 做了什么

ZeppOS 的输入法是通过 Data Widget 实现的。这个项目包含两部分：

1. **主页面（page）**：引导用户完成三步设置。第一步去系统设置里启用 SlavType 输入法，第二步切到 SlavType，第三步可以打开测试输入界面试一下。
2. **键盘 widget（data-widget）**：真正弹出来的键盘界面。三行俄语字母布局，带 shift 三态切换（小写 → 单次大写 → 大写锁定）、退格、空格、确认键，左下角是地球图标用来切换其他输入法。

键盘会根据手表屏幕形状自动适配：圆屏和方屏各有一套布局文件。

### 键盘布局

```
й ц у к е н г ш щ з х ъ
ф ы в а п р о л д ж э
я ч с м и т ь б ю  ⇧  ⌫
              🌐  Пробел  ✓
```

shift 键按三次循环：小写 → 单次大写（下一个字母后自动回到小写）→ 大写锁定。

### 技术信息

- 运行时：ZeppOS API 4.0 兼容，目标 4.0，最低 4.2
- 语言：JavaScript
- appId: 1099540
- 需要的权限：`device:os.input.method`（输入法）、`data:os.device.info`（设备信息）
- 支持的屏幕：方屏（480px 宽）和圆屏（480px 宽）

### 项目结构

```
├── app.js                    # 应用入口
├── app.json                  # ZeppOS 配置（appId、权限、布局声明）
├── page/
│   └── index.js              # 设置引导页面（启用 → 切换 → 测试）
├── data-widget/
│   ├── index.page.js         # 键盘 widget 逻辑（按键、shift、输入提交）
│   ├── index.layout.js       # 共享布局样式
│   ├── index.r.layout.js     # 圆屏布局
│   └── index.s.layout.js     # 方屏布局
├── assets/                   # 图标资源
└── package.json
```

### 构建和运行

需要 ZeppOS 开发环境（Zepp Studio 或命令行工具）。用 Zepp Studio 打开项目，连接手表或模拟器后推送运行。

测试：

```bash
npm test
```

### 许可证

MIT License，详见 [LICENSE](LICENSE)。

---

## 日本語

SlavType は ZeppOS ウォッチ向けのロシア語入力アプリです。ZeppOS はネイティブでキリル文字入力をサポートしていないので、このアプリがその穴埋めをします。ウォッチ上でテキスト入力が必要な場面（検索、メモなど）で、このキーボードに切り替えてロシア語を入力できます。

### やっていること

ZeppOS の入力メソッドは Data Widget として実装されます。このプロジェクトは2つの部分から構成されています：

1. **メインページ（page）**：3ステップのセットアップガイド。最初にシステム設定で SlavType 入力を有効化し、次に SlavType に切り替え、最後にテスト入力画面で動作確認します。
2. **キーボードウィジェット（data-widget）**：実際にポップアップするキーボード画面。3行のロシア語文字レイアウトで、シフトの3状態切り替え（小文字 → 1回大文字 → 大写ロック）、バックスペース、スペース、確認キー付き。左下の地球アイコンで他の入力メソッドに切り替えます。

キーボードはウォッチの画面形状に合わせて自動で調整されます。丸型画面と角型画面で別々のレイアウトファイルを持っています。

### キーボード配列

```
й ц у к е н г ш щ з х ъ
ф ы в а п р о л д ж э
я ч с м и т ь б ю  ⇧  ⌫
              🌐  Пробел  ✓
```

シフトキーは3回押すごとに循環します：小文字 → 1回だけ大文字（次の文字の後に自動で小文字に戻る）→ 大写ロック。

### 技術情報

- ランタイム：ZeppOS API 4.0 互換、ターゲット 4.0、最小 4.2
- 言語：JavaScript
- appId: 1099540
- 必要な権限：`device:os.input.method`（入力メソッド）、`data:os.device.info`（デバイス情報）
- 対応画面：角型（幅 480px）と丸型（幅 480px）

### プロジェクト構成

```
├── app.js                    # アプリエントリー
├── app.json                  # ZeppOS 設定（appId、権限、レイアウト宣言）
├── page/
│   └── index.js              # セットアップガイドページ（有効化 → 切り替え → テスト）
├── data-widget/
│   ├── index.page.js         # キーボードウィジェットロジック（キー処理、シフト、入力確定）
│   ├── index.layout.js       # 共通レイアウトスタイル
│   ├── index.r.layout.js     # 丸型画面レイアウト
│   └── index.s.layout.js     # 角型画面レイアウト
├── assets/                   # アイコンリソース
└── package.json
```

### ビルドと実行

ZeppOS 開発環境（Zepp Studio または CLI ツール）が必要です。Zepp Studio でプロジェクトを開き、ウォッチまたはエミュレータに接続してプッシュ実行します。

テスト：

```bash
npm test
```

### ライセンス

MIT License。詳細は [LICENSE](LICENSE) を参照してください。

---

## English

SlavType is a Russian input method for ZeppOS watches. ZeppOS does not support Cyrillic input out of the box, so this app fills that gap. Whenever you need to type on the watch (search, notes, etc.), you can switch to this keyboard and type in Russian.

### What it does

ZeppOS input methods are implemented as data widgets. This project has two parts:

1. **Main page (page)**: a three-step setup wizard. Step one enables SlavType in system settings, step two switches to SlavType, step three opens a test input screen.
2. **Keyboard widget (data-widget)**: the actual keyboard that pops up. Three rows of Russian letters, with a three-state shift toggle (lowercase, single uppercase, caps lock), backspace, space, and confirm. A globe key in the bottom left switches to other input methods.

The keyboard adapts to the watch screen shape. Separate layout files exist for round and square displays.

### Keyboard layout

```
й ц у к е н г ш щ з х ъ
ф ы в а п р о л д ж э
я ч с м и т ь б ю  ⇧  ⌫
              🌐  Пробел  ✓
```

The shift key cycles through three states: lowercase, single uppercase (auto-reverts after one letter), and caps lock.

### Technical details

- Runtime: ZeppOS API 4.0 compatible, target 4.0, minimum 4.2
- Language: JavaScript
- appId: 1099540
- Permissions: `device:os.input.method` (input method), `data:os.device.info` (device info)
- Supported screens: square (480px width) and round (480px width)

### Project structure

```
├── app.js                    # App entry point
├── app.json                  # ZeppOS config (appId, permissions, layout declarations)
├── page/
│   └── index.js              # Setup wizard page (enable, switch, test)
├── data-widget/
│   ├── index.page.js         # Keyboard widget logic (key handling, shift, commit)
│   ├── index.layout.js       # Shared layout styles
│   ├── index.r.layout.js     # Round screen layout
│   └── index.s.layout.js     # Square screen layout
├── assets/                   # Icon assets
└── package.json
```

### Build and run

You need a ZeppOS development environment (Zepp Studio or the CLI tools). Open the project in Zepp Studio, connect your watch or emulator, and push to run.

Tests:

```bash
npm test
```

### License

MIT License. See [LICENSE](LICENSE) for details.
