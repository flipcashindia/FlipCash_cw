// src/components/LeadChat.tsx
import React, { useEffect, useState, useRef } from 'react';
import { Loader2, AlertTriangle, Send, ShieldCheck, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE_URL = 'http://localhost:8000/api/v1';

interface MessageSender {
  id: string;
  name: string;
  role: 'user' | 'partner' | 'admin' | 'system';
}

interface Message {
  id: string;
  sender: MessageSender;
  message: string;
  message_type: 'text' | 'image' | 'file' | 'system';
  is_read: boolean;
  created_at: string;
}

interface LeadChatProps {
  leadId: string;
  currentUserId: string;
  partnerAssigned: boolean;
}

const LeadChat: React.FC<LeadChatProps> = ({ leadId, currentUserId, partnerAssigned }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) throw new Error("Authentication required.");

      // --- START OF FIX: Added '/leads' to match your 200 OK log ---
      const res = await fetch(`${API_BASE_URL}/leads/messages/?lead=${leadId}`, {
      // --- END OF FIX ---
        headers: { 'Authorization': `Bearer ${token}` }
      });

      console.log('Fetch Messages Response Status:', res); 

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || `Failed to load messages (${res.status})`);
      }

      const data = await res.json();
      setMessages(data.results || []);
    } catch (err: any) {
      console.error('Error fetching messages:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!leadId) return;
    fetchMessages(); // Initial fetch
    
    const interval = setInterval(fetchMessages, 10000);
    return () => clearInterval(interval);
  }, [leadId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !partnerAssigned) return;

    try {
      setSending(true);
      setError(null);
      const token = localStorage.getItem('access_token');
      if (!token) throw new Error("Authentication required.");

      const payload = {
        lead: leadId,
        message: newMessage,
        message_type: 'text'
      };

      // --- START OF FIX: Added '/leads' to match your 200 OK log ---
      const res = await fetch(`${API_BASE_URL}/leads/messages/`, {
      // --- END OF FIX ---
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || `Failed to send message (${res.status})`);
      }

      const sentMessage: Message = await res.json();
      setMessages(prev => [...prev, sentMessage]);
      setNewMessage('');

    } catch (err: any) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center p-6 h-64">
        <Loader2 className="animate-spin text-[#FEC925]" size={24} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[70vh] max-h-[700px] bg-white rounded-2xl shadow-xl border-2 border-[#1B8A05]/20 overflow-hidden">
      
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-bold text-lg text-[#1C1C1B] text-center">Chat with Partner</h3>
      </div>
      
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-3 bg-[#FF0000]/10 flex items-center gap-2"
          >
            <AlertTriangle className="text-[#FF0000]" size={20} />
            <p className="text-sm text-[#FF0000]">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-gradient-to-br from-[#F0F7F6] to-[#EAF6F4]">
        {!partnerAssigned && messages.length === 0 && (
          <div className="p-4 bg-gray-100 rounded-lg text-center h-full flex items-center justify-center">
            <p className="text-gray-600">
              Chat will be enabled once a partner is assigned to your lead.
            </p>
          </div>
        )}

        {messages.map((msg) => {
          const isSender = msg.sender.id === currentUserId;
          
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-end gap-2 ${isSender ? 'justify-end' : 'justify-start'}`}
            >
              {!isSender && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#FEC925] to-[#1B8A05] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
              )}
              
              <div
                className={`max-w-xs md:max-w-md p-3 rounded-2xl shadow-md ${
                  isSender
                    ? 'bg-gradient-to-br from-[#1B8A05] to-[#0a4d03] text-white rounded-br-lg'
                    : 'bg-white text-[#1C1C1B] border border-gray-200 rounded-bl-lg'
                }`}
              >
                <p className="text-sm break-words">{msg.message}</p>
                <p className="text-xs opacity-70 mt-1 text-right">
                  {new Date(msg.created_at).toLocaleTimeString('en-IN', { hour: 'numeric', minute: 'numeric', hour12: true })}
                </p>
              </div>

              {isSender && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
              )}
            </motion.div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={partnerAssigned ? "Type your message..." : "Chat is disabled"}
            disabled={!partnerAssigned || sending}
            className="flex-1 p-3 border-2 border-gray-300 rounded-xl focus:border-[#FEC925] focus:ring-4 focus:ring-[#FEC925]/30 focus:outline-none font-medium transition disabled:bg-gray-100"
          />
          <button
            type="submit"
            disabled={!partnerAssigned || sending}
            className="w-12 h-12 flex-shrink-0 bg-gradient-to-r from-[#FEC925] to-[#1B8A05] text-[#1C1C1B] rounded-xl hover:shadow-lg transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LeadChat;