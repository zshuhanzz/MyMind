import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircle, Send, Plus, Phone, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/button';
import Card from '../components/ui/card';
import Spinner from '../components/ui/spinner';
import apiClient from '../config/api-client';
import { ROUTES } from '../config/routes';
import { CRISIS_RESOURCES } from '../config/constants';
import type { Conversation, Message } from '../types';

export default function ChatPage() {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showCrisisResources, setShowCrisisResources] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => { scrollToBottom(); }, [messages]);

  // Load conversation list
  useEffect(() => {
    apiClient.get('/conversations').then((r) => setConversations(r.data)).catch(() => {});
  }, []);

  // Load messages when conversation changes
  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      return;
    }
    setLoading(true);
    apiClient
      .get(`/conversations/${conversationId}`)
      .then((r) => {
        setMessages(r.data.messages || []);
      })
      .catch(() => navigate(ROUTES.CHAT))
      .finally(() => setLoading(false));
  }, [conversationId, navigate]);

  const startConversation = useCallback(async (initialMessage?: string) => {
    try {
      const { data: conv } = await apiClient.post('/conversations', {});
      setConversations((prev) => [conv, ...prev]);
      navigate(ROUTES.CHAT_CONVERSATION(conv.id));
      if (initialMessage) {
        // Send the initial message after navigating
        setTimeout(async () => {
          await sendMessageToConversation(conv.id, initialMessage);
        }, 100);
      }
    } catch {
      // silently fail
    }
  }, [navigate]);

  const sendMessageToConversation = async (convId: string, content: string) => {
    const userMessage: Message = {
      id: `temp-${Date.now()}`,
      conversationId: convId,
      role: 'user',
      content,
      isCrisisFlagged: false,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setSending(true);

    try {
      const { data } = await apiClient.post(`/conversations/${convId}/messages`, { content });

      const aiMessage: Message = {
        id: data.message.id,
        conversationId: convId,
        role: 'assistant',
        content: data.message.content,
        isCrisisFlagged: data.crisisDetected,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMessage]);

      if (data.crisisDetected) {
        setShowCrisisResources(true);
      }

      // Refresh conversation list for updated title
      apiClient.get('/conversations').then((r) => setConversations(r.data)).catch(() => {});
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          conversationId: convId,
          role: 'assistant',
          content: "I'm having a little trouble right now. Could you try sending that again?",
          isCrisisFlagged: false,
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  const handleSend = async () => {
    const content = input.trim();
    if (!content || sending) return;
    setInput('');

    if (!conversationId) {
      await startConversation(content);
    } else {
      await sendMessageToConversation(conversationId, content);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Empty state — no active conversation
  if (!conversationId && messages.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-4xl mx-auto h-full flex flex-col"
      >
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
          <div className="w-16 h-16 rounded-full bg-lavender-100 flex items-center justify-center mb-6">
            <MessageCircle className="text-lavender-400" size={28} />
          </div>
          <h2 className="text-xl font-heading font-bold text-warmgray-900 mb-2">
            What's on your mind?
          </h2>
          <p className="text-warmgray-500 max-w-md mb-8">
            Start a conversation with Bridge. I'm here to listen, not to judge.
            Whatever you're going through, you don't have to go through it alone.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg w-full">
            {[
              "I've been feeling anxious lately",
              "I need to talk about something",
              "Today was really hard",
              "I'm feeling better than usual",
            ].map((prompt) => (
              <button
                key={prompt}
                onClick={() => startConversation(prompt)}
                className="p-4 text-left text-sm text-warmgray-600 bg-white border border-lavender-100 rounded-card hover:border-lavender-300 hover:shadow-soft transition-all duration-200"
              >
                {prompt}
              </button>
            ))}
          </div>

          {conversations.length > 0 && (
            <div className="mt-10 w-full max-w-lg">
              <p className="text-xs text-warmgray-400 mb-3 uppercase tracking-wide">Previous conversations</p>
              <div className="space-y-2">
                {conversations.slice(0, 5).map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => navigate(ROUTES.CHAT_CONVERSATION(conv.id))}
                    className="w-full p-3 text-left text-sm bg-white border border-lavender-100 rounded-card hover:border-lavender-300 transition-colors"
                  >
                    <p className="text-warmgray-700 truncate">{conv.title || 'Untitled conversation'}</p>
                    <p className="text-xs text-warmgray-400 mt-1">
                      {new Date(conv.updatedAt || conv.createdAt).toLocaleDateString()}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col">
      {/* Chat header */}
      <div className="flex items-center gap-3 pb-4 border-b border-lavender-100">
        <button
          onClick={() => navigate(ROUTES.CHAT)}
          className="p-2 rounded-button text-warmgray-400 hover:bg-lavender-50 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <p className="font-heading font-semibold text-warmgray-900 text-sm">
            Talking with Bridge
          </p>
        </div>
        <button
          onClick={() => startConversation()}
          className="p-2 rounded-button text-warmgray-400 hover:bg-lavender-50 transition-colors"
          title="New conversation"
        >
          <Plus size={18} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-6 space-y-4">
        {loading ? (
          <div className="flex justify-center py-10">
            <Spinner className="text-lavender-400" />
          </div>
        ) : (
          messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-lavender-500 text-white rounded-br-md'
                    : 'bg-sky-100 text-warmgray-700 rounded-bl-md'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </motion.div>
          ))
        )}

        {sending && (
          <div className="flex justify-start">
            <div className="bg-sky-100 rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-lavender-300 animate-pulse-soft" />
                <div className="w-2 h-2 rounded-full bg-lavender-300 animate-pulse-soft" style={{ animationDelay: '0.3s' }} />
                <div className="w-2 h-2 rounded-full bg-lavender-300 animate-pulse-soft" style={{ animationDelay: '0.6s' }} />
              </div>
            </div>
          </div>
        )}

        {/* Crisis resources inline */}
        {showCrisisResources && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border-rose-200 bg-rose-100/50">
              <div className="flex items-center gap-2 mb-3">
                <Phone size={16} className="text-rose-400" />
                <p className="font-heading font-bold text-warmgray-900 text-sm">Help is available</p>
              </div>
              <div className="space-y-2">
                {CRISIS_RESOURCES.map((r) => (
                  <div key={r.name} className="text-sm">
                    <p className="font-medium text-warmgray-700">{r.name}</p>
                    <p className="text-warmgray-500">{r.action}</p>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-lavender-100 pt-4 pb-2">
        <div className="flex items-end gap-3">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={1}
            className="flex-1 px-4 py-3 bg-white border border-lavender-200 rounded-card
              text-warmgray-700 placeholder:text-warmgray-400
              focus:outline-none focus:ring-2 focus:ring-lavender-300 focus:border-transparent
              transition-all duration-200 resize-none text-sm max-h-32"
            style={{ minHeight: '44px' }}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || sending}
            className="shrink-0"
          >
            <Send size={16} />
          </Button>
        </div>
        <p className="text-xs text-warmgray-400 mt-2 text-center">
          Bridge is an AI companion, not a therapist. For emergencies, call 988.
        </p>
      </div>
    </div>
  );
}
