// src/components/lead/LeadChat.tsx - CORRECTED TO MATCH BACKEND API
import React, { useEffect, useState, useRef } from 'react';
import { Loader2, AlertTriangle, Send, ShieldCheck, User, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

// ✅ CORRECTED: Match backend ChatMessageSerializer exactly
interface Message {
  id: string;
  lead: string;
  sender: string;  // ✅ UUID string, not object
  sender_name: string;  // ✅ From backend serializer
  sender_phone: string;  // ✅ From backend serializer
  message_type: string;
  message: string;
  attachments: any[];
  is_read: boolean;
  read_at: string | null;
  is_own_message: boolean;  // ✅ From backend serializer
  sent_at: string;  // ✅ CORRECT field name (not created_at)
}

interface LeadChatProps {
  leadId: string;
  currentUserId: string;
  partnerAssigned: boolean;
}

const LeadChat: React.FC<LeadChatProps> = ({ leadId, partnerAssigned }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // ✅ Format date safely using sent_at field
  const formatMessageTime = (dateString: string): string => {
    try {
      if (!dateString) {
        console.warn('Empty date string');
        return 'Just now';
      }

      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.warn('Invalid date:', dateString);
        return 'Just now';
      }

      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);

      // If less than 1 minute ago
      if (diffMins < 1) {
        return 'Just now';
      }

      // If less than 60 minutes ago
      if (diffMins < 60) {
        return `${diffMins}m ago`;
      }

      // If today
      if (date.toDateString() === now.toDateString()) {
        return date.toLocaleTimeString('en-IN', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        });
      }

      // If yesterday
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
      }

      // Otherwise show date
      return date.toLocaleDateString('en-IN', { 
        day: 'numeric', 
        month: 'short' 
      });
    } catch (err) {
      console.error('Date formatting error:', err);
      return 'Recently';
    }
  };

  const fetchMessages = async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) {
        setIsRefreshing(true);
      }

      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error("Authentication required.");
      }

      // console.log('📨 Fetching messages for lead:', leadId);

      const res = await fetch(`${API_BASE_URL}/leads/messages/?lead=${leadId}`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // console.log('📥 Messages API Response Status:', res.status);

      if (!res.ok) {
        if (res.status === 404) {
          // No messages yet, not an error
          setMessages([]);
          setError(null);
          return;
        }
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || `Failed to load messages (${res.status})`);
      }

      const data = await res.json();
      // console.log('📥 Messages received:', data);

      // Handle both paginated and non-paginated responses
      const messagesList = data.results || data || [];
      
      setMessages(messagesList);
      setError(null);

    } catch (err: any) {
      console.error('❌ Error fetching messages:', err);
      setError(err.message);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  // Clear existing interval
  const clearRefreshInterval = () => {
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
    }
  };

  // Set refresh interval with specified delay
  const setRefreshInterval = (delayMs: number) => {
    clearRefreshInterval();
    // console.log(`🔄 Setting refresh interval: ${delayMs}ms`);
    refreshIntervalRef.current = setInterval(() => {
      fetchMessages(true);
    }, delayMs);
  };

  useEffect(() => {
    if (!leadId) return;
    
    // console.log('🚀 Initializing chat for lead:', leadId);
    fetchMessages(); // Initial fetch
    
    // Set normal refresh interval (30 seconds)
    setRefreshInterval(30000);
    
    return () => clearRefreshInterval();
  }, [leadId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newMessage.trim() === '') {
      return;
    }

    if (!partnerAssigned) {
      setError('Chat is disabled. Wait for a partner to be assigned.');
      return;
    }

    try {
      setSending(true);
      setError(null);

      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error("Authentication required.");
      }

      const payload = {
        lead: leadId,
        message: newMessage.trim(),
        message_type: 'text'
      };

      // console.log('📤 Sending message:', payload);

      const res = await fetch(`${API_BASE_URL}/leads/messages/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      // console.log('📤 Send message response status:', res.status);

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || err.error || `Failed to send message (${res.status})`);
      }

      const sentMessage: Message = await res.json();
      // console.log('✅ Message sent successfully:', sentMessage);

      // Add message to list immediately
      setMessages(prev => [...prev, sentMessage]);
      setNewMessage('');

      // Quick refresh after 5 seconds to get partner's reply
      setTimeout(() => {
        fetchMessages();
      }, 5000);

      // Then set normal interval (30 seconds)
      setTimeout(() => {
        setRefreshInterval(30000);
      }, 5000);

    } catch (err: any) {
      console.error('❌ Error sending message:', err);
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  const handleManualRefresh = () => {
    fetchMessages(true);
    // Reset to normal interval after manual refresh
    setRefreshInterval(30000);
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center p-6 h-64 bg-white rounded-2xl">
        <div className="text-center">
          <Loader2 className="animate-spin text-[#FEC925] mx-auto mb-2" size={32} />
          <p className="text-sm text-gray-600">Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[70vh] max-h-[700px] bg-white rounded-2xl shadow-xl border-2 border-[#1B8A05]/20 overflow-hidden">
      
      {/* Header */}
      <div className="p-4 border-b-2 border-gray-200 bg-gradient-to-r from-[#FEC925]/10 to-[#1B8A05]/10">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg text-[#1C1C1B]">💬 Chat with Partner</h3>
          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="p-2 hover:bg-white/50 rounded-lg transition disabled:opacity-50"
            title="Refresh messages"
          >
            <RefreshCw 
              size={20} 
              className={`text-[#1C1C1B] ${isRefreshing ? 'animate-spin' : ''}`} 
            />
          </button>
        </div>
        {partnerAssigned && (
          <p className="text-xs text-gray-600 mt-1">
            Auto-refreshing every 30 seconds
          </p>
        )}
      </div>
      
      {/* Error Display */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-3 bg-[#FF0000]/10 border-b-2 border-[#FF0000]/20 flex items-center gap-2"
          >
            <AlertTriangle className="text-[#FF0000] flex-shrink-0" size={20} />
            <p className="text-sm text-[#FF0000] font-medium">{error}</p>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-[#FF0000] hover:opacity-70"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages Area */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-gradient-to-br from-[#F0F7F6] to-[#EAF6F4]">
        {!partnerAssigned && messages.length === 0 && (
          <div className="h-full flex items-center justify-center">
            <div className="text-center p-6 bg-white rounded-2xl shadow-lg border-2 border-gray-200 max-w-md">
              <ShieldCheck className="text-gray-300 mx-auto mb-3" size={48} />
              <p className="text-gray-600 font-semibold mb-2">
                Chat Unavailable
              </p>
              <p className="text-sm text-gray-500">
                Chat will be enabled once a partner is assigned to your lead.
              </p>
            </div>
          </div>
        )}

        {partnerAssigned && messages.length === 0 && (
          <div className="h-full flex items-center justify-center">
            <div className="text-center p-6 bg-white rounded-2xl shadow-lg border-2 border-[#FEC925]/20 max-w-md">
              <Send className="text-[#FEC925] mx-auto mb-3" size={48} />
              <p className="text-gray-700 font-semibold mb-2">
                Start the Conversation
              </p>
              <p className="text-sm text-gray-500">
                Send a message to your assigned partner below.
              </p>
            </div>
          </div>
        )}

        {messages.map((msg, index) => {
          // ✅ Use is_own_message from backend instead of comparing sender IDs
          const isSender = msg.is_own_message;
          const showAvatar = index === 0 || messages[index - 1]?.sender !== msg.sender;
          
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex items-end gap-2 ${isSender ? 'justify-end' : 'justify-start'}`}
            >
              {/* Partner Avatar */}
              {!isSender && showAvatar && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#FEC925] to-[#1B8A05] flex items-center justify-center shadow-md">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
              )}
              {!isSender && !showAvatar && <div className="w-8" />}
              
              {/* Message Bubble */}
              <div className="flex flex-col max-w-xs md:max-w-md">
                {/* Sender Name (only for first message in sequence) */}
                {showAvatar && !isSender && (
                  <p className="text-xs text-gray-500 mb-1 ml-2 font-semibold">
                    {msg.sender_name}
                  </p>
                )}
                
                <div
                  className={`p-3 rounded-2xl shadow-md ${
                    isSender
                      ? 'bg-gradient-to-br from-[#1B8A05] to-[#0a4d03] text-white rounded-br-sm'
                      : 'bg-white text-[#1C1C1B] border-2 border-gray-200 rounded-bl-sm'
                  }`}
                >
                  <p className="text-sm break-words whitespace-pre-wrap">{msg.message}</p>
                  <div className="flex items-center justify-end gap-2 mt-1">
                    {/* ✅ Use sent_at field correctly */}
                    <p className={`text-xs ${isSender ? 'text-white/70' : 'text-gray-500'}`}>
                      {formatMessageTime(msg.sent_at)}
                    </p>
                    {isSender && msg.is_read && (
                      <span className="text-xs text-white/70">✓✓</span>
                    )}
                  </div>
                </div>
              </div>

              {/* User Avatar */}
              {isSender && showAvatar && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center shadow-md">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
              )}
              {isSender && !showAvatar && <div className="w-8" />}
            </motion.div>
          );
        })}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="p-4 border-t-2 border-gray-200 bg-white">
        {!partnerAssigned && (
          <div className="mb-3 p-2 bg-[#FEC925]/10 rounded-lg text-center">
            <p className="text-xs text-gray-600">
              ⏳ Waiting for partner assignment...
            </p>
          </div>
        )}
        
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={partnerAssigned ? "Type your message..." : "Chat is disabled"}
            disabled={!partnerAssigned || sending}
            className="flex-1 p-3 border-2 border-gray-300 rounded-xl focus:border-[#FEC925] focus:ring-4 focus:ring-[#FEC925]/30 focus:outline-none font-medium transition disabled:bg-gray-100 disabled:cursor-not-allowed"
            maxLength={500}
          />
          <button
            type="submit"
            disabled={!partnerAssigned || sending || newMessage.trim() === ''}
            className="w-12 h-12 flex-shrink-0 bg-gradient-to-r from-[#FEC925] to-[#1B8A05] text-white rounded-xl hover:shadow-lg transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
            title="Send message"
          >
            {sending ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>
        
        {newMessage.length > 0 && (
          <p className="text-xs text-gray-500 mt-2 text-right">
            {newMessage.length} / 500 characters
          </p>
        )}
      </form>
    </div>
  );
};

export default LeadChat;