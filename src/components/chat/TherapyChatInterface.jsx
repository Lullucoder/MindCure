import { useState, useRef, useEffect } from 'react';
import { Send, User, AlertTriangle, Heart, Loader, Brain, Lightbulb, Shield, Clock, TrendingUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import geminiService from '../../services/geminiService';
import TherapyStarters from './TherapyStarters';

const TherapyChatInterface = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: "Hello! I'm here to provide a safe, supportive space for you to share your thoughts and feelings. 🌸 I'm trained to listen with empathy and help you explore your emotions. Take your time - there's no pressure. How are you feeling today?",
      timestamp: new Date(),
      category: 'greeting'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sentimentAnalysis, setSentimentAnalysis] = useState(null);
  const [sessionInsights, setSessionInsights] = useState(null);
  const [showInsights, setShowInsights] = useState(false);
  const messagesEndRef = useRef(null);
  const { userProfile } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
      // Analyze sentiment first
      const sentiment = await geminiService.analyzeSentiment(userMessage.content);
      setSentimentAnalysis(sentiment);
      
      // Generate therapeutic response using enhanced Gemini service
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      const aiResponse = await geminiService.generateResponse(userMessage.content, conversationHistory);
      
      // Update session insights if available
      if (aiResponse.sessionInsights) {
        setSessionInsights(aiResponse.sessionInsights);
      }

      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: typeof aiResponse === 'string' ? aiResponse : aiResponse.response,
        timestamp: new Date(),
        category: aiResponse.category || 'general',
        sentiment: sentiment
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Handle crisis situations with immediate resources
      if (sentiment.needsAttention || aiResponse.needsAttention) {
        setTimeout(() => {
          const crisisMessage = {
            id: Date.now() + 2,
            role: 'system',
            content: "🚨 **Crisis Support Available** 🚨\n\nI'm here with you, and I want you to know that immediate help is available:\n\n• **Tele-MANAS**: 14416 (24/7 mental health support)\n• **KIRAN Helpline**: 1800-599-0019 (24/7)\n• **Emergency Services**: 112\n\nYou don't have to face this alone. These trained professionals are ready to support you right now. Would you like me to help you prepare what to say when you call?",
            timestamp: new Date(),
            isAlert: true,
            category: 'crisis'
          };
          setMessages(prev => [...prev, crisisMessage]);
        }, 1500);
      }

      // Generate session insights periodically
      if (messages.length > 6 && messages.length % 8 === 0) {
        try {
          const insights = await geminiService.generateTherapyInsights(conversationHistory);
          setSessionInsights(insights);
        } catch (error) {
          console.error('Error generating insights:', error);
        }
      }

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: "I apologize, but I'm experiencing some technical difficulties right now. Your wellbeing is important to me. Please try again in a moment. \n\nIf you're in crisis, please don't wait:\n• Call 14416 (Tele-MANAS) for immediate support\n• Reach out to a trusted friend or family member\n• Go to your nearest emergency room if needed 💙",
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

  const getMessageIcon = (role, isAlert = false, isError = false, category = '') => {
    if (isAlert) return <AlertTriangle className="h-5 w-5 text-red-500" />;
    if (isError) return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    if (role === 'assistant' || role === 'system') {
      switch (category) {
        case 'crisis': return <Shield className="h-5 w-5 text-red-500" />;
        case 'anxiety': return <Brain className="h-5 w-5 text-blue-500" />;
        case 'depression': return <Heart className="h-5 w-5 text-purple-500" />;
        case 'coping': return <Lightbulb className="h-5 w-5 text-green-500" />;
        default: return <Heart className="h-5 w-5 text-blue-500" />;
      }
    }
    return <User className="h-5 w-5 text-green-500" />;
  };

  const getMessageStyle = (role, isAlert = false, isError = false) => {
    if (isAlert) return 'bg-red-50 border-red-200 text-red-800';
    if (isError) return 'bg-yellow-50 border-yellow-200 text-yellow-800';
    if (role === 'user') return 'bg-gradient-to-r from-blue-400 to-green-400 text-white ml-12';
    return 'bg-white border border-gray-200 text-gray-800 mr-12 shadow-sm';
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'crisis': return 'text-red-600 bg-red-100';
      case 'negative': return 'text-orange-600 bg-orange-100';
      case 'anxious': return 'text-blue-600 bg-blue-100';
      case 'positive': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-green-400 rounded-full flex items-center justify-center shadow-md">
                <Heart className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Mental Health Counselor</h1>
                <p className="text-gray-500">AI-powered therapy support with empathy and care</p>
              </div>
            </div>
            
            {/* Session Insights Button */}
            {sessionInsights && (
              <button
                onClick={() => setShowInsights(!showInsights)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
              >
                <TrendingUp className="h-4 w-4" />
                <span>Session Insights</span>
              </button>
            )}
          </div>

          {/* Sentiment Analysis Display */}
          {sentimentAnalysis && (
            <div className="mt-4 flex items-center space-x-4">
              <div className={`px-3 py-1 rounded-full text-sm ${getSentimentColor(sentimentAnalysis.sentiment)}`}>
                Current mood: {sentimentAnalysis.sentiment}
              </div>
              {sentimentAnalysis.riskLevel && (
                <div className="text-sm text-gray-600">
                  Risk level: {sentimentAnalysis.riskLevel}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Session Insights Panel */}
        {showInsights && sessionInsights && (
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Brain className="h-5 w-5 mr-2 text-blue-500" />
              Session Insights
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sessionInsights.patterns && sessionInsights.patterns.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Patterns Observed</h4>
                  <ul className="space-y-1">
                    {sessionInsights.patterns.map((pattern, index) => (
                      <li key={index} className="text-sm text-gray-600">• {pattern}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {sessionInsights.strengths && sessionInsights.strengths.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Your Strengths</h4>
                  <ul className="space-y-1">
                    {sessionInsights.strengths.map((strength, index) => (
                      <li key={index} className="text-sm text-green-600">• {strength}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {sessionInsights.recommendations && sessionInsights.recommendations.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Recommendations</h4>
                  <ul className="space-y-1">
                    {sessionInsights.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm text-blue-600">• {rec}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {sessionInsights.progressMarkers && sessionInsights.progressMarkers.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Progress Markers</h4>
                  <ul className="space-y-1">
                    {sessionInsights.progressMarkers.map((marker, index) => (
                      <li key={index} className="text-sm text-purple-600">• {marker}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Chat Messages */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {messages.length === 1 ? (
              // Show therapy starters for new sessions
              <div className="space-y-6">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    <Heart className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="rounded-2xl px-4 py-3 bg-white border border-gray-200 text-gray-800 mr-12 shadow-sm">
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {messages[0].content}
                    </div>
                    <div className="text-xs opacity-70 mt-2">
                      {messages[0].timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
                
                <TherapyStarters onStarterClick={(prompt) => {
                  setInputMessage(prompt);
                  // Focus on input after selection
                  setTimeout(() => {
                    const textarea = document.querySelector('textarea');
                    if (textarea) textarea.focus();
                  }, 100);
                }} />
              </div>
            ) : (
              // Show regular conversation
              messages.map((message) => (
                <div key={message.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getMessageIcon(message.role, message.isAlert, message.isError, message.category)}
                  </div>
                  
                  <div className={`rounded-2xl px-4 py-3 max-w-xs lg:max-w-md ${getMessageStyle(message.role, message.isAlert, message.isError)}`}>
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {message.content}
                    </div>
                    
                    <div className="flex items-center justify-between mt-2 text-xs opacity-70">
                      <span>{message.timestamp.toLocaleTimeString()}</span>
                      {message.category && (
                        <span className="capitalize">{message.category}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
            
            {isLoading && (
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <Heart className="h-5 w-5 text-blue-500" />
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 mr-12 shadow-sm">
                  <div className="flex items-center space-x-2">
                    <Loader className="h-4 w-4 animate-spin text-blue-500" />
                    <span className="text-sm text-gray-600">Thinking thoughtfully...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-end space-x-3">
              <div className="flex-1">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Share what's on your mind... I'm here to listen."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                  rows="2"
                  disabled={isLoading}
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className={`p-3 rounded-xl transition-all duration-200 ${
                  inputMessage.trim() && !isLoading
                    ? 'bg-gradient-to-r from-blue-400 to-green-400 text-white hover:from-blue-500 hover:to-green-500 shadow-md'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer with Crisis Resources */}
        <div className="mt-6 bg-red-50 border border-red-200 rounded-2xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Shield className="h-5 w-5 text-red-600" />
            <h3 className="font-medium text-red-800">Crisis Support Always Available</h3>
          </div>
          <p className="text-sm text-red-700">
            If you're having thoughts of self-harm or suicide, please reach out immediately: 
            Call <strong>14416 (Tele-MANAS)</strong> or <strong>112 (Emergency)</strong>. 
            Your life has value and help is available 24/7.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TherapyChatInterface;