import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { Send, Trash2, Check, AlertCircle } from 'lucide-react';

interface ChatMessage {
  id: string;
  visitorName: string;
  visitorEmail: string;
  visitorPhone: string;
  visitorMessage: string;
  adminReply?: string;
  createdAt: string;
  repliedAt?: string;
  status: 'unread' | 'read' | 'replied';
}

export default function AdminChat() {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<ChatMessage | null>(null);
  const [reply, setReply] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(true);

  const loadMessages = async (pwd: string) => {
    try {
      const response = await fetch(`/api/messages?password=${pwd}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
        setIsAuthenticated(true);
        setShowPasswordForm(false);
        toast.success('تم تحميل الرسائل بنجاح');
      } else {
        toast.error('كلمة المرور غير صحيحة');
      }
    } catch (error) {
      toast.error('خطأ في تحميل الرسائل');
    }
  };

  const handleSendReply = async () => {
    if (!selectedMessage || !reply.trim()) {
      toast.error('يرجى كتابة رد');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/messages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password,
          messageId: selectedMessage.id,
          adminReply: reply,
        }),
      });

      if (response.ok) {
        toast.success('تم إرسال الرد بنجاح');
        setReply('');
        loadMessages(password);
        setSelectedMessage(null);
      } else {
        toast.error('خطأ في إرسال الرد');
      }
    } catch (error) {
      toast.error('خطأ في الاتصال');
    } finally {
      setIsLoading(false);
    }
  };

  if (showPasswordForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
        <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full border border-white/10">
          <h1 className="text-3xl font-bold text-white mb-2">لوحة التحكم</h1>
          <p className="text-gray-400 mb-6">أدخل كلمة المرور للوصول إلى الرسائل</p>
          <div className="space-y-4">
            <Input
              type="password"
              placeholder="كلمة المرور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  loadMessages(password);
                }
              }}
            />
            <Button
              onClick={() => loadMessages(password)}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600"
            >
              دخول
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">لوحة تحكم الرسائل</h1>
          <Button
            onClick={() => {
              setIsAuthenticated(false);
              setShowPasswordForm(true);
              setPassword('');
            }}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            تسجيل الخروج
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-1 bg-slate-800 rounded-xl border border-white/10 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
              <h2 className="text-white font-bold">الرسائل ({messages.length})</h2>
            </div>
            <div className="overflow-y-auto max-h-[600px]">
              {messages.length === 0 ? (
                <div className="p-4 text-center text-gray-400">
                  لا توجد رسائل
                </div>
              ) : (
                messages.map((msg) => (
                  <button
                    key={msg.id}
                    onClick={() => setSelectedMessage(msg)}
                    className={`w-full text-right p-4 border-b border-white/5 hover:bg-slate-700/50 transition ${
                      selectedMessage?.id === msg.id ? 'bg-slate-700' : ''
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {msg.status === 'unread' && (
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                      )}
                      {msg.status === 'replied' && (
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white truncate">{msg.visitorName}</p>
                        <p className="text-sm text-gray-400 truncate">{msg.visitorMessage}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(msg.createdAt).toLocaleDateString('ar-SA')}
                        </p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Message Details & Reply */}
          <div className="lg:col-span-2 bg-slate-800 rounded-xl border border-white/10 p-6">
            {selectedMessage ? (
              <div className="space-y-6">
                {/* Visitor Info */}
                <div className="bg-slate-700/50 rounded-lg p-4 space-y-3">
                  <div>
                    <p className="text-gray-400 text-sm">الاسم</p>
                    <p className="text-white font-semibold">{selectedMessage.visitorName}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm">البريد الإلكتروني</p>
                      <p className="text-white text-sm break-all">{selectedMessage.visitorEmail}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">الهاتف</p>
                      <p className="text-white text-sm">{selectedMessage.visitorPhone || '-'}</p>
                    </div>
                  </div>
                </div>

                {/* Original Message */}
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <p className="text-blue-400 text-sm font-semibold mb-2">الرسالة الأصلية:</p>
                  <p className="text-white">{selectedMessage.visitorMessage}</p>
                </div>

                {/* Admin Reply */}
                {selectedMessage.adminReply ? (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                    <p className="text-green-400 text-sm font-semibold mb-2">الرد:</p>
                    <p className="text-white">{selectedMessage.adminReply}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      تم الرد في: {new Date(selectedMessage.repliedAt!).toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <label className="text-white text-sm font-semibold">اكتب الرد:</label>
                    <Textarea
                      placeholder="اكتب ردك هنا..."
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 min-h-[120px]"
                    />
                    <Button
                      onClick={handleSendReply}
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600"
                    >
                      {isLoading ? (
                        'جاري الإرسال...'
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          إرسال الرد
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>اختر رسالة لعرض التفاصيل والرد عليها</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
