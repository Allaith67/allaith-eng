import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { MessageCircle, X, Send, Loader } from 'lucide-react';

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

export default function FloatingChat() {
  const { t, isRTL } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentMessage, setCurrentMessage] = useState<ChatMessage | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  // Check if there's a stored message ID to show reply
  useEffect(() => {
    const storedMessageId = localStorage.getItem('lastMessageId');
    if (storedMessageId && isOpen) {
      checkForReply(storedMessageId);
    }
  }, [isOpen]);

  const checkForReply = async (messageId: string) => {
    try {
      const response = await fetch(`/api/messages?password=${process.env.REACT_APP_ADMIN_PASSWORD}`);
      if (response.ok) {
        const messages: ChatMessage[] = await response.json();
        const message = messages.find(m => m.id === messageId);
        if (message) {
          setCurrentMessage(message);
        }
      }
    } catch (error) {
      console.error('Error checking for reply:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error(t('errorMessage'));
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitorName: formData.name,
          visitorEmail: formData.email,
          visitorPhone: formData.phone,
          visitorMessage: formData.message,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('lastMessageId', data.messageId);
        toast.success(t('successMessage'));
        setFormData({ name: '', email: '', phone: '', message: '' });
        
        // Show confirmation message
        setTimeout(() => {
          setCurrentMessage({
            id: data.messageId,
            visitorName: formData.name,
            visitorEmail: formData.email,
            visitorPhone: formData.phone,
            visitorMessage: formData.message,
            createdAt: new Date().toISOString(),
            status: 'unread',
          });
        }, 500);
      }
    } catch (error) {
      toast.error(t('errorMessage'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed ${isRTL ? 'left-6' : 'right-6'} bottom-6 z-40 w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center glow-effect`}
        title={t('contactUs')}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed ${isRTL ? 'left-6' : 'right-6'} bottom-24 z-40 w-96 max-w-[calc(100vw-2rem)] bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl border border-white/10 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white">
            <h3 className="font-bold text-lg">{t('sendMessage')}</h3>
            <p className="text-sm text-blue-100">{t('fillForm')}</p>
          </div>

          {/* Content */}
          <div className="p-4 max-h-96 overflow-y-auto">
            {currentMessage && currentMessage.status === 'replied' ? (
              // Show reply
              <div className="space-y-4">
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                  <p className="text-sm font-semibold text-blue-400 mb-2">{t('yourMessage')}:</p>
                  <p className="text-sm text-gray-300">{currentMessage.visitorMessage}</p>
                </div>
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                  <p className="text-sm font-semibold text-purple-400 mb-2">الرد:</p>
                  <p className="text-sm text-gray-300">{currentMessage.adminReply}</p>
                </div>
                <Button
                  onClick={() => {
                    setCurrentMessage(null);
                    setFormData({ name: '', email: '', phone: '', message: '' });
                    localStorage.removeItem('lastMessageId');
                  }}
                  className="w-full bg-blue-500 hover:bg-blue-600"
                >
                  {t('sendNewMessage')}
                </Button>
              </div>
            ) : (
              // Show form
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="text-sm text-gray-300 block mb-1">{t('fullName')}</label>
                  <Input
                    type="text"
                    placeholder={t('namePlaceholder')}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-300 block mb-1">{t('email')}</label>
                  <Input
                    type="email"
                    placeholder="example@mail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-300 block mb-1">{t('phone')}</label>
                  <Input
                    type="tel"
                    placeholder="+963..."
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-300 block mb-1">{t('message')}</label>
                  <Textarea
                    placeholder={t('messagePlaceholder')}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 min-h-[80px]"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  {isLoading ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      {t('sendButton')}
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
