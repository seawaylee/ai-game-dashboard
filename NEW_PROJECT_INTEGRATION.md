# 新项目接入指南

本文档说明如何将新的子项目（游戏/应用）集成到 AI 游戏 Dashboard。

## 前置条件

新项目需要满足：
- 使用 Vite 或类似构建工具
- 有 `package.json` 和 `npm run dev`/`npm run build` 命令
- 构建输出到 `dist/` 目录

## 集成步骤

### 1. 项目结构

将新项目放置在根目录下：
```
ai-game-dashboard/
├── your-new-project/    # 新项目文件夹
│   ├── package.json
│   ├── src/
│   └── ...
├── package.json         # 根 package.json（需要修改）
├── index.html           # Dashboard 主页（需要修改）
└── assets/              # 图标资源（需要添加）
```

### 2. 配置端口（重要！）

**为避免端口冲突，必须为新项目分配唯一端口。**

当前已使用端口：
- 8080: Dashboard 主服务
- 5173: 五子棋
- 5174: 马里奥
- 5175: AI计算
- 5176: 终极数学
- 5177: 单词卡
- 3001: LingoCard 后端

在新项目的 `package.json` 中指定端口：
```json
{
  "scripts": {
    "dev": "vite --port 5178"  // 使用下一个可用端口
  }
}
```

### 3. 更新根 `package.json`

添加新项目到所有关键脚本中：

#### 开发脚本（dev）
```json
"dev": "npx -y concurrently -n \"Dashboard,五子棋,马里奥,AI计算,终极数学,单词卡,卡片后端,新项目\" -c \"bgBlue.bold,bgMagenta.bold,bgGreen.bold,bgYellow.bold,bgCyan.bold,bgRed.bold,bgWhite.bold,bgMagenta.bold\" \"npm run serve\" \"npm run dev:wuziqi\" \"npm run dev:mario\" \"npm run dev:calc\" \"npm run dev:ultramath\" \"npm run dev:lingocard\" \"npm run dev:lingocard-backend\" \"npm run dev:newproject\"",
```

#### 单独脚本
```json
"dev:newproject": "cd your-new-project && npm run dev",
```

#### 安装脚本
```json
"install:all": "... && npm run install:newproject",
"install:newproject": "cd your-new-project && npm install",
```

#### 构建脚本
```json
"build:newproject": "cd your-new-project && npm run build",
```

#### 主构建脚本（关键！）
在 `build` 脚本中添加：
```json
"build": "... && npm run build:newproject && ... && mkdir -p dist/your-new-project && cp -r your-new-project/dist/* dist/your-new-project/",
```

**⚠️ 常见错误：忘记将子项目加入主 build 脚本，导致 Netlify 部署后访问失败！**

### 4. 添加游戏卡片到 `index.html`

在 `<div class="games-grid">` 中添加新卡片：

```html
<!-- Game: 新项目 -->
<div class="game-card" onclick="launchGame('your-new-project')">
    <div class="card-content">
        <img src="assets/newproject.png" alt="新项目" class="game-icon">
        <h2 class="game-title">新项目标题</h2>
        <p class="game-description">
            项目描述，简要介绍功能和特色。
        </p>
        <span class="game-status status-ready">✓ 可以游玩</span>
    </div>
</div>
```

在 `<script>` 标签的 `gameConfig` 对象中添加配置：

```javascript
const gameConfig = {
    // ... 其他游戏配置 ...
    'your-new-project': {
        url: isLocal ? 'http://localhost:5178' : 'your-new-project/',
        name: '新项目名称',
        command: 'npm run dev:newproject'
    }
};
```

### 5. 添加游戏图标

在 `assets/` 目录中添加图标文件：
```
assets/newproject.png   (建议 256x256px)
```

### 6. 更新 Netlify 配置（部署必需！）

在 `netlify.toml` 的 **sub-app redirects** 部分添加（在 catch-all 之前）：

```toml
[[redirects]]
  from = "/your-new-project/*"
  to = "/your-new-project/index.html"
  status = 200
```

**⚠️ 务必放在 `from = "/*"` 的 catch-all 规则之前！**

### 7. 测试集成

#### 本地测试
```bash
npm run install:all
npm run dev
```

访问 http://localhost:8080，点击新项目卡片，应该跳转到 http://localhost:5178

#### 构建测试
```bash
npm run build
```

检查 `dist/your-new-project/` 目录是否存在且包含构建文件。

### 8. 提交并部署

```bash
git add .
git commit -m "feat: Add [项目名] integration"
git push
```

Netlify 会自动触发部署。

## 检查清单

在提交前确认：

- [ ] 新项目有唯一的端口号
- [ ] `package.json` 中添加了所有脚本（dev、install、build）
- [ ] **主 `build` 脚本包含了子项目构建和复制**
- [ ] `index.html` 中添加了游戏卡片和 `gameConfig`
- [ ] `assets/` 中添加了项目图标
- [ ] `netlify.toml` 中添加了 redirect 规则（在 catch-all 之前）
- [ ] 本地 `npm run dev` 测试通过
- [ ] 本地 `npm run build` 能成功构建

## 常见问题

### Q: 部署后点击新项目显示 Dashboard 页面
**A:** 检查 `netlify.toml` 中的 redirect 顺序，确保子项目的规则在 `/*` 之前。

### Q: 部署后新项目 404
**A:** 检查主 `build` 脚本是否包含了 `npm run build:newproject` 和 `cp -r ... dist/...`。

### Q: 端口冲突
**A:** 参考"配置端口"部分，使用唯一的端口号（当前最大是 5177，下一个用 5178）。

### Q: Concurrently 无法启动
**A:** 检查 `dev` 脚本中的名称和颜色数量是否匹配所有子命令数量。

## 参考示例

查看 LingoCard 的集成作为完整示例：
- `lingocard-genai/package.json` - 端口配置
- `package.json` - 脚本集成
- `index.html` - 卡片和配置
- `netlify.toml` - Redirect 规则
