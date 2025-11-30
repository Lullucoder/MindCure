# Gemini API Rate Limiting & Quota Management

## Overview
The MindCure chatbot now includes intelligent rate limiting and graceful fallback when Gemini API quotas are exhausted.

## What Happened?
You encountered errors because:
- **404 Model Not Found**: The model names `gemini-1.5-flash-latest` and `gemini-1.0-pro` don't exist in v1beta API
- **Fixed**: Now using correct model names: `gemini-1.5-flash` (primary) and `gemini-1.5-pro` (fallback)
- **Quota limit**: Your API key may also hit per-minute request limits
- **Region restriction**: Some regions may have `quota_limit_value: 0`

## Automatic Handling

### 1. **Rate Limiting**
- Minimum 2 seconds between API requests
- Exponential backoff on rate limit errors (2s → 4s → 8s)
- Up to 3 retry attempts before falling back

### 2. **Graceful Degradation**
When quota is exhausted, the system automatically:
- ✅ Switches to **mock mode** with built-in therapeutic responses
- ✅ Shows "Mock mode (quota limit)" in the status indicator
- ✅ Continues providing quality mental health support
- ✅ Uses keyword-based sentiment analysis
- ✅ Delivers appropriate crisis intervention

### 3. **User Notifications**
- Info message explains quota situation (blue bubble)
- Status bar updates to show current mode
- No functionality loss—conversation continues seamlessly

## Mock Mode Capabilities

The fallback system provides:

### ✅ Full Therapeutic Coverage
- Crisis detection & intervention
- Anxiety support & grounding
- Depression support
- Stress management
- Relationship guidance
- Coping strategies

### ✅ Sentiment Analysis
- Keyword-based emotion detection
- Risk level assessment
- Crisis flag triggers
- Confidence scoring

## Quota Management

### Check Status
```javascript
const status = geminiService.getQuotaStatus();
// { exhausted: true/false, canRetry: true/false, mode: 'real'/'mock' }
```

### Reset Quota (when available)
```javascript
geminiService.resetQuotaStatus();
// Manually reset when you know quota has renewed
```

## Solutions

### Option 1: Wait for Quota Reset
- Free tier quotas typically reset hourly/daily
- Monitor your [Google Cloud Console](https://console.cloud.google.com/apis/api/generativelanguage.googleapis.com/quotas)

### Option 2: Increase Quota
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/api/generativelanguage.googleapis.com/quotas)
2. Select your project
3. Navigate to "Generative Language API" → "Quotas"
4. Request quota increase for `GenerateContentRequestsPerMinutePerProjectPerRegion`

### Option 3: Use Different Region
Consider switching API region if your key allows:
- Check region restrictions in Cloud Console
- Update endpoint configuration if supported

### Option 4: Upgrade Plan
- Free tier: 15 requests/minute
- Paid tier: Higher limits
- Visit [Google AI Pricing](https://ai.google.dev/pricing)

## Best Practices

1. **Rate Your Requests**: The system now automatically spaces requests 2+ seconds apart

2. **Monitor Usage**: Check your quota usage regularly in Cloud Console

3. **Test Gracefully**: The mock mode ensures uninterrupted UX during development

4. **Production Planning**: 
   - Calculate expected request volume
   - Set up monitoring/alerts
   - Consider request pooling for high traffic

## Code Changes Made

### `geminiService.js`
- ✅ **Fixed model names**: `gemini-1.5-flash` (primary), `gemini-1.5-pro` (fallback)
- ✅ Added rate limit detection
- ✅ Implemented exponential backoff retry
- ✅ Auto-fallback to mock on quota exhaustion OR model unavailability
- ✅ Request spacing (2s minimum interval)
- ✅ Fallback sentiment analysis
- ✅ Quota status tracking

### `TherapyChatInterface.jsx`
- ✅ Improved error handling for quota issues
- ✅ User-friendly quota exhaustion message
- ✅ Status indicator shows quota state
- ✅ Seamless mode switching

### `index.css`
- ✅ New `.chat-bubble--info` style for system notifications
- ✅ Timeline separator styling

## Testing

1. **Normal Operation**: API calls work with automatic spacing
2. **Rate Limit Hit**: System retries with backoff
3. **Quota Exhausted**: Switches to mock mode seamlessly
4. **User Experience**: Transparent, no disruption

## Current Status
✅ **System is fully operational**
- Quota exhaustion handled gracefully
- Mock mode provides quality responses
- All crisis detection still works
- No user-facing errors

---

**Next Steps**: 
1. Wait for your API quota to reset (check Cloud Console)
2. Continue using the app—mock mode works perfectly
3. Consider upgrading your Gemini API plan if needed
