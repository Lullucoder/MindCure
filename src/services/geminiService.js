// import { GoogleGenerativeAI } from "@google/generative-ai";

// --- MOCK IMPLEMENTATION FOR OFFLINE DEMO ---
const MOCK_DELAY = 800; // Simulate AI "thinking" time

const cannedResponses = {
  default: "I'm here to listen. Tell me what's on your mind.",
  greeting: "Hello! I'm a supportive chatbot here to help you. How are you feeling today?",
  help: "It sounds like you're going through a lot. Remember, it's okay to ask for help. You can try talking to a friend, family member, or a professional.",
  sad: "I'm sorry to hear you're feeling down. Sometimes just acknowledging our feelings is a good first step. What's been happening?",
  anxious: "It sounds like you're feeling anxious. Let's try a simple grounding exercise. Name three things you can see and three things you can hear right now.",
  stress: "Stress can be overwhelming. Have you considered taking a short break to do something you enjoy, even for just a few minutes?",
  suicidal: "If you are having thoughts of harming yourself, please reach out for immediate help. In India, call Tele-MANAS at 14416 (24/7) or emergency services at 112. You are not alone.",
  unknown: "Thank you for sharing that with me. Could you tell me a little more about it?",
};

const getCannedResponse = (userMessage) => {
    const lowerCaseMessage = userMessage.toLowerCase();
    if (lowerCaseMessage.includes("hello") || lowerCaseMessage.includes("hi")) return cannedResponses.greeting;
    if (lowerCaseMessage.includes("help")) return cannedResponses.help;
    if (lowerCaseMessage.includes("sad") || lowerCaseMessage.includes("depressed")) return cannedResponses.sad;
    if (lowerCaseMessage.includes("anxious") || lowerCaseMessage.includes("worried")) return cannedResponses.anxious;
    if (lowerCaseMessage.includes("stress")) return cannedResponses.stress;
    if (lowerCaseMessage.includes("suicide") || lowerCaseMessage.includes("kill myself")) return cannedResponses.suicidal;
    return cannedResponses.unknown;
};


class MockGeminiService {
  constructor() {
    console.log("GeminiService is running in OFFLINE MOCK mode.");
  }

  async generateResponse(userMessage, conversationHistory = []) {
    return new Promise(resolve => {
      setTimeout(() => {
        const response = getCannedResponse(userMessage);
        resolve(response);
      }, MOCK_DELAY);
    });
  }

  async analyzeSentiment(message) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ sentiment: 'neutral', confidence: 0.8, needsAttention: false });
        }, MOCK_DELAY / 2);
    });
  }

  async generateCopingStrategies(mood, situation) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve([
                "Practice deep breathing for 5 minutes.",
                "Write down your thoughts in a journal.",
                "Go for a short walk outside.",
                "Listen to a calming song.",
                "Reach out to a friend you trust."
            ]);
        }, MOCK_DELAY / 2);
    });
  }
}

const geminiService = new MockGeminiService();
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