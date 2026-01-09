# AI游戏中心 🎮

一个统一的游戏启动平台，整合多个AI驱动的游戏项目。

## 项目结构

```
ai-game-dashboard/
├── index.html              # 主Dashboard页面
├── index.css               # Dashboard样式
├── package.json            # 根目录配置
├── aistudio-wuziqi/        # 我的世界-五子棋
├── minecraft-mario/        # 我的世界-马里奥
├── aistudio-calc/          # AI计算挑战 (即将推出)
└── ultramath/              # 终极数学 (即将推出)
```

## 快速开始

### 1. 安装依赖

```bash
npm run setup
```

这将自动安装所有可用游戏的依赖。

### 2. 启动Dashboard

```bash
npm run dev
```

浏览器将自动打开 `http://localhost:8080`，显示游戏选择界面。

### 3. 单独运行游戏

**五子棋游戏：**
```bash
npm run dev:wuziqi
```

**马里奥游戏：**
```bash
npm run dev:mario
```

## 游戏介绍

### ✅ 我的世界 - 五子棋 (MineGomoku)
- **技术栈:** React + TypeScript + Vite
- **特性:** 
  - 单人AI对战
  - 本地多人对战
  - Minecraft风格界面
  - 自定义方块样式
- **状态:** 可以游玩

### ✅ 我的世界 - 马里奥 (Minecraft Mario)
- **技术栈:** React + TypeScript + Vite + Gemini AI
- **特性:**
  - Gemini AI生成关卡
  - Minecraft主题平台游戏
  - 自定义角色选择
  - 复古音效
- **状态:** 可以游玩

### 🔜 AI计算挑战 (AI Studio Calc)
- **状态:** 即将推出

### 🔜 终极数学 (UltraMath)
- **状态:** 即将推出

## 开发说明

### 添加新游戏

1. 将游戏项目克隆到根目录
2. 在 `index.html` 中添加游戏卡片
3. 在 `package.json` 中添加对应的启动脚本
4. 生成游戏图标并放置在对应位置

### 技术栈

- **Dashboard:** 原生HTML + CSS + JavaScript
- **游戏:** React + TypeScript + Vite
- **服务器:** http-server
- **设计:** 渐变色、毛玻璃效果、动画过渡

## 浏览器支持

- Chrome (推荐)
- Firefox
- Safari
- Edge

## 许可证

MIT License

---

**由AI技术驱动** ⚡ **享受游戏乐趣** 🎮
