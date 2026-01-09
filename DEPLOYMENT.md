# Netlify 部署指南

## 部署步骤

### 1. 推送代码到 Git
```bash
git add .
git commit -m "feat: Add Netlify Functions support for LingoCard backend"
git push
```

### 2. 在 Netlify Dashboard 配置环境变量

进入：**Site Settings** → **Environment Variables** → **Add a variable**

需要添加以下两个变量：

| Key | Value |
|-----|-------|
| `API_KEY` | `sk-s1K4y2PE60DSlBQtZcLgvncSrAipZDzSnEejomeNlFR0u5S4` |
| `TARGET_BASE_URL` | `https://api.34ku.com` |

⚠️ **重要**：
- 这些值**必须**设置在 Netlify Dashboard 中
- **不要**将实际的 API Key 提交到 Git
- `.env.example` 只是模板参考

### 3. 部署验证

部署成功后，检查：
- ✅ Functions 日志中有 `[Gemini Proxy]` / `[TTS Proxy]` 输出
- ✅ LingoCard 功能正常工作
- ✅ 浏览器 Network 面板中**看不到** API Key

## 本地开发

本地开发**无需任何改变**：

```bash
npm run dev
```

- 本地自动使用 Express 后端 (端口 3001)
- 所有功能照常工作

## 故障排除

### Functions 未运行
检查 Netlify 构建日志，确保 `netlify/functions/` 文件夹被正确识别。

### API_KEY 未生效
确认在 Netlify Dashboard 的 Environment Variables 中已设置 `API_KEY`。

### CORS 错误
检查 `netlify.toml` 中的 redirects 配置是否正确。
