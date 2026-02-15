import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { MessageCircle, X, Send, Loader, User } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'visitor' | 'admin';
  text: string;
  timestamp: string;
}

interface Conversation {
  id: string;
  visitorName: string;
  messages: ChatMessage[];
}

export default function FloatingChat() {
  const { t, isRTL } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [inputText, setInputText] = useState('');
  const [showInfoForm, setShowInfoForm] = useState(true);
  const [visitorInfo, setVisitorInfo] = useState({ name: '', email: '', phone: '' });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages, isOpen]);

  useEffect(() => {
    const savedId = localStorage.getItem('chat_conv_id');
    const savedInfo = localStorage.getItem('chat_visitor_info');
    if (savedId) {
      fetchConversation(savedId);
      setShowInfoForm(false);
    }
    if (savedInfo) {
      setVisitorInfo(JSON.parse(savedInfo));
    }
  }, []);

  // Poll for new messages when open
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOpen && conversation?.id) {
      interval = setInterval(() => fetchConversation(conversation.id), 3000);
    }
    return () => clearInterval(interval);
  }, [isOpen, conversation?.id]);

  const fetchConversation = async (id: string) => {
    try {
      const response = await fetch(`/api/messages?conversationId=${id}`);
      if (response.ok) {
        const data = await response.json();
        setConversation(data);
      }
    } catch (error) {
      console.error('Error fetching chat:', error);
    }
  };

  const handleStartChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorInfo.name || !visitorInfo.email) {
      toast.error(t('errorMessage'));
      return;
    }
    const newId = 'conv_' + Date.now();
    localStorage.setItem('chat_conv_id', newId);
    localStorage.setItem('chat_visitor_info', JSON.stringify(visitorInfo));
    setConversation({ id: newId, visitorName: visitorInfo.name, messages: [] });
    setShowInfoForm(false);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !conversation) return;

    const messageText = inputText;
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: conversation.id,
          visitorName: visitorInfo.name,
          visitorEmail: visitorInfo.email,
          visitorPhone: visitorInfo.phone,
          text: messageText,
          sender: 'visitor',
        }),
      });

      if (response.ok) {
        const updatedConv = await response.json();
        setConversation(updatedConv);
      }
    } catch (error) {
      toast.error(t('errorMessage'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed ${isRTL ? 'left-6' : 'right-6'} bottom-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg flex items-center justify-center glow-effect transition-transform hover:scale-110`}
      >
        {isOpen ? <X /> : <MessageCircle />}
      </button>

      {isOpen && (
        <div className={`fixed ${isRTL ? 'left-6' : 'right-6'} bottom-24 z-50 w-80 h-[450px] bg-slate-900 rounded-2xl shadow-2xl border border-white/10 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4`}>
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white flex justify-between items-center">
            <div>
              <h3 className="font-bold">{t('contactUs')}</h3>
              <p className="text-xs opacity-80">{conversation ? 'متصل الآن' : 'سنجيبك قريباً'}</p>
            </div>
            <User className="w-5 h-5 opacity-50" />
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-900/50">
            {showInfoForm ? (
              <form onSubmit={handleStartChat} className="space-y-3 pt-4">
                <Input 
                  placeholder={t('fullName')} 
                  value={visitorInfo.name} 
                  onChange={e => setVisitorInfo({...visitorInfo, name: e.target.value})}
                  className="bg-slate-800 border-slate-700 text-white"
                />
                <Input 
                  placeholder={t('email')} 
                  type="email"
                  value={visitorInfo.email} 
                  onChange={e => setVisitorInfo({...visitorInfo, email: e.target.value})}
                  className="bg-slate-800 border-slate-700 text-white"
                />
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">{t('sendButton')}</Button>
              </form>
            ) : (
              <>
                {conversation?.messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === 'visitor' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                      msg.sender === 'visitor' 
                        ? 'bg-blue-600 text-white rounded-br-none' 
                        : 'bg-slate-700 text-gray-100 rounded-bl-none'
                    }`}>
                      {msg.text}
                      <p className="text-[10px] opacity-50 mt-1 text-right">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {!showInfoForm && (
            <form onSubmit={handleSendMessage} className="p-3 bg-slate-800 border-t border-white/5 flex gap-2">
              <Input
                placeholder="اكتب رسالتك..."
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                className="bg-slate-900 border-none text-white focus-visible:ring-0"
              />
              <Button size="icon" disabled={isLoading} className="bg-blue-600 shrink-0">
                {isLoading ? <Loader className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </form>
          )}
        </div>
      )}
    </>
  );
}
