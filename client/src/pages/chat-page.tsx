import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MessageCircle, Send, Plus, Phone, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/button';
import Card from '../components/ui/card';
import Spinner from '../components/ui/spinner';
import apiClient from '../config/api-client';
import { crisisResources } from '../config/constants';
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // scroll to bottom when new messages come in
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // load conversation list
  useEffect(() => {
    apiClient.get('/conversations').then((r) => setConversations(r.data)).catch(() => {});
  }, []);

  // load messages when conversation changes
  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      return;
    }
    setLoading(true);
    apiClient.get(`/conversations/${conversationId}`)
      .then((r) => setMessages(r.data.messages || []))
      .catch(() => navigate('/chat'))
      .finally(() => setLoading(false));
  }, [conversationId]);

  const startConversation = async (firstMessage?: string) => {
    try {
      const res = await apiClient.post('/conversations', {});
      const conv = res.data;
      setConversations([conv, ...conversations]);
      navigate(`/chat/${conv.id}`);
      if (firstMessage) {
        // wait a bit then send the message
        setTimeout(() => sendMessage(conv.id, firstMessage), 100);
      }
    } catch {
      // ignore
    }
  };

  const sendMessage = async (convId: string, content: string) => {
    // show the users message in the chat right away
    const userMsg: Message = {
      id: 'temp-' + Date.now(),
      conversationId: convId,
      role: 'user',
      content,
      isCrisisFlagged: false,
      createdAt: new Date().toISOString(),
    };
    setMessages([...messages, userMsg]);
    setSending(true);

    try {
      const { data } = await apiClient.post(`/conversations/${convId}/messages`, { content });

      // add lunas response to the chat
      const lunaMsg: Message = {
        id: data.message.id,
        conversationId: convId,
        role: 'assistant',
        content: data.message.content,
        isCrisisFlagged: data.crisisDetected,
        createdAt: new Date().toISOString(),
      };
      setMessages([...messages, userMsg, lunaMsg]);

      if (data.crisisDetected) setShowCrisisResources(true);

      // refresh conversation titles
      apiClient.get('/conversations').then((r) => setConversations(r.data)).catch(() => {});
    } catch {
      // show error message if something went wrong
      const errorMsg: Message = {
        id: 'error-' + Date.now(),
        conversationId: convId,
        role: 'assistant',
        content: "I'm having a little trouble right now. Could you try again?",
        isCrisisFlagged: false,
        createdAt: new Date().toISOString(),
      };
      setMessages([...messages, userMsg, errorMsg]);
    }
    setSending(false);
  };

  const handleSend = async () => {
    const content = input.trim();
    if (!content || sending) return;
    setInput('');

    if (!conversationId) {
      await startConversation(content);
    } else {
      await sendMessage(conversationId, content);
    }
  };

  // enter to send
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // empty state when no conversation is active
  if (!conversationId && messages.length === 0) {
    return (
      <div className="max-w-4xl mx-auto h-full flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: '#2C1660' }}>
            <span className="text-2xl">🌙</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">What's on your mind?</h2>
          <p className="text-gray-500 max-w-md mb-8">
            Start a conversation with Luna. I'm here to listen, not to judge.
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
                className="p-4 text-left text-sm text-gray-600 bg-white border border-[#D4C4F5] rounded-2xl hover:border-[#7E57C2] transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* previous conversations */}
          {conversations.length > 0 && (
            <div className="mt-10 w-full max-w-lg">
              <p className="text-xs text-gray-400 mb-3 uppercase">Previous conversations</p>
              <div className="space-y-2">
                {conversations.slice(0, 5).map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => navigate(`/chat/${conv.id}`)}
                    className="w-full p-3 text-left text-sm bg-white border border-[#EDE5FF] rounded-2xl hover:border-[#D4C4F5]"
                  >
                    <p className="text-gray-700 truncate">{conv.title || 'Untitled conversation'}</p>
                    <p className="text-xs text-gray-400 mt-1">{new Date(conv.updatedAt || conv.createdAt).toLocaleDateString()}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // dark purple theme for the chat with Luna
  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col">
      {/* chat header - dark purple */}
      <div className="flex items-center gap-3 pb-4 border-b" style={{ borderColor: '#40237A' }}>
        <button onClick={() => navigate('/chat')} className="p-2 rounded-xl text-gray-400 hover:bg-[#F5F0FF]">
          <ArrowLeft size={18} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#2C1660' }}>
            <span className="text-sm">🌙</span>
          </div>
          <p className="font-semibold text-sm" style={{ color: '#2C1660' }}>Talking with Luna</p>
        </div>
        <div className="flex-1" />
        <button onClick={() => startConversation()} className="p-2 rounded-xl text-gray-400 hover:bg-[#F5F0FF]" title="New conversation">
          <Plus size={18} />
        </button>
      </div>

      {/* messages area */}
      <div className="flex-1 overflow-y-auto py-6 space-y-4">
        {loading ? (
          <div className="flex justify-center py-10"><Spinner className="text-[#7E57C2]" /></div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'text-white rounded-br-md'
                    : 'rounded-bl-md'
                }`}
                style={{
                  backgroundColor: msg.role === 'user' ? '#2C1660' : '#F5F0FF',
                  color: msg.role === 'user' ? 'white' : '#2D2A2A',
                }}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))
        )}

        {/* typing indicator */}
        {sending && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-md px-4 py-3" style={{ backgroundColor: '#F5F0FF' }}>
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#B39DDB] animate-pulse" />
                <div className="w-2 h-2 rounded-full bg-[#B39DDB] animate-pulse" style={{ animationDelay: '0.3s' }} />
                <div className="w-2 h-2 rounded-full bg-[#B39DDB] animate-pulse" style={{ animationDelay: '0.6s' }} />
              </div>
            </div>
          </div>
        )}

        {/* crisis resources */}
        {showCrisisResources && (
          <Card className="border-red-200 bg-red-50">
            <div className="flex items-center gap-2 mb-3">
              <Phone size={16} className="text-red-400" />
              <p className="font-bold text-gray-900 text-sm">Help is available</p>
            </div>
            <div className="space-y-2">
              {crisisResources.map((r) => (
                <div key={r.name} className="text-sm">
                  <p className="font-medium text-gray-700">{r.name}</p>
                  <p className="text-gray-500">{r.action}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* input area - dark purple accent */}
      <div className="border-t pt-4 pb-2" style={{ borderColor: '#EDE5FF' }}>
        <div className="flex items-end gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={1}
            className="flex-1 px-4 py-3 bg-white border rounded-2xl text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 resize-none text-sm"
            style={{ borderColor: '#D4C4F5', maxHeight: '128px', minHeight: '44px' }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || sending}
            className="shrink-0 p-3 rounded-xl text-white disabled:opacity-50"
            style={{ backgroundColor: '#2C1660' }}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
