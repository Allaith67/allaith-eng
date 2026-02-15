import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Send, User, ArrowLeft } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'visitor' | 'admin';
  text: string;
  timestamp: string;
}

interface Conversation {
  id: string;
  visitorName: string;
  visitorEmail: string;
  messages: ChatMessage[];
  lastUpdate: string;
}

export default function AdminChat() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [reply, setReply] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedConv?.messages]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAuthenticated) {
      loadConversations();
      interval = setInterval(loadConversations, 5000);
    }
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const loadConversations = async () => {
    try {
      const response = await fetch(`/api/messages?password=${password}`);
      if (response.ok) {
        const data = await response.json();
        setConversations(data.sort((a: any, b: any) => new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime()));
        if (selectedConv) {
          const updated = data.find((c: any) => c.id === selectedConv.id);
          if (updated) setSelectedConv(updated);
        }
      }
    } catch (error) {
      console.error('Error loading chats:', error);
    }
  };

  const handleLogin = async () => {
    const response = await fetch(`/api/messages?password=${password}`);
    if (response.ok) {
      setIsAuthenticated(true);
      loadConversations();
    } else {
      toast.error('كلمة المرور خاطئة');
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConv || !reply.trim()) return;

    const text = reply;
    setReply('');

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: selectedConv.id,
          text,
          sender: 'admin',
          password
        }),
      });

      if (response.ok) {
        const updated = await response.json();
        setSelectedConv(updated);
        loadConversations();
      }
    } catch (error) {
      toast.error('خطأ في الإرسال');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800 p-8 rounded-2xl w-full max-w-md border border-white/10">
          <h1 className="text-2xl font-bold text-white mb-6">لوحة إدارة الدردشة</h1>
          <Input 
            type="password" 
            placeholder="كلمة المرور" 
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="mb-4 bg-slate-700 border-none text-white"
            onKeyPress={e => e.key === 'Enter' && handleLogin()}
          />
          <Button onClick={handleLogin} className="w-full bg-blue-600">دخول</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-slate-900 flex overflow-hidden">
      {/* Sidebar */}
      <div className={`w-full md:w-80 border-r border-white/5 flex flex-col ${selectedConv ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 bg-slate-800/50 border-b border-white/5">
          <h2 className="text-xl font-bold text-white">المحادثات</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map(conv => (
            <button
              key={conv.id}
              onClick={() => setSelectedConv(conv)}
              className={`w-full p-4 text-right border-b border-white/5 hover:bg-white/5 transition ${selectedConv?.id === conv.id ? 'bg-blue-600/20' : ''}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white">
                  <User className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold truncate">{conv.visitorName}</p>
                  <p className="text-xs text-gray-400 truncate">{conv.messages[conv.messages.length - 1]?.text}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex flex-col bg-slate-900/50 ${!selectedConv ? 'hidden md:flex' : 'flex'}`}>
        {selectedConv ? (
          <>
            <div className="p-4 bg-slate-800/50 border-b border-white/5 flex items-center gap-3">
              <Button variant="ghost" size="icon" className="md:hidden text-white" onClick={() => setSelectedConv(null)}>
                <ArrowLeft />
              </Button>
              <div>
                <h3 className="text-white font-bold">{selectedConv.visitorName}</h3>
                <p className="text-xs text-gray-400">{selectedConv.visitorEmail}</p>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {selectedConv.messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] p-4 rounded-2xl ${
                    msg.sender === 'admin' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-slate-800 text-gray-100 rounded-bl-none'
                  }`}>
                    {msg.text}
                    <p className="text-[10px] opacity-50 mt-1 text-right">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendReply} className="p-4 bg-slate-800/50 border-t border-white/5 flex gap-3">
              <Input
                placeholder="اكتب ردك هنا..."
                value={reply}
                onChange={e => setReply(e.target.value)}
                className="bg-slate-900 border-none text-white"
              />
              <Button type="submit" className="bg-blue-600 px-8">إرسال</Button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            اختر محادثة للبدء
          </div>
        )}
      </div>
    </div>
  );
}
