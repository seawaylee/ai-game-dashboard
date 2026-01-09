# Netlify Functions 测试命令

## 1. 测试 gemini-proxy 函数直接访问
```bash
curl -X POST https://ai.seawaylee.xin/.netlify/functions/gemini-proxy?model=gemini-3-flash-preview&action=generateContent \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [{
      "parts": [{
        "text": "Hello test"
      }]
    }]
  }'
```

**预期结果**：应该返回 Gemini API 的响应（或错误信息），不应该是 404。

---

## 2. 测试通过 redirect 访问（前端实际使用的路径）
```bash
curl -X POST https://ai.seawaylee.xin/api/gemini/gemini-3-flash-preview/generateContent \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [{
      "parts": [{
        "text": "Hello test"
      }]
    }]
  }'
```

**预期结果**：应该被 redirect 到 function，返回相同结果。

---

## 3. 测试 test-proxy（调试用）
```bash
curl https://ai.seawaylee.xin/.netlify/functions/test-proxy?model=gemini-3-flash-preview&action=generateContent
```

**预期结果**：返回调试信息，包括环境变量和预期会调用的 URL。

---

## 问题诊断

### 如果测试 1 成功，测试 2 失败
→ **Redirect 规则有问题**

### 如果测试 1 和 2 都失败
→ **Function 未正确部署** 或 **API_KEY 问题**

### 如果都成功但浏览器还是 404
→ **CORS 问题** 或 **浏览器特定问题**
