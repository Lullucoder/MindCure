import { useState, useRef, useEffect } from 'react';
import { Send, Heart, Loader, Phone, ChevronDown, Sparkles, History, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import geminiService from '../../services/geminiService';
import apiClient from '../../lib/apiClient';

const QUICK_PROMPTS = [
  "I'm feeling anxious",
  "Help me calm down",
  "I need someone to talk to",
  "Guide me through breathing",
];

const createMessageId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const formatTime = (value) => {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const TherapyChatInterface = () => {
  const [messages, setMessages] = useState([
    {
      id: createMessageId(),
      role: 'assistant',
      content: "Hi there 💙 I'm here to listen and support you. There's no pressure — take your time. How are you feeling today?",
      timestamp: new Date().toISOString(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const textareaRef = useRef(null);
  const { userProfile, currentUser } = useAuth();

  // Load conversation on mount
  useEffect(() => {
    if (currentUser) {
      loadActiveConversation();
      loadConversationHistory();
    }
  }, [currentUser]);

  const loadActiveConversation = async () => {
    try {
      const response = await apiClient.get('/chat/active');
      const conversation = response.data.conversation;
      setConversationId(conversation._id);
      
      if (conversation.messages && conversation.messages.length > 0) {
        setMessages(conversation.messages.map(msg => ({
          id: msg._id || createMessageId(),
          role: msg.role,
          content: msg.content,
          timestamp: msg.timestamp
        })));
      }
    } catch (error) {
      console.error('Failed to load conversation:', error);
    }
  };

  const loadConversationHistory = async () => {
    try {
      const response = await apiClient.get('/chat?limit=10');
      setConversations(response.data.conversations || []);
    } catch (error) {
      console.error('Failed to load history:', error);
    }
  };

  const loadConversation = async (convId) => {
    setLoadingHistory(true);
    try {
      const response = await apiClient.get(`/chat/${convId}`);
      const conversation = response.data.conversation;
      setConversationId(conversation._id);
      
      if (conversation.messages && conversation.messages.length > 0) {
        setMessages(conversation.messages.map(msg => ({
          id: msg._id || createMessageId(),
          role: msg.role,
          content: msg.content,
          timestamp: msg.timestamp
        })));
      }
      setShowHistory(false);
    } catch (error) {
      console.error('Failed to load conversation:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const startNewConversation = async () => {
    try {
      const response = await apiClient.post('/chat', { title: 'New Conversation' });
      const conversation = response.data.conversation;
      setConversationId(conversation._id);
      setMessages([{
        id: createMessageId(),
        role: 'assistant',
        content: "Hi there 💙 I'm here to listen and support you. There's no pressure — take your time. How are you feeling today?",
        timestamp: new Date().toISOString(),
      }]);
      setShowHistory(false);
      loadConversationHistory();
    } catch (error) {
      console.error('Failed to create conversation:', error);
    }
  };

  const saveMessageToBackend = async (role, content) => {
    if (!conversationId || !currentUser) return;
    
    try {
      await apiClient.post(`/chat/${conversationId}/messages`, {
        role,
        content
      });
      
      // Update stats for user messages
      if (role === 'user') {
        apiClient.post('/profile/stats', { statName: 'totalChatMessages' }).catch(() => {});
      }
    } catch (error) {
      console.error('Failed to save message:', error);
    }
  };

  const scrollToBottom = (smooth = true) => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto'
      });
    }
  };

  useEffect(() => {
    // Use setTimeout to ensure DOM has updated before scrolling
    const timer = setTimeout(() => {
      scrollToBottom(false);
    }, 100);
    return () => clearTimeout(timer);
  }, [messages]);

  const handleScroll = () => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    setShowScrollBtn(scrollHeight - scrollTop - clientHeight > 100);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: createMessageId(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Save user message to backend
    saveMessageToBackend('user', userMessage.content);

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      const conversationHistory = [...messages, userMessage].map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const aiResponse = await geminiService.generateResponse(userMessage.content, conversationHistory);

      const responseContent = typeof aiResponse === 'string' ? aiResponse : aiResponse.response;
      
      const assistantMessage = {
        id: createMessageId(),
        role: 'assistant',
        content: responseContent,
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Save assistant message to backend
      saveMessageToBackend('assistant', responseContent);

      // Show crisis alert if needed
      if (aiResponse.needsAttention) {
        setTimeout(() => {
          setMessages(prev => [...prev, {
            id: createMessageId(),
            role: 'system',
            content: "💙 You're not alone. If you need immediate support:\n\n📞 Tele-MANAS: 14416\n📞 KIRAN: 1800-599-0019\n📞 Emergency: 112",
            timestamp: new Date().toISOString(),
            isAlert: true,
          }]);
        }, 800);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        id: createMessageId(),
        role: 'assistant',
        content: "I'm having a moment. Let me try again — please resend your message. If you're in crisis, call 14416 right away.",
        timestamp: new Date().toISOString(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  };

  const handleQuickPrompt = (prompt) => {
    setInputMessage(prompt);
    textareaRef.current?.focus();
  };

  const hasUserSpoken = messages.some(m => m.role === 'user');

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden my-4 relative">
      {/* History Panel */}
      {showHistory && (
        <div className="absolute inset-0 z-50 bg-white flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">Chat History</h2>
            <button
              onClick={() => setShowHistory(false)}
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <button
              onClick={startNewConversation}
              className="w-full flex items-center gap-3 p-4 mb-4 bg-gradient-to-r from-blue-50 to-emerald-50 rounded-xl hover:from-blue-100 hover:to-emerald-100 transition-colors"
            >
              <Plus className="w-5 h-5 text-blue-500" />
              <span className="font-medium text-gray-700">Start New Conversation</span>
            </button>
            
            {loadingHistory ? (
              <div className="flex justify-center py-8">
                <Loader className="w-6 h-6 animate-spin text-gray-400" />
              </div>
            ) : conversations.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No previous conversations</p>
            ) : (
              <div className="space-y-2">
                {conversations.map(conv => (
                  <button
                    key={conv._id}
                    onClick={() => loadConversation(conv._id)}
                    className={`w-full text-left p-4 rounded-xl border transition-colors ${
                      conv._id === conversationId
                        ? 'border-blue-300 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-medium text-gray-800 truncate">{conv.title}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {conv.messageCount || 0} messages • {new Date(conv.lastMessageAt || conv.updatedAt).toLocaleDateString()}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Simple Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-emerald-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-emerald-400 flex items-center justify-center">
            <Heart className="w-5 h-5 text-white" fill="white" />
          </div>
          <div>
            <h1 className="font-semibold text-gray-800">MindCure</h1>
            <p className="text-xs text-gray-500">Your safe space to talk</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={startNewConversation}
            className="p-2 text-emerald-600 bg-emerald-50 rounded-full hover:bg-emerald-100 transition-colors border border-emerald-200"
            title="New Chat"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowHistory(true)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 bg-white rounded-full hover:bg-gray-100 transition-colors border border-gray-200"
            title="Chat History"
          >
            <History className="w-4 h-4" />
            <span className="hidden sm:inline">History</span>
          </button>
          <a 
            href="tel:14416" 
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-full hover:bg-red-100 transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span className="hidden sm:inline">Crisis Line</span>
          </a>
        </div>
      </header>

      {/* Messages Area */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-gray-50/50"
        onScroll={handleScroll}
      >
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 ${
                message.isAlert 
                  ? 'bg-red-50 border border-red-200 text-red-800'
                  : message.role === 'user'
                    ? 'bg-blue-500 text-white rounded-br-md'
                    : 'bg-white border border-gray-100 shadow-sm text-gray-800 rounded-bl-md'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
              <p className={`text-xs mt-2 ${
                message.role === 'user' ? 'text-blue-100' : 'text-gray-400'
              }`}>
                {formatTime(message.timestamp)}
              </p>
            </div>
          </div>
        ))}

        {/* Quick Prompts - Show only at start */}
        {!hasUserSpoken && (
          <div className="flex flex-wrap gap-2 justify-center pt-4">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleQuickPrompt(prompt)}
                className="px-4 py-2 text-sm bg-white border border-gray-200 rounded-full text-gray-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex items-center gap-2 text-gray-500">
                <Loader className="w-4 h-4 animate-spin" />
                <span className="text-sm">Thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Scroll to bottom button */}
      {showScrollBtn && (
        <button
          onClick={() => scrollToBottom()}
          className="absolute bottom-32 left-1/2 -translate-x-1/2 p-2 bg-white shadow-lg rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <ChevronDown className="w-5 h-5 text-gray-600" />
        </button>
      )}

      {/* Input Area */}
      <div className="p-4 border-t border-gray-100 bg-white">
        <div className="flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={inputMessage}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type how you're feeling..."
              className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm"
              rows={1}
              disabled={isLoading}
              style={{ minHeight: '48px', maxHeight: '120px' }}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="p-3 bg-gradient-to-r from-blue-500 to-emerald-500 text-white rounded-full hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
        
        {/* Simple footer note */}
        <p className="text-xs text-center text-gray-400 mt-3">
          Your conversations are private • In crisis? Call <a href="tel:14416" className="text-blue-500 hover:underline">14416</a>
        </p>
      </div>
    </div>
  );
};

export default TherapyChatInterface;
