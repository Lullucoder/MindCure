/**
 * Messages Page - Chat list and messaging interface
 */

import { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Send, 
  Search, 
  MoreVertical, 
  Phone, 
  Video,
  Image,
  Paperclip,
  Smile,
  Check,
  CheckCheck,
  Circle,
  MessageCircle
} from 'lucide-react';
import messageService from '../../services/messageService';
import friendService from '../../services/friendService';
import { Avatar } from '../ui/Avatar';
import { Spinner } from '../ui/Spinner';

export default function MessagesPage() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [friends, setFriends] = useState([]);
  const [showNewChat, setShowNewChat] = useState(false);
  const messagesEndRef = useRef(null);
  const messageInputRef = useRef(null);

  // Get current user
  const getCurrentUser = () => {
    try {
      const authData = localStorage.getItem('mental-health-app.auth');
      if (authData) {
        const parsed = JSON.parse(authData);
        return parsed.user;
      }
    } catch (error) {
      console.error('Error getting current user:', error);
    }
    return null;
  };

  const currentUser = getCurrentUser();

  // Load conversations
  useEffect(() => {
    loadConversations();
    loadFriends();
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Poll for new messages when conversation is selected
  useEffect(() => {
    if (!selectedConversation) return;

    const interval = setInterval(() => {
      loadMessages(selectedConversation._id, false);
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedConversation?._id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversations = async () => {
    try {
      setIsLoading(true);
      const data = await messageService.getConversations();
      setConversations(data.conversations || []);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadFriends = async () => {
    try {
      const data = await friendService.getFriends();
      setFriends(data.friends || []);
    } catch (error) {
      console.error('Error loading friends:', error);
    }
  };

  const loadMessages = async (conversationId, showLoading = true) => {
    try {
      if (showLoading) setIsLoading(true);
      const data = await messageService.getMessages(conversationId);
      setMessages(data.messages || []);
      
      // Mark as read
      await messageService.markAsRead(conversationId);
      
      // Update unread count in conversations
      setConversations(prev => prev.map(c => 
        c._id === conversationId ? { ...c, unreadCount: { [currentUser?._id]: 0 } } : c
      ));
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectConversation = async (conversation) => {
    setSelectedConversation(conversation);
    await loadMessages(conversation._id);
    messageInputRef.current?.focus();
  };

  const handleStartNewChat = async (friend) => {
    try {
      setShowNewChat(false);
      const data = await messageService.getOrCreateConversation(friend._id);
      setSelectedConversation(data.conversation);
      await loadMessages(data.conversation._id);
      await loadConversations();
    } catch (error) {
      console.error('Error starting new chat:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation || isSending) return;

    const messageContent = newMessage.trim();
    setNewMessage('');
    setIsSending(true);

    // Optimistic update
    const tempMessage = {
      _id: `temp-${Date.now()}`,
      sender: currentUser,
      content: messageContent,
      createdAt: new Date().toISOString(),
      isTemp: true,
    };
    setMessages(prev => [...prev, tempMessage]);

    try {
      await messageService.sendMessage(selectedConversation._id, messageContent);
      // Reload messages to get the actual message
      await loadMessages(selectedConversation._id, false);
      await loadConversations();
    } catch (error) {
      console.error('Error sending message:', error);
      // Remove temp message on error
      setMessages(prev => prev.filter(m => m._id !== tempMessage._id));
      setNewMessage(messageContent);
    } finally {
      setIsSending(false);
    }
  };

  const getOtherParticipant = (conversation) => {
    return conversation.participants?.find(p => p._id !== currentUser?._id);
  };

  const formatTime = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now - d;
    const days = Math.floor(diff / 86400000);

    if (days === 0) {
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return d.toLocaleDateString([], { weekday: 'short' });
    } else {
      return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const filteredConversations = conversations.filter(conv => {
    const other = getOtherParticipant(conv);
    return other?.name?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Mobile view: show either list or chat
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const showList = !isMobileView || !selectedConversation;
  const showChat = !isMobileView || selectedConversation;

  return (
    <div className="h-[calc(100vh-200px)] min-h-[500px] flex bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Conversations List */}
      {showList && (
        <div className={`${isMobileView ? 'w-full' : 'w-80'} border-r border-gray-200 flex flex-col`}>
          {/* Header */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Messages</h2>
              <button
                onClick={() => setShowNewChat(true)}
                className="p-2 rounded-full bg-primary-500 text-white hover:bg-primary-600 transition-colors"
                title="New chat"
              >
                <MessageCircle className="w-5 h-5" />
              </button>
            </div>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* New Chat Modal */}
          {showNewChat && (
            <div className="absolute inset-0 bg-white z-10 flex flex-col">
              <div className="p-4 border-b border-gray-100 flex items-center gap-3">
                <button onClick={() => setShowNewChat(false)}>
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <h3 className="font-semibold text-gray-800">New Message</h3>
              </div>
              <div className="flex-1 overflow-y-auto">
                {friends.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <p>No friends yet.</p>
                    <p className="text-sm mt-2">Add friends to start chatting!</p>
                  </div>
                ) : (
                  friends.map(friend => (
                    <button
                      key={friend._id}
                      onClick={() => handleStartNewChat(friend)}
                      className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors"
                    >
                      <Avatar name={friend.name} size="md" />
                      <div className="text-left">
                        <p className="font-medium text-gray-800">{friend.name}</p>
                        <p className="text-sm text-gray-500 capitalize">{friend.role}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {isLoading && conversations.length === 0 ? (
              <div className="flex items-center justify-center h-40">
                <Spinner size="lg" />
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No conversations yet</p>
                <p className="text-sm mt-2">Start a chat with a friend!</p>
              </div>
            ) : (
              filteredConversations.map(conversation => {
                const other = getOtherParticipant(conversation);
                const unreadCount = conversation.unreadCount?.[currentUser?._id] || 0;
                
                return (
                  <button
                    key={conversation._id}
                    onClick={() => handleSelectConversation(conversation)}
                    className={`w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                      selectedConversation?._id === conversation._id ? 'bg-primary-50' : ''
                    }`}
                  >
                    <div className="relative">
                      <Avatar name={other?.name} size="md" />
                      {other?.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-800 truncate">{other?.name}</p>
                        <span className="text-xs text-gray-400">
                          {conversation.lastMessage?.createdAt && formatTime(conversation.lastMessage.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        {conversation.lastMessage?.content || 'No messages yet'}
                      </p>
                    </div>
                    {unreadCount > 0 && (
                      <div className="w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                        <span className="text-xs text-white font-medium">{unreadCount}</span>
                      </div>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Chat Area */}
      {showChat && (
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-100 flex items-center gap-3">
                {isMobileView && (
                  <button onClick={() => setSelectedConversation(null)}>
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                  </button>
                )}
                <Avatar name={getOtherParticipant(selectedConversation)?.name} size="md" />
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">
                    {getOtherParticipant(selectedConversation)?.name}
                  </p>
                  <p className="text-sm text-gray-500 capitalize">
                    {getOtherParticipant(selectedConversation)?.role}
                  </p>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <MoreVertical className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map((message, index) => {
                  const isOwn = message.sender?._id === currentUser?._id || message.sender === currentUser?._id;
                  const showAvatar = !isOwn && (
                    index === 0 || 
                    messages[index - 1]?.sender?._id !== message.sender?._id
                  );

                  return (
                    <div
                      key={message._id}
                      className={`flex items-end gap-2 ${isOwn ? 'flex-row-reverse' : ''}`}
                    >
                      {showAvatar ? (
                        <Avatar 
                          name={getOtherParticipant(selectedConversation)?.name} 
                          size="sm" 
                        />
                      ) : (
                        <div className="w-8" />
                      )}
                      <div
                        className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                          isOwn
                            ? 'bg-primary-500 text-white rounded-br-md'
                            : 'bg-white text-gray-800 rounded-bl-md shadow-sm'
                        } ${message.isTemp ? 'opacity-70' : ''}`}
                      >
                        <p>{message.content}</p>
                        <div className={`flex items-center gap-1 mt-1 ${isOwn ? 'justify-end' : ''}`}>
                          <span className={`text-xs ${isOwn ? 'text-primary-100' : 'text-gray-400'}`}>
                            {formatTime(message.createdAt)}
                          </span>
                          {isOwn && (
                            message.readBy?.length > 1 ? (
                              <CheckCheck className="w-4 h-4 text-primary-100" />
                            ) : (
                              <Check className="w-4 h-4 text-primary-100" />
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100 bg-white">
                <div className="flex items-center gap-3">
                  <button type="button" className="p-2 hover:bg-gray-100 rounded-full">
                    <Paperclip className="w-5 h-5 text-gray-500" />
                  </button>
                  <input
                    ref={messageInputRef}
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <button type="button" className="p-2 hover:bg-gray-100 rounded-full">
                    <Smile className="w-5 h-5 text-gray-500" />
                  </button>
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || isSending}
                    className="p-3 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg">Select a conversation</p>
                <p className="text-sm mt-2">or start a new one!</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
