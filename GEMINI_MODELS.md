# Gemini API Model Reference

## ✅ Correct Model Names (v1beta API)

### Currently Configured

**Primary Model**: `gemini-1.5-flash`
- Fast, efficient responses
- Good for real-time chat interactions
- Lower cost

**Fallback Model**: `gemini-1.5-pro`
- More capable, higher quality
- Better for complex reasoning
- Higher cost but more reliable

## ❌ Invalid Model Names

These models **DO NOT** work with v1beta API:
- ❌ `gemini-1.5-flash-latest` → Use `gemini-1.5-flash`
- ❌ `gemini-1.0-pro` → Use `gemini-1.5-pro` or `gemini-pro`
- ❌ `gemini-pro` (deprecated) → Use `gemini-1.5-pro`

## 🔍 How to Find Available Models

Use the Google AI SDK to list available models:

```javascript
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

async function listModels() {
  const models = await genAI.listModels();
  models.forEach(model => {
    console.log(`Name: ${model.name}`);
    console.log(`Display Name: ${model.displayName}`);
    console.log(`Description: ${model.description}`);
    console.log('---');
  });
}

listModels();
```

Or check the official documentation:
- [Google AI SDK Documentation](https://ai.google.dev/gemini-api/docs/models)
- [Available Models](https://ai.google.dev/gemini-api/docs/models/gemini)

## 🎯 Model Capabilities

### gemini-1.5-flash
- **Speed**: Very fast
- **Cost**: Low
- **Best for**: Chat, Q&A, simple tasks
- **Token limit**: 1M context window
- **Rate limit**: 15 RPM (free tier)

### gemini-1.5-pro
- **Speed**: Moderate
- **Cost**: Higher
- **Best for**: Complex reasoning, analysis
- **Token limit**: 2M context window
- **Rate limit**: 2 RPM (free tier)

## 📝 Configuration

In `geminiService.js`:

```javascript
this.primaryModelId = "gemini-1.5-flash";      // ✅ Correct
this.fallbackModelId = "gemini-1.5-pro";       // ✅ Correct
```

## 🔄 Fallback Strategy

1. Try **gemini-1.5-flash** (fast, efficient)
2. If unavailable → **gemini-1.5-pro** (more capable)
3. If both fail → **Mock mode** (built-in responses)

## 🚨 Common Errors

### 404 Not Found
```
models/gemini-1.0-pro is not found for API version v1beta
```
**Fix**: Update to `gemini-1.5-flash` or `gemini-1.5-pro`

### 429 Too Many Requests
```
Quota exceeded for quota metric 'Generate Content API requests per minute'
```
**Fix**: System now auto-falls back to mock mode

## 📚 References

- [Gemini API Quickstart](https://ai.google.dev/gemini-api/docs/quickstart)
- [Model Versions](https://ai.google.dev/gemini-api/docs/models/gemini)
- [Pricing](https://ai.google.dev/pricing)
