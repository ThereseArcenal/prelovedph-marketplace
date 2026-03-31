import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { FiSend, FiArrowLeft, FiMessageCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Messages = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (user) {
      fetchConversations();
      const interval = setInterval(fetchConversations, 3000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchConversations = async () => {
    try {
      const response = await api.get('/messages/conversations');
      if (response.data.success) {
        setConversations(response.data.conversations || []);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
      if (loading) {
        setLoading(false);
      }
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const response = await api.get(`/messages/conversation/${conversationId}`);
      if (response.data.success) {
        setMessages(response.data.messages || []);
        fetchConversations();
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    fetchMessages(conversation.id);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedConversation || sending) return;

    setSending(true);
    try {
      const response = await api.post('/messages/send', {
        conversationId: selectedConversation.id,
        message: messageText
      });

      if (response.data.success) {
        setMessageText('');
        fetchMessages(selectedConversation.id);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(error.response?.data?.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (date) => {
    const today = new Date();
    const msgDate = new Date(date);
    
    if (msgDate.toDateString() === today.toDateString()) {
      return formatTime(date);
    }
    
    const diffDays = Math.floor((today - msgDate) / (1000 * 60 * 60 * 24));
    if (diffDays < 7) {
      return msgDate.toLocaleDateString('en-PH', { weekday: 'short' });
    }
    
    return msgDate.toLocaleDateString('en-PH', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FiMessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Please log in to view messages</p>
          <button 
            onClick={() => navigate('/login')}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex h-[calc(100vh-120px)]">
            
            {/* Conversations Sidebar */}
            <div className="w-full md:w-80 border-r border-gray-100 flex flex-col">
              <div className="p-4 border-b border-gray-100">
                <h1 className="text-lg font-semibold text-gray-800">Messages</h1>
                <p className="text-xs text-gray-400 mt-1">
                  {conversations.length} {conversations.length === 1 ? 'conversation' : 'conversations'}
                </p>
              </div>

              <div className="flex-1 overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="w-6 h-6 border-2 border-gray-200 border-t-green-500 rounded-full animate-spin"></div>
                  </div>
                ) : conversations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 px-6 text-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                      <FiMessageCircle className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-sm">No conversations yet</p>
                    <p className="text-gray-400 text-xs mt-1">
                      Send a message to start chatting!
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {conversations.map((conversation) => (
                      <button
                        key={conversation.id}
                        onClick={() => handleSelectConversation(conversation)}
                        className={`w-full text-left p-3 transition-all ${
                          selectedConversation?.id === conversation.id
                            ? 'bg-green-50 border-l-2 border-green-500'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className="font-medium text-gray-800 text-sm truncate">
                                {conversation.participantName}
                              </span>
                              {conversation.lastMessageAt && (
                                <span className="text-xs text-gray-400 flex-shrink-0">
                                  {formatDate(conversation.lastMessageAt)}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 truncate">
                              {conversation.lastMessage || 'No messages yet'}
                            </p>
                          </div>
                          {conversation.unreadCount > 0 && (
                            <span className="bg-green-500 text-white text-xs font-medium rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center flex-shrink-0">
                              {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className="hidden md:flex flex-1 flex-col">
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-100 bg-white">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 text-sm font-medium">
                          {selectedConversation.participantName?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <h3 className="font-medium text-gray-800">
                        {selectedConversation.participantName}
                      </h3>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                    {messages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                          <FiMessageCircle className="w-6 h-6 text-gray-400" />
                        </div>
                        <p className="text-gray-400 text-sm">No messages yet</p>
                        <p className="text-gray-400 text-xs mt-1">
                          Send a message to start the conversation
                        </p>
                      </div>
                    ) : (
                      messages.map((msg, idx) => {
                        const isOwn = msg.sender_id === user.id;
                        return (
                          <div
                            key={idx}
                            className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[70%] px-3 py-2 rounded-lg ${
                                isOwn
                                  ? 'bg-green-500 text-white'
                                  : 'bg-white border border-gray-100 text-gray-700 shadow-sm'
                              }`}
                            >
                              <p className="text-sm break-words">{msg.message}</p>
                              <p className={`text-xs mt-1 ${isOwn ? 'text-green-100' : 'text-gray-400'}`}>
                                {formatTime(msg.created_at)}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Message Input */}
                  <form
                    onSubmit={handleSendMessage}
                    className="p-4 bg-white border-t border-gray-100"
                  >
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        placeholder="Type a message..."
                        disabled={sending}
                        className="flex-1 px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-50"
                      />
                      <button
                        type="submit"
                        disabled={sending || !messageText.trim()}
                        className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {sending ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <FiSend size={18} />
                        )}
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center bg-gray-50">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <FiMessageCircle className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-sm">Select a conversation</p>
                  <p className="text-gray-400 text-xs mt-1">
                    Choose a conversation from the list to start chatting
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Chat View */}
      {selectedConversation && (
        <div className="md:hidden fixed inset-0 bg-gray-50 z-50 flex flex-col">
          {/* Mobile Header */}
          <div className="bg-white px-4 py-3 flex items-center gap-3 border-b border-gray-100">
            <button
              onClick={() => setSelectedConversation(null)}
              className="p-1 hover:bg-gray-100 rounded-lg transition"
            >
              <FiArrowLeft size={20} className="text-gray-600" />
            </button>
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 text-sm font-medium">
                {selectedConversation.participantName?.charAt(0).toUpperCase()}
              </span>
            </div>
            <h3 className="font-medium text-gray-800 flex-1">
              {selectedConversation.participantName}
            </h3>
          </div>

          {/* Mobile Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                  <FiMessageCircle className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-gray-400 text-sm">No messages yet</p>
              </div>
            ) : (
              messages.map((msg, idx) => {
                const isOwn = msg.sender_id === user.id;
                return (
                  <div
                    key={idx}
                    className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] px-3 py-2 rounded-lg ${
                        isOwn
                          ? 'bg-green-500 text-white'
                          : 'bg-white border border-gray-100 text-gray-700 shadow-sm'
                      }`}
                    >
                      <p className="text-sm break-words">{msg.message}</p>
                      <p className={`text-xs mt-1 ${isOwn ? 'text-green-100' : 'text-gray-400'}`}>
                        {formatTime(msg.created_at)}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Mobile Input */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-white border-t border-gray-100"
          >
            <div className="flex gap-2">
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type a message..."
                disabled={sending}
                className="flex-1 px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-50"
              />
              <button
                type="submit"
                disabled={sending || !messageText.trim()}
                className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition disabled:opacity-50"
              >
                {sending ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <FiSend size={18} />
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Messages;