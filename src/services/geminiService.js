import { GoogleGenerativeAI } from "@google/generative-ai";

// --- ENHANCED THERAPY-FOCUSED IMPLEMENTATION ---
const MOCK_DELAY = 1200; // Simulate thoughtful AI response time

// Professional mental health counselor responses
const therapyResponses = {
  // Greeting and initial engagement
  greeting: [
    "Hello, I'm here to provide a safe space for you to share your thoughts and feelings. How are you doing today?",
    "Welcome. I appreciate you taking this step to reach out. What's on your mind right now?",
    "Hi there. I'm here to listen and support you. How has your day been treating you?",
  ],
  
  // Crisis intervention responses
  crisis: [
    "I'm deeply concerned about what you're sharing with me. Your safety is the most important thing right now. Please consider calling Tele-MANAS at 14416 immediately - they're available 24/7. You don't have to go through this alone. Would you like me to help you think through some immediate safety steps?",
    "What you're feeling right now is incredibly painful, and I want you to know that reaching out shows tremendous strength. Please contact emergency services at 112 or Tele-MANAS at 14416 right away. Your life has value and meaning. Can we talk about what immediate support you have available?",
  ],
  
  // Anxiety and panic support
  anxiety: [
    "I can hear that you're experiencing anxiety, and that can feel overwhelming. Let's try grounding together. Can you name 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste?",
    "Anxiety can make us feel like we're losing control. You're safe right now. Let's focus on your breathing - inhale slowly for 4 counts, hold for 4, then exhale for 6. What physical sensations are you noticing in your body?",
    "Thank you for sharing about your anxiety. It takes courage to acknowledge these feelings. What typically helps you feel more grounded when anxiety arises? Have you noticed any patterns in what triggers these feelings?",
  ],
  
  // Depression and low mood support
  depression: [
    "I hear the heaviness in what you're sharing, and I want you to know that these feelings are valid. Depression can make everything feel difficult. What's one small thing you've managed to do for yourself today, even if it seems insignificant?",
    "Depression often tells us lies about our worth and our future. You've shown strength by reaching out today. Sometimes healing happens in very small steps. What feels most challenging for you right now?",
    "I appreciate you trusting me with these difficult feelings. When you're experiencing depression, even basic tasks can feel monumental. Have you been able to maintain any routines, even small ones?",
  ],
  
  // Stress and overwhelm
  stress: [
    "It sounds like you're carrying a lot right now. Stress can feel all-consuming. Let's try to break this down - what feels like the most pressing concern you're facing today?",
    "Feeling overwhelmed is completely understandable when there's a lot on your plate. Sometimes it helps to identify what's within our control versus what isn't. What aspects of your current situation feel most manageable to you?",
    "Stress affects us physically and emotionally. I'm curious about how you're caring for yourself during this difficult time. What has helped you cope with stress in the past?",
  ],
  
  // Relationship and social issues
  relationships: [
    "Relationships can be one of our greatest sources of both joy and pain. It sounds like you're navigating something difficult. What aspects of this relationship situation feel most important to you?",
    "Thank you for sharing about your relationship concerns. These situations can be complex and emotionally draining. How are you taking care of your own emotional needs during this time?",
    "Human connections are so important, and when they're strained, it can feel very isolating. What kind of support are you hoping for in this relationship situation?",
  ],
  
  // General supportive responses
  support: [
    "I hear you, and what you're experiencing sounds really difficult. You don't have to navigate this alone. What feels most important for you to talk about right now?",
    "Thank you for sharing that with me. It takes courage to be vulnerable about our struggles. How long have you been dealing with these feelings?",
    "I appreciate your openness in sharing this. Everyone's experience is unique, and your feelings are completely valid. What would feel most helpful for you right now?",
  ],
  
  // Coping and resilience building
  coping: [
    "It sounds like you're looking for ways to cope with what you're experiencing. That's a positive step. What coping strategies have you tried before, and how did they work for you?",
    "Building coping skills is an ongoing process, and it's different for everyone. Some people find breathing exercises helpful, others prefer physical activity or creative expression. What tends to bring you a sense of calm or relief?",
    "I'm glad you're thinking about healthy ways to manage these feelings. Self-care isn't selfish - it's necessary. What activities or practices usually help you feel more centered?",
  ],
};

// Enhanced response selection with context awareness
const getTherapeuticResponse = (userMessage, conversationHistory = []) => {
  const message = userMessage.toLowerCase();
  const words = message.split(' ');
  
  // Crisis detection (highest priority)
  const crisisKeywords = ['suicide', 'kill myself', 'end it all', 'hurt myself', 'don\'t want to live', 'self harm', 'better off dead', 'ending my life'];
  if (crisisKeywords.some(keyword => message.includes(keyword))) {
    return {
      response: therapyResponses.crisis[Math.floor(Math.random() * therapyResponses.crisis.length)],
      category: 'crisis',
      needsAttention: true
    };
  }
  
  // Greeting detection
  if (message.includes('hello') || message.includes('hi') || message.includes('hey') || conversationHistory.length === 0) {
    return {
      response: therapyResponses.greeting[Math.floor(Math.random() * therapyResponses.greeting.length)],
      category: 'greeting',
      needsAttention: false
    };
  }
  
  // Anxiety detection
  const anxietyKeywords = ['anxious', 'anxiety', 'panic', 'worried', 'nervous', 'overwhelmed', 'racing thoughts', 'can\'t breathe'];
  if (anxietyKeywords.some(keyword => message.includes(keyword))) {
    return {
      response: therapyResponses.anxiety[Math.floor(Math.random() * therapyResponses.anxiety.length)],
      category: 'anxiety',
      needsAttention: false
    };
  }
  
  // Depression detection
  const depressionKeywords = ['depressed', 'depression', 'sad', 'hopeless', 'empty', 'worthless', 'tired', 'no energy', 'can\'t get out of bed'];
  if (depressionKeywords.some(keyword => message.includes(keyword))) {
    return {
      response: therapyResponses.depression[Math.floor(Math.random() * therapyResponses.depression.length)],
      category: 'depression',
      needsAttention: false
    };
  }
  
  // Stress detection
  const stressKeywords = ['stressed', 'stress', 'pressure', 'burden', 'too much', 'can\'t handle', 'breaking point'];
  if (stressKeywords.some(keyword => message.includes(keyword))) {
    return {
      response: therapyResponses.stress[Math.floor(Math.random() * therapyResponses.stress.length)],
      category: 'stress',
      needsAttention: false
    };
  }
  
  // Relationship issues
  const relationshipKeywords = ['relationship', 'partner', 'boyfriend', 'girlfriend', 'family', 'friends', 'lonely', 'isolated', 'conflict'];
  if (relationshipKeywords.some(keyword => message.includes(keyword))) {
    return {
      response: therapyResponses.relationships[Math.floor(Math.random() * therapyResponses.relationships.length)],
      category: 'relationships',
      needsAttention: false
    };
  }
  
  // Coping strategies
  const copingKeywords = ['cope', 'coping', 'help', 'strategies', 'what should i do', 'how do i', 'advice'];
  if (copingKeywords.some(keyword => message.includes(keyword))) {
    return {
      response: therapyResponses.coping[Math.floor(Math.random() * therapyResponses.coping.length)],
      category: 'coping',
      needsAttention: false
    };
  }
  
  // Default supportive response
  return {
    response: therapyResponses.support[Math.floor(Math.random() * therapyResponses.support.length)],
    category: 'support',
    needsAttention: false
  };
};


// Enhanced Mock Service for Therapy (offline mode)
class MockTherapyGeminiService {
  constructor() {
    console.log("TherapyGeminiService is running in ENHANCED OFFLINE mode for mental health support.");
    this.conversationContext = [];
    this.sessionInsights = {
      dominantThemes: [],
      riskLevel: 'low',
      sessionNumber: 1
    };
    this.mode = 'mock';
    this.modeLabel = 'Offline therapeutic simulator';
  }

  async generateResponse(userMessage, conversationHistory = []) {
    return new Promise(resolve => {
      setTimeout(() => {
        // Store conversation context for continuity
        this.conversationContext = conversationHistory;
        
        const therapeuticResponse = getTherapeuticResponse(userMessage, conversationHistory);
        
        // Update session insights
        this.updateSessionInsights(therapeuticResponse.category, therapeuticResponse.needsAttention);
        
        resolve({
          response: therapeuticResponse.response,
          category: therapeuticResponse.category,
          needsAttention: therapeuticResponse.needsAttention,
          sessionInsights: this.sessionInsights
        });
      }, MOCK_DELAY);
    });
  }

  async analyzeSentiment(message) {
    return new Promise(resolve => {
      setTimeout(() => {
        const message_lower = message.toLowerCase();
        let sentiment = 'neutral';
        let confidence = 0.7;
        let needsAttention = false;
        let riskLevel = 'low';
        
        // Crisis indicators
        const crisisWords = ['suicide', 'kill myself', 'end it all', 'hurt myself', 'want to die'];
        if (crisisWords.some(word => message_lower.includes(word))) {
          sentiment = 'crisis';
          confidence = 0.95;
          needsAttention = true;
          riskLevel = 'high';
        }
        // Negative sentiment indicators
        else if (message_lower.includes('depressed') || message_lower.includes('hopeless') || 
                 message_lower.includes('worthless') || message_lower.includes('empty')) {
          sentiment = 'negative';
          confidence = 0.85;
          needsAttention = true;
          riskLevel = 'medium';
        }
        // Anxiety indicators
        else if (message_lower.includes('anxious') || message_lower.includes('panic') || 
                 message_lower.includes('worried') || message_lower.includes('scared')) {
          sentiment = 'anxious';
          confidence = 0.8;
          needsAttention = false;
          riskLevel = 'low-medium';
        }
        // Positive indicators
        else if (message_lower.includes('better') || message_lower.includes('good') || 
                 message_lower.includes('happy') || message_lower.includes('grateful')) {
          sentiment = 'positive';
          confidence = 0.75;
          needsAttention = false;
          riskLevel = 'low';
        }
        
        resolve({ 
          sentiment, 
          confidence, 
          needsAttention, 
          riskLevel,
          emotionalMarkers: this.extractEmotionalMarkers(message)
        });
      }, MOCK_DELAY / 2);
    });
  }

  updateSessionInsights(category, needsAttention) {
    // Track dominant themes
    if (!this.sessionInsights.dominantThemes.includes(category)) {
      this.sessionInsights.dominantThemes.push(category);
    }
    
    // Update risk level
    if (needsAttention && this.sessionInsights.riskLevel === 'low') {
      this.sessionInsights.riskLevel = 'medium';
    }
  }

  extractEmotionalMarkers(message) {
    const markers = [];
    const emotionMap = {
      'sad': ['sad', 'crying', 'tears', 'heartbroken'],
      'angry': ['angry', 'mad', 'furious', 'rage', 'hate'],
      'anxious': ['anxious', 'nervous', 'worried', 'scared', 'panic'],
      'hopeful': ['hope', 'better', 'improving', 'optimistic'],
      'grateful': ['grateful', 'thankful', 'appreciate', 'blessed']
    };
    
    Object.entries(emotionMap).forEach(([emotion, words]) => {
      if (words.some(word => message.toLowerCase().includes(word))) {
        markers.push(emotion);
      }
    });
    
    return markers;
  }

  getMode() {
    return {
      type: this.mode,
      label: this.modeLabel,
      model: 'mindcure-offline-companion'
    };
  }

  getActiveModelId() {
    return 'mindcure-offline-companion';
  }

  async generateCopingStrategies(mood, situation) {
    return new Promise(resolve => {
      setTimeout(() => {
        const strategies = {
          'anxious': [
            "Try the 4-7-8 breathing technique: Inhale for 4, hold for 7, exhale for 8",
            "Practice progressive muscle relaxation, tensing and releasing each muscle group",
            "Use the 5-4-3-2-1 grounding technique: Name 5 things you see, 4 you hear, 3 you touch, 2 you smell, 1 you taste",
            "Take a warm shower or bath to help your nervous system calm down",
            "Listen to a guided meditation or calming music"
          ],
          'depressed': [
            "Take a short 5-10 minute walk, even if it's just around your room or house",
            "Write down three small things you're grateful for today",
            "Reach out to one person you trust - even a simple text message",
            "Do one small act of self-care: brush your teeth, wash your face, or make a cup of tea",
            "Set a very small, achievable goal for today and celebrate when you complete it"
          ],
          'stressed': [
            "Break down your current stressors into 'can control' and 'cannot control' lists",
            "Try a 10-minute body scan meditation to release physical tension",
            "Write in a journal about what's overwhelming you right now",
            "Do something creative with your hands: drawing, crafting, or playing an instrument",
            "Take breaks every hour to stretch and breathe deeply"
          ],
          'angry': [
            "Use physical exercise to release the energy: do jumping jacks, pushups, or go for a run",
            "Practice expressing your anger through writing - don't hold back",
            "Try the 'STOP' technique: Stop, Take a breath, Observe your feelings, Proceed mindfully",
            "Use cold water on your face or hold ice cubes to activate your vagus nerve",
            "Talk to someone you trust about what's making you angry"
          ],
          'lonely': [
            "Reach out to one person from your past - send a message or make a call",
            "Join an online community or forum related to your interests",
            "Do something kind for someone else - volunteer or help a neighbor",
            "Visit a public space like a library, café, or park to be around people",
            "Practice self-compassion - treat yourself as you would a good friend"
          ],
          'default': [
            "Take 10 deep, conscious breaths, focusing only on the sensation of breathing",
            "Write in a journal about your current thoughts and feelings",
            "Do a brief mindfulness exercise: focus on the present moment",
            "Engage in gentle physical movement that feels good to your body",
            "Practice a loving-kindness meditation, starting with yourself"
          ]
        };
        
        const moodStrategies = strategies[mood] || strategies['default'];
        resolve(moodStrategies);
      }, MOCK_DELAY / 2);
    });
  }

  async generateTherapyInsights(conversationHistory) {
    return new Promise(resolve => {
      setTimeout(() => {
        const insights = {
          patterns: ["You've mentioned feeling anxious several times", "Work stress seems to be a recurring theme"],
          strengths: ["You're showing great self-awareness", "You're actively seeking help and coping strategies"],
          recommendations: ["Consider practicing mindfulness daily", "It might help to establish a regular sleep routine"],
          progressMarkers: ["You're more open about your feelings than in earlier sessions"]
        };
        resolve(insights);
      }, MOCK_DELAY);
    });
  }
}

// Real Gemini API Service (when API key is available)
class RealTherapyGeminiService {
  constructor() {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('Gemini API key not found');
    }
    
  this.genAI = new GoogleGenerativeAI(apiKey);
  // Maintain a cascade of model identifiers so we can gracefully fall back when some are unavailable
  // Updated model names for current Gemini API (as of late 2025)
  this.modelCandidates = [
    "gemini-2.0-flash",          // Latest fast model (free tier)
    "gemini-1.5-flash-8b",       // Lighter version
    "gemini-1.5-flash",          // Standard flash
    "gemini-1.5-pro",            // Pro version
  ];
  this.modelCursor = 0;
  this.maxRetryAttempts = this.modelCandidates.length;
  this.modelIdInUse = this.modelCandidates[this.modelCursor];
  this.model = this.genAI.getGenerativeModel({ model: this.modelIdInUse });
  this.mode = 'real';
  this.modeLabel = `Gemini live therapeutic model (${this.modelIdInUse})`;
  
  // Rate limit handling
  this.rateLimitHit = false;
  this.quotaExhausted = false;
  this.lastRequestTime = 0;
  this.minRequestInterval = 2000; // 2 seconds between requests
  this.requestQueue = [];
  this.isProcessingQueue = false;
    
    // Professional mental health system prompt
    this.systemPrompt = `You are a compassionate, professional mental health counselor AI assistant designed to provide therapeutic support. Your responses should be:

THERAPEUTIC APPROACH:
- Use active listening and reflective responses
- Employ evidence-based therapeutic techniques (CBT, DBT, mindfulness)
- Validate emotions while encouraging healthy coping
- Ask open-ended questions to promote self-reflection
- Maintain professional boundaries

SAFETY PROTOCOLS:
- IMMEDIATE CRISIS: If someone expresses suicidal ideation or self-harm, prioritize safety. Direct them to call Tele-MANAS at 14416 (India's 24/7 mental health helpline) or emergency services at 112.
- Never provide medical diagnoses or prescribe medication
- Encourage professional help when appropriate
- Recognize your limitations as an AI

COMMUNICATION STYLE:
- Warm, empathetic, non-judgmental
- Use person-first language
- Avoid clinical jargon; use accessible language
- Respect cultural contexts (user is in India)
- Maintain hope while acknowledging struggles

FOCUS AREAS:
- Anxiety and stress management
- Depression and mood support  
- Relationship and social issues
- Coping skill development
- Emotional regulation
- Self-care and wellness

Remember: You're providing support, not treatment. Always encourage professional help when needed.`;
  }

  isModelNotFoundError(error) {
    if (!error) return false;
    const message = (error.message || "").toLowerCase();
    const details = (error.statusText || "").toLowerCase();
    return (
      (message.includes('not found') || message.includes('404')) &&
      (message.includes('models/') || message.includes('is not found for api'))
    ) || details.includes('not found');
  }

  getNextModelId() {
    if (this.modelCursor < this.modelCandidates.length - 1) {
      this.modelCursor += 1;
      return this.modelCandidates[this.modelCursor];
    }
    return null;
  }

  isRateLimitError(error) {
    if (!error) return false;
    const message = (error.message || "").toLowerCase();
    return message.includes('429') || 
           message.includes('rate limit') || 
           message.includes('quota exceeded') ||
           message.includes('too many requests');
  }

  async waitForRateLimit() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.minRequestInterval) {
      const waitTime = this.minRequestInterval - timeSinceLastRequest;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    this.lastRequestTime = Date.now();
  }

  async withModelRetry(executor, context = 'gemini-call', attempt = 1, maxAttempts = null) {
    const effectiveMaxAttempts = maxAttempts ?? this.maxRetryAttempts;
    try {
      // Check if quota is exhausted
      if (this.quotaExhausted) {
        throw new Error('QUOTA_EXHAUSTED');
      }

      // Wait for rate limit
      await this.waitForRateLimit();

      return await executor();
    } catch (error) {
      // Handle rate limit errors
      if (this.isRateLimitError(error)) {
        console.warn(`[Gemini] ${context}: Rate limit hit (attempt ${attempt}/${effectiveMaxAttempts})`);
        
        if (attempt < effectiveMaxAttempts) {
          // Exponential backoff: 2s, 4s, 8s
          const backoffTime = Math.pow(2, attempt) * 1000;
          console.log(`[Gemini] Waiting ${backoffTime}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, backoffTime));
          return this.withModelRetry(executor, context, attempt + 1, effectiveMaxAttempts);
        } else {
          // Quota exhausted - switch to mock mode
          console.error(`[Gemini] ${context}: Quota exhausted after ${effectiveMaxAttempts} attempts. Falling back to mock mode.`);
          this.quotaExhausted = true;
          this.mode = 'mock';
          this.modeLabel = 'Mock mode (quota exhausted)';
          throw new Error('QUOTA_EXHAUSTED');
        }
      }

      // Handle model not found errors
      if (this.isModelNotFoundError(error)) {
        const nextModelId = this.getNextModelId();

        if (nextModelId) {
          console.warn(`[Gemini] ${context}: primary model "${this.modelIdInUse}" unavailable. Switching to fallback "${nextModelId}".`);
          this.modelIdInUse = nextModelId;
          this.model = this.genAI.getGenerativeModel({ model: this.modelIdInUse });
          this.modeLabel = `Gemini fallback therapeutic model (${this.modelIdInUse})`;
          return this.withModelRetry(executor, context, attempt + 1, effectiveMaxAttempts);
        } else {
          // All models failed - switch to mock mode
          console.error(`[Gemini] ${context}: All models unavailable. Falling back to mock mode.`);
          this.quotaExhausted = true;
          this.mode = 'mock';
          this.modeLabel = 'Mock mode (models unavailable)';
          throw new Error('MODELS_UNAVAILABLE');
        }
      }

      throw error;
    }
  }

  async generateResponse(userMessage, conversationHistory = []) {
    try {
      // Build conversation context
      const contextMessages = conversationHistory
        .slice(-8) // Keep last 8 messages for context
        .map(msg => `${msg.role}: ${msg.content}`)
        .join('\n');

      const fullPrompt = `${this.systemPrompt}\n\nPrevious conversation:\n${contextMessages}\n\nUser: ${userMessage}\n\nCounselor:`;

      const text = await this.withModelRetry(async () => {
        const result = await this.model.generateContent(fullPrompt);
        const response = await result.response;
        return response.text();
      }, 'generateResponse');

      let sentiment;
      try {
        sentiment = await this.analyzeSentiment(userMessage);
      } catch (sentimentError) {
        console.warn('Sentiment analysis failed, continuing without it:', sentimentError);
        sentiment = { needsAttention: false, riskLevel: 'low' };
      }

      return {
        response: text,
        category: sentiment.primaryEmotion || 'general',
        needsAttention: sentiment.needsAttention,
        sessionInsights: {
          riskLevel: sentiment.riskLevel,
          emotionalMarkers: sentiment.emotionalMarkers
        }
      };
    } catch (error) {
      console.error('Error generating AI response:', error);
      
      // If quota exhausted or models unavailable, fall back to mock responses
      if (error.message === 'QUOTA_EXHAUSTED' || error.message === 'MODELS_UNAVAILABLE' || this.quotaExhausted) {
        console.log('[Gemini] Using mock response due to:', error.message || 'quota exhaustion');
        const mockResponse = getTherapeuticResponse(userMessage, conversationHistory);
        return {
          response: mockResponse.response,
          category: mockResponse.category,
          needsAttention: mockResponse.needsAttention,
          sessionInsights: {
            riskLevel: 'low',
            emotionalMarkers: []
          }
        };
      }
      
      return {
        response: "I'm having trouble processing your message right now. Please try again in a moment. If you're in crisis, please contact Tele-MANAS at 14416 or emergency services at 112 immediately.",
        category: 'error',
        needsAttention: false
      };
    }
  }

  async analyzeSentiment(message) {
    // If quota exhausted, use simple keyword-based sentiment
    if (this.quotaExhausted) {
      return this.fallbackSentimentAnalysis(message);
    }

    try {
      const prompt = `Analyze this message for mental health indicators. Return ONLY a JSON object with:
{
  "sentiment": "positive/negative/neutral/crisis",
  "confidence": 0.0-1.0,
  "needsAttention": true/false,
  "riskLevel": "low/medium/high",
  "primaryEmotion": "anxiety/depression/anger/hope/etc",
  "emotionalMarkers": ["word1", "word2"]
}

Message: "${message}"`;
      
      const text = await this.withModelRetry(async () => {
        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        return response.text();
      }, 'analyzeSentiment');
      
      try {
        return JSON.parse(text);
      } catch {
        return this.fallbackSentimentAnalysis(message);
      }
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      
      // Use fallback sentiment analysis
      if (error.message === 'QUOTA_EXHAUSTED' || error.message === 'MODELS_UNAVAILABLE' || this.quotaExhausted) {
        return this.fallbackSentimentAnalysis(message);
      }
      
      return { sentiment: 'neutral', confidence: 0, needsAttention: false, riskLevel: 'low' };
    }
  }

  fallbackSentimentAnalysis(message) {
    const messageLower = message.toLowerCase();
    
    // Crisis detection
    const crisisKeywords = ['suicide', 'kill myself', 'end it all', 'hurt myself', 'self harm'];
    if (crisisKeywords.some(kw => messageLower.includes(kw))) {
      return {
        sentiment: 'crisis',
        confidence: 0.95,
        needsAttention: true,
        riskLevel: 'high',
        primaryEmotion: 'crisis',
        emotionalMarkers: crisisKeywords.filter(kw => messageLower.includes(kw))
      };
    }
    
    // Depression
    const depressionKeywords = ['depressed', 'hopeless', 'worthless', 'empty', 'sad'];
    if (depressionKeywords.some(kw => messageLower.includes(kw))) {
      return {
        sentiment: 'negative',
        confidence: 0.8,
        needsAttention: true,
        riskLevel: 'medium',
        primaryEmotion: 'depression',
        emotionalMarkers: depressionKeywords.filter(kw => messageLower.includes(kw))
      };
    }
    
    // Anxiety
    const anxietyKeywords = ['anxious', 'panic', 'worried', 'scared', 'nervous'];
    if (anxietyKeywords.some(kw => messageLower.includes(kw))) {
      return {
        sentiment: 'anxious',
        confidence: 0.75,
        needsAttention: false,
        riskLevel: 'low-medium',
        primaryEmotion: 'anxiety',
        emotionalMarkers: anxietyKeywords.filter(kw => messageLower.includes(kw))
      };
    }
    
    // Positive
    const positiveKeywords = ['happy', 'better', 'good', 'grateful', 'hopeful'];
    if (positiveKeywords.some(kw => messageLower.includes(kw))) {
      return {
        sentiment: 'positive',
        confidence: 0.7,
        needsAttention: false,
        riskLevel: 'low',
        primaryEmotion: 'hope',
        emotionalMarkers: positiveKeywords.filter(kw => messageLower.includes(kw))
      };
    }
    
    return {
      sentiment: 'neutral',
      confidence: 0.6,
      needsAttention: false,
      riskLevel: 'low',
      primaryEmotion: 'neutral',
      emotionalMarkers: []
    };
  }

  async generateCopingStrategies(mood, situation) {
    try {
      const prompt = `As a mental health counselor, suggest 5 specific, actionable coping strategies for someone feeling ${mood} in this situation: ${situation}. 

Focus on evidence-based techniques from CBT, DBT, and mindfulness practices. Return as a JSON array of strings. Each strategy should be practical and specific.`;
      
      const text = await this.withModelRetry(async () => {
        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        return response.text();
      }, 'generateCopingStrategies');

      try {
        return JSON.parse(text);
      } catch {
        return ["Take slow, deep breaths", "Practice mindfulness for 5 minutes", "Write down your thoughts", "Take a short walk", "Reach out to a trusted person"];
      }
    } catch (error) {
      console.error('Error generating coping strategies:', error);
      return ["Take slow, deep breaths", "Practice mindfulness for 5 minutes", "Write down your thoughts"];
    }
  }

  async generateTherapyInsights(conversationHistory) {
    try {
      const conversation = conversationHistory
        .map(msg => `${msg.role}: ${msg.content}`)
        .join('\n');

      const prompt = `As a mental health counselor, analyze this conversation and provide therapeutic insights. Return ONLY a JSON object:
{
  "patterns": ["pattern1", "pattern2"],
  "strengths": ["strength1", "strength2"], 
  "recommendations": ["rec1", "rec2"],
  "progressMarkers": ["progress1", "progress2"]
}

Conversation: ${conversation}`;
      
      const text = await this.withModelRetry(async () => {
        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        return response.text();
      }, 'generateTherapyInsights');

      try {
        return JSON.parse(text);
      } catch {
        return {
          patterns: ["User is actively seeking support"],
          strengths: ["Shows courage in reaching out"],
          recommendations: ["Continue practicing self-care"],
          progressMarkers: ["Engaging in therapeutic conversation"]
        };
      }
    } catch (error) {
      console.error('Error generating therapy insights:', error);
      return {
        patterns: [],
        strengths: ["Seeking help shows strength"],
        recommendations: ["Continue self-care practices"],
        progressMarkers: []
      };
    }
  }

  getMode() {
    return {
      type: this.mode,
      label: this.modeLabel,
      model: this.modelIdInUse,
      quotaExhausted: this.quotaExhausted
    };
  }

  getActiveModelId() {
    return this.modelIdInUse;
  }

  getQuotaStatus() {
    return {
      exhausted: this.quotaExhausted,
      canRetry: !this.quotaExhausted,
      mode: this.mode
    };
  }

  // Allow manual reset of quota status (useful for testing or when quota resets)
  resetQuotaStatus() {
    console.log('[Gemini] Manually resetting quota status');
    this.quotaExhausted = false;
    this.rateLimitHit = false;
    this.mode = 'real';
    this.modelCursor = 0;
    this.modelIdInUse = this.modelCandidates[this.modelCursor];
    this.model = this.genAI.getGenerativeModel({ model: this.modelIdInUse });
    this.modeLabel = `Gemini live therapeutic model (${this.modelIdInUse})`;
    this.lastRequestTime = 0;
  }
}

// Create service instance based on API availability
const createGeminiService = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (apiKey && apiKey.trim() !== '') {
    try {
      return new RealTherapyGeminiService();
    } catch (error) {
      console.warn('Failed to initialize real Gemini service, falling back to mock:', error);
      return new MockTherapyGeminiService();
    }
  } else {
    return new MockTherapyGeminiService();
  }
};

const geminiService = createGeminiService();
export default geminiService;

/*
// Original Firebase implementation
class GeminiService {
  constructor() {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('Gemini API key not found. AI features will be disabled.');
      this.genAI = null;
      return;
    }
    
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
    
    // Mental health context for the AI
    this.systemPrompt = "You are a compassionate and supportive mental health assistant designed to help students with their emotional well-being. Always be empathetic and supportive. Never provide medical diagnoses. If someone expresses suicidal thoughts, recommend calling Tele-MANAS at 14416 or emergency services at 112 immediately.";
  }

  async generateResponse(userMessage, conversationHistory = []) {
    if (!this.genAI) {
      return "I'm sorry, but the AI service is currently unavailable. Please try again later or contact support.";
    }

    try {
      // Build conversation context
      const contextMessages = conversationHistory
        .slice(-10) // Keep last 10 messages for context
        .map(msg => msg.role + ": " + msg.content)
        .join('\\n');

      const fullPrompt = this.systemPrompt + "\\n\\nPrevious conversation:\\n" + contextMessages + "\\n\\nUser: " + userMessage;

      const result = await this.model.generateContent(fullPrompt);
      const response = await result.response;
      const text = response.text();

      return text;
    } catch (error) {
      console.error('Error generating AI response:', error);
      return "I'm having trouble processing your message right now. Please try again in a moment, or reach out to a counselor if you need immediate support.";
    }
  }

  // Analyze sentiment of user message
  async analyzeSentiment(message) {
    if (!this.genAI) {
      return { sentiment: 'neutral', confidence: 0, needsAttention: false };
    }

    try {
      const prompt = `Analyze the emotional sentiment of this message and determine if it indicates a mental health crisis or need for immediate attention. Respond with only a JSON object with sentiment (positive/negative/neutral), confidence (0-1), and needsAttention (true/false): "${message}"`;
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        return JSON.parse(text);
      } catch {
        return { sentiment: 'neutral', confidence: 0.5, needsAttention: false };
      }
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      return { sentiment: 'neutral', confidence: 0, needsAttention: false };
    }
  }

  // Generate coping strategies based on user's current state
  async generateCopingStrategies(mood, situation) {
    if (!this.genAI) {
      return ["Take deep breaths", "Talk to a trusted friend", "Practice mindfulness"];
    }

    try {
      const prompt = `Generate 3-5 specific, actionable coping strategies for someone feeling ${mood} in this situation: ${situation}. Return as a JSON array of strings.`;
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        return JSON.parse(text);
      } catch {
        return ["Take deep breaths", "Talk to a trusted friend", "Practice mindfulness"];
      }
    } catch (error) {
      console.error('Error generating coping strategies:', error);
      return ["Take deep breaths", "Talk to a trusted friend", "Practice mindfulness"];
    }
  }
}

// Create a singleton instance
const geminiService = new GeminiService();

export default geminiService;
*/