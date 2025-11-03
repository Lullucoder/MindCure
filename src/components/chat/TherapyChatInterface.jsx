import { useState, useRef, useEffect, useMemo } from 'react';
import { Send, User, AlertTriangle, Heart, Loader, Brain, Lightbulb, Shield, Clock, TrendingUp, Sparkles, Activity } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import geminiService from '../../services/geminiService';
import TherapyStarters from './TherapyStarters';

const QUICK_PROMPTS = [
  "Can you guide me through a calming breathing exercise?",
  "I'm feeling anxious about academics. What can I do right now?",
  "Help me build a gentle self-care plan for this evening.",
  "I'm overwhelmed and need a quick grounding technique.",
  "What small step can I take to feel more supported today?"
];

const createMessageId = () => `${Date.now()}-${Math.floor(Math.random() * 100000)}`;

const formatTime = (value) => {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const formatDateLabel = (value) => {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (isSameDay(date, today)) {
    return 'Today';
  }

  if (isSameDay(date, yesterday)) {
    return 'Yesterday';
  }

  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });
};

const sentimentTone = (sentiment) => {
  switch (sentiment) {
    case 'crisis':
      return 'crisis';
    case 'negative':
      return 'negative';
    case 'anxious':
      return 'anxious';
    case 'positive':
      return 'positive';
    default:
      return 'neutral';
  }
};

const getMessageWrapperClass = (role) => (role === 'user' ? 'chat-message chat-message--user' : 'chat-message');

const getBubbleClass = (role, isAlert = false, isError = false, category = '') => {
  if (isAlert) return 'chat-bubble chat-bubble--alert';
  if (isError) return 'chat-bubble chat-bubble--error';
  if (category === 'info') return 'chat-bubble chat-bubble--info';
  if (role === 'user') return 'chat-bubble chat-bubble--user';
  return 'chat-bubble chat-bubble--assistant';
};

const getMessageIcon = (role, isAlert = false, isError = false, category = '') => {
  if (isAlert) return <AlertTriangle className="chat-message__icon-symbol" />;
  if (isError) return <AlertTriangle className="chat-message__icon-symbol" />;
  if (role === 'assistant' || role === 'system') {
    switch (category) {
      case 'crisis':
        return <Shield className="chat-message__icon-symbol" />;
      case 'anxiety':
        return <Brain className="chat-message__icon-symbol" />;
      case 'depression':
        return <Heart className="chat-message__icon-symbol" />;
      case 'coping':
        return <Lightbulb className="chat-message__icon-symbol" />;
      default:
        return <Heart className="chat-message__icon-symbol" />;
    }
  }
  return <User className="chat-message__icon-symbol" />;
};

const TherapyChatInterface = () => {
  const [messages, setMessages] = useState([
    {
      id: createMessageId(),
      role: 'assistant',
      content: "Hello! I'm here to provide a safe, supportive space for you to share your thoughts and feelings. I'm trained to listen with empathy and help you explore your emotions. Take your time—there's no pressure. How are you feeling today?",
      timestamp: new Date().toISOString(),
      category: 'greeting'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sentimentAnalysis, setSentimentAnalysis] = useState(null);
  const [sessionInsights, setSessionInsights] = useState(null);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const textareaRef = useRef(null);
  const { userProfile } = useAuth();

  const [userScrolled, setUserScrolled] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);
  const scrollTimeoutRef = useRef(null);
  const lastMessageCountRef = useRef(0);

  const serviceMode = geminiService.getMode ? geminiService.getMode() : {
    type: 'mock',
    label: 'Offline therapeutic simulator',
    model: 'mindcure-offline-companion'
  };
  const isLiveService = serviceMode.type === 'real';

  const hasUserSpoken = messages.some((message) => message.role === 'user');

  const timeline = useMemo(() => {
    const items = [];
    let currentLabel = null;

    messages.forEach((message) => {
      const label = formatDateLabel(message.timestamp);
      if (label && label !== currentLabel) {
        items.push({ type: 'separator', id: `${label}-${message.id}`, label });
        currentLabel = label;
      }
      items.push({ type: 'message', data: message });
    });

    return items;
  }, [messages]);

  const quickFocus = () => {
    requestAnimationFrame(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(textareaRef.current.value.length, textareaRef.current.value.length);
      }
    });
  };

  const scrollToBottom = (behavior = 'smooth', force = false) => {
    if (!chatContainerRef.current) return;
    
    if (force || isAutoScrollEnabled) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: behavior
      });
      setUserScrolled(false);
      setShowScrollButton(false);
    }
  };

  const handleScroll = () => {
    if (!chatContainerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    const isNearBottom = distanceFromBottom < 100;
    
    // Clear existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    // If user scrolls up, disable auto-scroll
    if (!isNearBottom && !isLoading) {
      setUserScrolled(true);
      setIsAutoScrollEnabled(false);
      setShowScrollButton(true);
    } else {
      // If near bottom, re-enable auto-scroll
      setUserScrolled(false);
      setIsAutoScrollEnabled(true);
      setShowScrollButton(false);
    }
    
    // Debounce: re-enable auto-scroll after user stops scrolling
    scrollTimeoutRef.current = setTimeout(() => {
      if (isNearBottom) {
        setIsAutoScrollEnabled(true);
      }
    }, 150);
  };

  // Only auto-scroll when new messages arrive and auto-scroll is enabled
  useEffect(() => {
    const messageCountChanged = messages.length !== lastMessageCountRef.current;
    
    if (messageCountChanged) {
      lastMessageCountRef.current = messages.length;
      
      // Small delay to ensure DOM is updated
      requestAnimationFrame(() => {
        if (isAutoScrollEnabled || isLoading) {
          scrollToBottom('smooth');
        }
      });
    }
  }, [messages, isAutoScrollEnabled, isLoading]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: createMessageId(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date().toISOString()
    };

    const provisionalHistory = [...messages, userMessage];

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const sentiment = await geminiService.analyzeSentiment(userMessage.content);
      setSentimentAnalysis(sentiment);

      const conversationHistory = provisionalHistory.map((msg) => ({
        role: msg.role,
        content: msg.content
      }));

      const aiResponse = await geminiService.generateResponse(userMessage.content, conversationHistory);

      if (aiResponse.sessionInsights) {
        setSessionInsights(aiResponse.sessionInsights);
      }

      const assistantMessage = {
        id: createMessageId(),
        role: 'assistant',
        content: typeof aiResponse === 'string' ? aiResponse : aiResponse.response,
        timestamp: new Date().toISOString(),
        category: aiResponse.category || 'support'
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if ((sentiment && sentiment.needsAttention) || aiResponse.needsAttention) {
        setTimeout(() => {
          const crisisMessage = {
            id: createMessageId(),
            role: 'system',
            content: "Crisis support is available right now:\n\n• Tele-MANAS: 14416 (24/7 mental health helpline)\n• KIRAN Helpline: 1800-599-0019 (24/7 professional counseling)\n• Emergency services: 112\n\nYou deserve immediate support. I can help you prepare what to say when you reach out.",
            timestamp: new Date().toISOString(),
            isAlert: true,
            category: 'crisis'
          };
          setMessages((prev) => [...prev, crisisMessage]);
        }, 1200);
      }

      if (provisionalHistory.length > 6 && provisionalHistory.length % 8 === 0) {
        try {
          const insights = await geminiService.generateTherapyInsights(conversationHistory);
          setSessionInsights(insights);
        } catch (error) {
          console.error('Error generating insights:', error);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Check if it's a quota exhaustion or model unavailability issue
      const quotaStatus = geminiService.getQuotaStatus?.();
      const isQuotaIssue = quotaStatus?.exhausted || error.message?.includes('QUOTA') || error.message?.includes('429');
      const isModelIssue = error.message?.includes('MODELS_UNAVAILABLE') || error.message?.includes('404');
      const isFallbackMode = isQuotaIssue || isModelIssue;
      
      const errorMessage = {
        id: createMessageId(),
        role: 'assistant',
        content: isFallbackMode
          ? "I've switched to my built-in therapeutic response system. Our conversation will continue seamlessly with the same quality of support. If you are in crisis, please contact 14416 (Tele-MANAS) or emergency services at 112 immediately."
          : "I'm experiencing technical difficulties right now. Please wait a moment and try again. If you are in crisis, please contact 14416 (Tele-MANAS) or emergency services at 112 immediately.",
        timestamp: new Date().toISOString(),
        isError: !isFallbackMode,
        category: isFallbackMode ? 'info' : 'error'
      };
      setMessages((prev) => [...prev, errorMessage]);
      
      // Update service mode display
      if (isFallbackMode) {
        const newMode = geminiService.getMode();
        setServiceMode(newMode);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (event) => {
    setInputMessage(event.target.value);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 150) + 'px';
    }
  };

  const handleInputFocus = () => {
    // Ensure auto-scroll is enabled when user starts typing
    setIsAutoScrollEnabled(true);
    
    // Scroll to bottom smoothly when input is focused
    requestAnimationFrame(() => {
      scrollToBottom('smooth', true);
    });
  };

  const handlePromptInsert = (prompt) => {
    setInputMessage(prompt);
    setIsAutoScrollEnabled(true);
    quickFocus();
    
    // Scroll to bottom when prompt is inserted
    requestAnimationFrame(() => {
      scrollToBottom('smooth', true);
    });
  };

  return (
    <div className="chat-shell">
      <div className="layout-container">
        <div className="chat-layout">
          <section className="chat-panel chat-panel--conversation">
            <header className="chat-header">
              <div className="chat-header__identity">
                <span className="chat-avatar">
                  <Heart className="chat-avatar__icon" />
                </span>
                <div>
                  <h1>MindCure Companion</h1>
                  <p>Clinical-grade emotional support, always on your side</p>
                </div>
              </div>

              <div className="chat-header__meta">
                <span className={`chat-service-indicator ${isLiveService ? 'chat-service-indicator--live' : 'chat-service-indicator--mock'}`}>
                  <span className="chat-status-dot" />
                  {serviceMode.quotaExhausted ? 'Mock mode (quota limit)' : serviceMode.label}
                </span>
                {userProfile?.firstName && (
                  <span className="chat-user-pill">Supporting {userProfile.firstName}</span>
                )}
              </div>
            </header>

            {sentimentAnalysis && (
              <div className="chat-sentiment-bar">
                <div className="chat-sentiment-main">
                  <span className="chat-label">Current mood check</span>
                  <span className="chat-sentiment-pill" data-tone={sentimentTone(sentimentAnalysis.sentiment)}>
                    <Activity className="chat-sentiment-icon" />
                    {sentimentAnalysis.sentiment}
                  </span>
                </div>
                <div className="chat-sentiment-meta">
                  {sentimentAnalysis.riskLevel && (
                    <span>Risk level: {sentimentAnalysis.riskLevel}</span>
                  )}
                  {typeof sentimentAnalysis.confidence === 'number' && (
                    <span>Confidence {Math.round(sentimentAnalysis.confidence * 100)}%</span>
                  )}
                </div>
              </div>
            )}

            <div
              ref={chatContainerRef}
              className="chat-scroll"
              onScroll={handleScroll}
              aria-live="polite"
              aria-busy={isLoading}
            >
              {timeline.map((item) => {
                if (item.type === 'separator') {
                  return (
                    <div key={item.id} className="chat-separator" role="presentation">
                      <span>{item.label}</span>
                    </div>
                  );
                }

                const message = item.data;
                return (
                  <div key={message.id} className={getMessageWrapperClass(message.role)}>
                    <span className="chat-message__icon">
                      {getMessageIcon(message.role, message.isAlert, message.isError, message.category)}
                    </span>
                    <div className={getBubbleClass(message.role, message.isAlert, message.isError, message.category)}>
                      <div className="chat-bubble__content">{message.content}</div>
                      <div className="chat-bubble__meta">
                        <span>{formatTime(message.timestamp)}</span>
                        {message.role !== 'user' && message.category && (
                          <span className="chat-bubble__tag">{message.category}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {!hasUserSpoken && (
                <div className="chat-starter-panel">
                  <TherapyStarters onStarterClick={handlePromptInsert} />
                </div>
              )}

              {isLoading && (
                <div className="chat-message">
                  <span className="chat-message__icon">
                    <Heart className="chat-message__icon-symbol" />
                  </span>
                  <div className="chat-bubble chat-bubble--typing">
                    <Loader className="chat-loader" />
                    <span>Thinking thoughtfully…</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {showScrollButton && (
              <button
                type="button"
                className="chat-scroll-button"
                onClick={() => {
                  setIsAutoScrollEnabled(true);
                  scrollToBottom('smooth', true);
                }}
                aria-label="Scroll to latest message"
                title="Jump to latest message"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M19 12l-7 7-7-7" />
                </svg>
                <span className="chat-scroll-button__badge">New</span>
              </button>
            )}

            <div className="chat-composer">
              <div className="chat-composer__input">
                <textarea
                  ref={textareaRef}
                  value={inputMessage}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  onFocus={handleInputFocus}
                  placeholder="Share what's on your mind. I'm listening without judgment."
                  className="chat-textarea"
                  rows={1}
                  disabled={isLoading}
                  maxLength={1000}
                  style={{ minHeight: '44px', maxHeight: '150px', resize: 'none' }}
                />
                <span className="chat-char-counter">{inputMessage.length}/1000</span>
                <button
                  type="button"
                  className="chat-send"
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading || inputMessage.length > 1000}
                >
                  {isLoading ? <Loader className="chat-send__icon" /> : <Send className="chat-send__icon" />}
                </button>
              </div>
              <div className="chat-composer__note">
                <Shield className="chat-composer__note-icon" />
                <span>Your conversation stays private. We only surface crisis resources when safety is at risk.</span>
              </div>
            </div>
          </section>

          <aside className="chat-panel chat-panel--context">
            <div className="chat-context-card">
              <h3><Sparkles className="chat-context-icon" /> Session status</h3>
              <p>Active model: <strong>{serviceMode.model}</strong></p>
              {!isLiveService && (
                <div className="chat-context-callout">
                  <AlertTriangle className="chat-context-callout__icon" />
                  <span>
                    Running in guided offline mode. Add a valid <code>VITE_GEMINI_API_KEY</code> to enable live Gemini responses.
                  </span>
                </div>
              )}
              {isLiveService && (
                <p className="chat-context-subtext">Stable Gemini connection detected. Responses may briefly switch to fallback if the primary model is busy.</p>
              )}
            </div>

            {sentimentAnalysis ? (
              <div className="chat-context-card">
                <h3><Activity className="chat-context-icon" /> Emotional snapshot</h3>
                <p className="chat-context-highlight">{sentimentAnalysis.sentiment}</p>
                <ul className="chat-list">
                  <li>Risk level: {sentimentAnalysis.riskLevel || 'low'}</li>
                  <li>Needs attention: {sentimentAnalysis.needsAttention ? 'yes' : 'no'}</li>
                  {sentimentAnalysis.emotionalMarkers && sentimentAnalysis.emotionalMarkers.length > 0 && (
                    <li>Markers: {sentimentAnalysis.emotionalMarkers.join(', ')}</li>
                  )}
                </ul>
              </div>
            ) : (
              <div className="chat-context-card chat-context-card--muted">
                <h3><Activity className="chat-context-icon" /> Emotional snapshot</h3>
                <p className="chat-empty-state">Share how you feel to see live reflections on mood and risk.</p>
              </div>
            )}

            {sessionInsights && (
              <div className="chat-context-card">
                <h3><TrendingUp className="chat-context-icon" /> Session insights</h3>
                {(sessionInsights.patterns && sessionInsights.patterns.length > 0) && (
                  <div>
                    <p className="chat-context-label">Patterns noticed</p>
                    <ul className="chat-list">
                      {sessionInsights.patterns.map((item, index) => (
                        <li key={`pattern-${index}`}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {(sessionInsights.strengths && sessionInsights.strengths.length > 0) && (
                  <div>
                    <p className="chat-context-label">Your strengths</p>
                    <ul className="chat-list">
                      {sessionInsights.strengths.map((item, index) => (
                        <li key={`strength-${index}`}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <div className="chat-context-card">
              <h3><Lightbulb className="chat-context-icon" /> Quick prompts</h3>
              <p className="chat-context-subtext">Tap a prompt and we will start from there.</p>
              <div className="chat-chip-list">
                {QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    className="chat-chip"
                    onClick={() => handlePromptInsert(prompt)}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            <div className="chat-context-card chat-context-card--alert">
              <h3><Shield className="chat-context-icon" /> Immediate help</h3>
              <p>If you're in crisis, please reach out immediately. Human professionals are ready to listen:</p>
              <ul className="chat-list">
                <li>Tele-MANAS (24/7): <strong>14416</strong></li>
                <li>KIRAN Helpline: <strong>1800-599-0019</strong></li>
                <li>Emergency services: <strong>112</strong></li>
              </ul>
              <p className="chat-context-subtext">You deserve support. We can plan what to say together.</p>
            </div>

            <div className="chat-context-card chat-context-card--muted chat-context-card--compact">
              <h3><Clock className="chat-context-icon" /> Session tips</h3>
              <ul className="chat-list">
                <li>Pause and breathe before you send—there is no rush.</li>
                <li>You can request exercises, reflections, or next steps.</li>
                <li>We will surface crisis contacts automatically when needed.</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default TherapyChatInterface;