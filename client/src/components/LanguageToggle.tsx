import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Languages } from 'lucide-react';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="glass-card border-white/10 hover:bg-white/10 text-foreground flex items-center gap-2 px-3"
    >
      <Languages className="w-4 h-4" />
      <span className="font-medium">
        {language === 'ar' ? 'English' : 'العربية'}
      </span>
    </Button>
  );
}
