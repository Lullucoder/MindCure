import { GoogleGenerativeAI } from "@google/generative-ai";

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
    this.systemPrompt = "You are a compassionate and supportive mental health assistant designed to help students with their emotional well-being. Always be empathetic and supportive. Never provide medical diagnoses. If someone expresses suicidal thoughts, recommend calling 988 immediately.";
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