import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { Send, User, Mail, Phone, MessageSquare } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, { message: 'الاسم يجب أن يكون أكثر من حرفين' }),
  email: z.string().email({ message: 'يرجى إدخال بريد إلكتروني صحيح' }),
  phone: z.string().min(5, { message: 'يرجى إدخال رقم هاتف صحيح' }),
  message: z.string().min(10, { message: 'الرسالة يجب أن تكون 10 أحرف على الأقل' }),
});

interface ContactFormProps {
  onSuccess?: () => void;
}

export default function ContactForm({ onSuccess }: ContactFormProps) {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      message: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        toast.success('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.', {
          icon: '🚀',
        });
        form.reset();
        if (onSuccess) onSuccess();
      } else {
        throw new Error('فشل إرسال الرسالة');
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.', {
        icon: '❌',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-400" />
                  الاسم الكامل
                </FormLabel>
                <FormControl>
                  <Input placeholder="أدخل اسمك هنا" {...field} className="glass-input" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-purple-400" />
                    البريد الإلكتروني
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="example@mail.com" {...field} className="glass-input" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-green-400" />
                    رقم الهاتف
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="+963..." {...field} className="glass-input" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-pink-400" />
                  الرسالة
                </FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="كيف يمكننا مساعدتك؟" 
                    className="min-h-[120px] glass-input" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white glow-effect py-6 text-lg"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                جاري الإرسال...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Send className="w-5 h-5" />
                إرسال الرسالة
              </span>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
