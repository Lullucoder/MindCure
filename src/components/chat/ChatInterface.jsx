import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, AlertTriangle, Heart, Loader, Smile, MessageCircle, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// Enhanced AI responses for mental health support
const generateAIResponse = (userMessage, conversationHistory = []) => {
  const message = userMessage.toLowerCase();
  
  // Crisis detection keywords
  const crisisKeywords = ['suicide', 'kill myself', 'end it all', 'hurt myself', 'don\'t want to live', 'self harm'];
  const isCrisis = crisisKeywords.some(keyword => message.includes(keyword));
  
  if (isCrisis) {
    return {
      response: "I'm very concerned about what you've shared. Your life has value, and there are people who want to help you. Please reach out for immediate support:\n\n• Call 14416 (Tele-MANAS) - Available 24/7\n• Call 1800-599-0019 (KIRAN Helpline)\n• Go to your nearest emergency room\n• Call 112 (Emergency Services)\n\nWould you like me to help you find local crisis resources or talk about what's troubling you?",
      sentiment: { needsAttention: true, score: 0.1 }
    };
  }

  // Anxiety responses
  if (message.includes('anxious') || message.includes('anxiety') || message.includes('worried') || message.includes('panic')) {
    const responses = [
      "I hear that you're feeling anxious. That's really tough. Let's try a quick breathing exercise: Breathe in for 4 counts, hold for 4, then exhale for 6. Can you try this with me?",
      "Anxiety can feel overwhelming. Remember that this feeling will pass. What's one small thing that usually helps you feel a bit calmer?",
      "Thank you for sharing that you're feeling anxious. It takes courage to reach out. Have you tried grounding techniques? Let's name 5 things you can see around you right now."
    ];
    return {
      response: responses[Math.floor(Math.random() * responses.length)],
      sentiment: { needsAttention: false, score: 0.4 }
    };
  }

  // Depression responses
  if (message.includes('depressed') || message.includes('sad') || message.includes('hopeless') || message.includes('empty')) {
    const responses = [
      "I'm really glad you felt comfortable sharing this with me. Feeling depressed is incredibly difficult. You're not alone in this. What's one tiny thing that brought you even a moment of peace recently?",
      "Depression can make everything feel heavy and dark. Thank you for trusting me with these feelings. Have you been able to take care of your basic needs today - eating, sleeping, hygiene?",
      "I hear you, and I want you to know that these feelings are valid. Depression lies to us sometimes. You matter, and your feelings matter. What's one thing you're proud of yourself for today, even if it's small?"
    ];
    return {
      response: responses[Math.floor(Math.random() * responses.length)],
      sentiment: { needsAttention: false, score: 0.3 }
    };
  }

  // Stress responses
  if (message.includes('stressed') || message.includes('stress') || message.includes('overwhelmed') || message.includes('pressure')) {
    const responses = [
      "Stress can feel so overwhelming. Let's break this down together. What's the one thing causing you the most stress right now?",
      "I understand you're feeling stressed. Sometimes it helps to remember that we can only control what's in our power. What's one thing you can control in this situation?",
      "Feeling overwhelmed is exhausting. Have you tried the 'one thing at a time' approach? What's the most important thing you need to focus on right now?"
    ];
    return {
      response: responses[Math.floor(Math.random() * responses.length)],
      sentiment: { needsAttention: false, score: 0.5 }
    };
  }

  // Positive responses
  if (message.includes('good') || message.includes('better') || message.includes('happy') || message.includes('grateful')) {
    const responses = [
      "I'm so glad to hear you're feeling good! It's wonderful when we can recognize these positive moments. What's contributing to this good feeling?",
      "That's fantastic! I love hearing when you're doing well. These positive feelings are just as important to acknowledge as the difficult ones.",
      "Your positive energy comes through in your message! What's been helping you feel this way? It might be good to remember for tougher days."
    ];
    return {
      response: responses[Math.floor(Math.random() * responses.length)],
      sentiment: { needsAttention: false, score: 0.8 }
    };
  }

  // Default empathetic responses
  const defaultResponses = [
    "Thank you for sharing that with me. I'm here to listen. Can you tell me more about what's on your mind?",
    "I appreciate you opening up. Your feelings are valid, and it's okay to feel whatever you're experiencing. What would be most helpful for you right now?",
    "I'm glad you're here. Sometimes just talking about what we're going through can help. How has your day been treating you?",
    "You're taking a positive step by reaching out. That shows strength. What's the most important thing you'd like to work through today?",
    "I hear you. It's completely normal to have ups and downs. What's been the most challenging part of your day so far?"
  ];
  
  return {
    response: defaultResponses[Math.floor(Math.random() * defaultResponses.length)],
    sentiment: { needsAttention: false, score: 0.6 }
  };
};

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: "Hello! I'm your mental health support companion. 🌸 I'm here to listen with empathy, provide emotional support, and help you explore your feelings in a safe space. How are you feeling today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sentimentAnalysis, setSentimentAnalysis] = useState(null);
  const messagesEndRef = useRef(null);
  const { userProfile } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Simulate typing delay for more natural feel
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
      
      // Generate AI response using our enhanced function
      const { response, sentiment } = generateAIResponse(userMessage.content, messages);
      setSentimentAnalysis(sentiment);

      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        sentiment: sentiment
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Show crisis intervention if needed
      if (sentiment.needsAttention) {
        setTimeout(() => {
          const crisisMessage = {
            id: Date.now() + 2,
            role: 'system',
            content: "🚨 I want to make sure you get the immediate support you need. Here are crisis resources:\n\n📞 14416 - Tele-MANAS (24/7)\n� 1800-599-0019 - KIRAN Helpline (24/7)\n🏥 Go to your nearest emergency room\n🚑 Call 112 for immediate emergency help\n\nYou are not alone. Professional counselors are standing by to help.",
            timestamp: new Date(),
            isAlert: true
          };
          setMessages(prev => [...prev, crisisMessage]);
        }, 2000);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: "I'm sorry, I'm having trouble responding right now. Your message is important to me. Please try again in a moment. If you need immediate support, please call 14416 (Tele-MANAS) or reach out to a trusted person. 💙",
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getMessageIcon = (role, isAlert = false, isError = false) => {
    if (isAlert) return <AlertTriangle className="h-5 w-5 text-red-500" />;
    if (isError) return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    if (role === 'assistant' || role === 'system') return <Heart className="h-5 w-5 text-blue-500" />;
    return <User className="h-5 w-5 text-green-500" />;
  };

  const getMessageStyle = (role, isAlert = false, isError = false) => {
    if (isAlert) return 'bg-red-50 border-red-200 text-red-800';
    if (isError) return 'bg-yellow-50 border-yellow-200 text-yellow-800';
    if (role === 'user') return 'bg-gradient-to-r from-blue-400 to-green-400 text-white ml-12';
    return 'bg-white border border-gray-200 text-gray-800 mr-12 shadow-sm';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-green-400 rounded-full flex items-center justify-center shadow-md">
              <Heart className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Mental Health Support Chat</h1>
              <p className="text-gray-600">A safe space for emotional support and guidance</p>
            </div>
          </div>

          {/* Helpful reminders */}
          <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-blue-500 mt-0.5" />
              <div className="text-sm text-blue-700">
                <p className="font-medium">Remember:</p>
                <p>• This is a safe, judgment-free space • Your conversations are private • For emergencies, call 14416 or 112</p>
              </div>
            </div>
          </div>

          {/* Crisis Alert */}
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center space-x-2 text-red-800 text-sm">
              <AlertTriangle className="h-4 w-4" />
              <span className="font-medium">
                Crisis Support: If you're in immediate danger, call 112. For mental health crisis, call 14416.
              </span>
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div className="bg-white shadow-lg max-h-96 overflow-y-auto">
          <div className="p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${getMessageStyle(message.role, message.isAlert, message.isError)}`}>
                  <div className="flex items-start space-x-2">
                    {message.role !== 'user' && (
                      <div className="flex-shrink-0 mt-0.5">
                        {getMessageIcon(message.role, message.isAlert, message.isError)}
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                      <p className="text-xs opacity-70 mt-2">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl px-4 py-3 max-w-xs">
                  <div className="flex items-center space-x-2">
                    <Loader className="h-4 w-4 animate-spin text-blue-500" />
                    <span className="text-sm text-gray-600">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white rounded-b-2xl shadow-lg border-t border-gray-100 p-6">
          <div className="flex space-x-4">
            <div className="flex-1">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Share what's on your mind... (Press Enter to send, Shift+Enter for new line)"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none transition-all duration-200"
                rows="3"
                disabled={isLoading}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="px-6 py-3 bg-gradient-to-r from-blue-400 to-green-400 text-white rounded-xl hover:from-blue-500 hover:to-green-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2 shadow-md"
            >
              <Send className="h-4 w-4" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>
          
          <div className="mt-3 text-xs text-gray-500 flex items-center space-x-1">
            <Smile className="h-3 w-3" />
            <span>Tip: Be honest about your feelings. This AI is here to support you, not judge you.</span>
          </div>
        </div>

        {/* Quick Suggestions */}
        <div className="mt-6 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <MessageCircle className="h-5 w-5 mr-2 text-blue-500" />
            Need help getting started? Try these:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              "I'm feeling overwhelmed with school",
              "I've been having trouble sleeping lately",
              "I'm worried about my future",
              "I feel isolated and lonely",
              "I'm dealing with anxiety",
              "I need help managing stress"
            ].map((suggestion, index) => (
              <button
                key={index}
                onClick={() => setInputMessage(suggestion)}
                className="text-left p-3 bg-gradient-to-r from-blue-50 to-green-50 hover:from-blue-100 hover:to-green-100 rounded-xl transition-all duration-200 text-sm text-gray-700 border border-gray-100 hover:border-gray-200"
              >
                💭 "{suggestion}"
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;