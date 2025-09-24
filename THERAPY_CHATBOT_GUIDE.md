# Mental Health Therapy Chatbot - Gemini AI Integration

## Overview
The mental health app now includes an advanced AI-powered therapy chatbot using Google's Gemini API. The chatbot is designed to act as a supportive mental health counselor with empathetic responses and crisis detection capabilities.

## Features

### 🤖 AI-Powered Therapy Support
- **Professional Counselor Prompts**: Uses evidence-based therapeutic techniques (CBT, DBT, mindfulness)
- **Crisis Detection**: Automatically identifies and responds to crisis situations
- **Contextual Responses**: Maintains conversation context for meaningful dialogue
- **Sentiment Analysis**: Monitors emotional state and risk levels

### 🎯 Therapy-Focused Categories
- **Anxiety & Stress Management**: Breathing exercises, grounding techniques
- **Depression Support**: Mood tracking, motivation building
- **Relationship Issues**: Communication strategies, boundary setting
- **Self-Care & Coping**: Wellness routines, resilience building
- **Life Transitions**: Identity, purpose, uncertainty navigation
- **Crisis Intervention**: Immediate safety resources

### 🛡️ Safety Features
- **Immediate Crisis Resources**: Direct links to Tele-MANAS (14416) and Emergency (112)
- **Risk Assessment**: Continuous monitoring of user messages for safety concerns
- **Professional Boundaries**: Clear guidance to seek professional help when needed

### 📊 Session Insights
- **Conversation Patterns**: Identifies recurring themes and emotional patterns
- **Progress Tracking**: Highlights user strengths and growth markers
- **Personalized Recommendations**: Suggests coping strategies based on conversation history

## Setup Instructions

### For Mock/Demo Mode (Default)
The app works out of the box with enhanced mock responses. No API key required.

### For Real AI Integration

1. **Get a Gemini API Key**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account
   - Create a new API key
   - Copy the key

2. **Configure Environment**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env and add your API key
   VITE_GEMINI_API_KEY=your_actual_api_key_here
   ```

3. **Restart Development Server**
   ```bash
   npm run dev
   ```

## API Integration Details

### Gemini Service Architecture
```javascript
// Enhanced service with dual mode support
- MockTherapyGeminiService: Enhanced offline responses
- RealTherapyGeminiService: Live AI integration
- Automatic fallback if API key is missing or invalid
```

### Therapeutic System Prompts
The AI is configured with professional mental health guidelines:
- Empathetic, non-judgmental communication
- Evidence-based therapeutic techniques
- Crisis intervention protocols
- Cultural sensitivity (India-specific resources)
- Professional boundary maintenance

### Response Categories
- `greeting`: Welcome and initial engagement
- `crisis`: Immediate safety and crisis resources
- `anxiety`: Anxiety and panic support
- `depression`: Mood and motivation support
- `stress`: Overwhelm and pressure management
- `relationships`: Social and interpersonal support
- `coping`: Strategy building and skill development

## Testing the Chatbot

### Test Scenarios
1. **General Support**: "I'm feeling overwhelmed with college"
2. **Anxiety**: "I'm having panic attacks and can't breathe"
3. **Depression**: "I feel hopeless and empty inside"
4. **Crisis**: "I don't want to live anymore" (triggers safety resources)
5. **Positive**: "I'm feeling much better today"

### Expected Behaviors
- Empathetic, personalized responses
- Appropriate crisis intervention
- Contextual follow-up questions
- Session insights after several exchanges
- Professional therapeutic language

## India-Specific Localization
- **Tele-MANAS**: 14416 (24/7 mental health support)
- **KIRAN Helpline**: 1800-599-0019 (24/7 crisis support)
- **Emergency Services**: 112 (unified emergency)
- **CHILDLINE**: 1098 (child/adolescent support)
- **Women Helpline**: 181 (women in distress)

## Security & Privacy
- No conversation data is stored permanently
- API calls are made client-side
- Crisis detection prioritizes user safety
- Professional referral recommendations when appropriate

## Technical Implementation
- **React Hooks**: State management for conversations
- **Real-time Sentiment Analysis**: Message-by-message emotional assessment
- **Therapeutic Response Engine**: Context-aware reply generation
- **Session Management**: Conversation history and insights tracking
- **Crisis Detection System**: Keyword and pattern analysis for safety

The chatbot provides a professional-grade mental health support experience while maintaining appropriate boundaries and encouraging professional help when needed.