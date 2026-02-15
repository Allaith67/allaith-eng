import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'ar' | 'en';

interface Translations {
  [key: string]: {
    ar: string;
    en: string;
  };
}

export const translations: Translations = {
  appName: {
    ar: 'ALLAITH eng',
    en: 'ALLAITH eng'
  },
  appSubtitle: {
    ar: 'لوحة إدارة المهام التعاونية',
    en: 'Collaborative Task Management Board'
  },
  addNewTask: {
    ar: 'إضافة مهمة جديدة',
    en: 'Add New Task'
  },
  todo: {
    ar: 'قيد الانتظار',
    en: 'To Do'
  },
  inProgress: {
    ar: 'قيد التنفيذ',
    en: 'In Progress'
  },
  done: {
    ar: 'مكتملة',
    en: 'Done'
  },
  allRightsReserved: {
    ar: 'جميع الحقوق محفوظة',
    en: 'All rights reserved'
  },
  editTask: {
    ar: 'تعديل المهمة',
    en: 'Edit Task'
  },
  editTaskDetails: {
    ar: 'قم بتعديل تفاصيل المهمة',
    en: 'Edit task details'
  },
  enterNewTaskDetails: {
    ar: 'أدخل تفاصيل المهمة الجديدة',
    en: 'Enter new task details'
  },
  taskTitle: {
    ar: 'عنوان المهمة',
    en: 'Task Title'
  },
  enterTaskTitle: {
    ar: 'أدخل عنوان المهمة',
    en: 'Enter task title'
  },
  description: {
    ar: 'الوصف',
    en: 'Description'
  },
  enterTaskDescription: {
    ar: 'أدخل وصف المهمة',
    en: 'Enter task description'
  },
  priority: {
    ar: 'الأولوية',
    en: 'Priority'
  },
  status: {
    ar: 'الحالة',
    en: 'Status'
  },
  assignedUser: {
    ar: 'المستخدم المعين',
    en: 'Assigned User'
  },
  cancel: {
    ar: 'إلغاء',
    en: 'Cancel'
  },
  saveChanges: {
    ar: 'حفظ التعديلات',
    en: 'Save Changes'
  },
  addTask: {
    ar: 'إضافة المهمة',
    en: 'Add Task'
  },
  low: {
    ar: 'منخفضة',
    en: 'Low'
  },
  medium: {
    ar: 'متوسطة',
    en: 'Medium'
  },
  high: {
    ar: 'عالية',
    en: 'High'
  },
  taskDeleted: {
    ar: 'تم حذف المهمة بنجاح',
    en: 'Task deleted successfully'
  },
  taskAdded: {
    ar: 'تم إضافة المهمة بنجاح',
    en: 'Task added successfully'
  },
  taskUpdated: {
    ar: 'تم تحديث المهمة بنجاح',
    en: 'Task updated successfully'
  },
  taskMoved: {
    ar: 'تم نقل المهمة بنجاح',
    en: 'Task moved successfully'
  },
  searchPlaceholder: {
    ar: 'البحث عن المهام...',
    en: 'Search tasks...'
  },
  filterByUser: {
    ar: 'تصفية حسب المستخدم',
    en: 'Filter by user'
  },
  allUsers: {
    ar: 'جميع المستخدمين',
    en: 'All Users'
  },
  allPriorities: {
    ar: 'كل الأولويات',
    en: 'All Priorities'
  },
  clearFilters: {
    ar: 'مسح الفلاتر',
    en: 'Clear Filters'
  },
  userFilter: {
    ar: 'المستخدم',
    en: 'User'
  },
  noTasks: {
    ar: 'لا توجد مهام هنا',
    en: 'No tasks here'
  },
  dragTasks: {
    ar: 'اسحب المهام إلى هذا العمود',
    en: 'Drag tasks to this column'
  },
  priorityLabel: {
    ar: 'الأولوية',
    en: 'Priority'
  },
  edit: {
    ar: 'تعديل',
    en: 'Edit'
  },
  delete: {
    ar: 'حذف',
    en: 'Delete'
  },
  pageNotFound: {
    ar: 'الصفحة غير موجودة',
    en: 'Page Not Found'
  },
  pageNotFoundDesc: {
    ar: 'عذراً، الصفحة التي تبحث عنها غير موجودة. قد تكون قد نُقلت أو حُذفت.',
    en: "Sorry, the page you are looking for doesn't exist. It may have been moved or deleted."
  },
  goHome: {
    ar: 'العودة للرئيسية',
    en: 'Go Home'
  },
  contactUs: {
    ar: 'تواصل معنا',
    en: 'Contact Us'
  },
  sendMessage: {
    ar: 'أرسل لنا رسالة',
    en: 'Send us a message'
  },
  fillForm: {
    ar: 'املأ النموذج أدناه وسنقوم بالرد عليك في أقرب وقت ممكن.',
    en: 'Fill out the form below and we will get back to you as soon as possible.'
  },
  fullName: {
    ar: 'الاسم الكامل',
    en: 'Full Name'
  },
  namePlaceholder: {
    ar: 'أدخل اسمك هنا',
    en: 'Enter your name here'
  },
  email: {
    ar: 'البريد الإلكتروني',
    en: 'Email Address'
  },
  phone: {
    ar: 'رقم الهاتف',
    en: 'Phone Number'
  },
  message: {
    ar: 'الرسالة',
    en: 'Message'
  },
  messagePlaceholder: {
    ar: 'كيف يمكننا مساعدتك؟',
    en: 'How can we help you?'
  },
  sending: {
    ar: 'جاري الإرسال...',
    en: 'Sending...'
  },
  sendButton: {
    ar: 'إرسال الرسالة',
    en: 'Send Message'
  },
  successMessage: {
    ar: 'تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.',
    en: 'Your message has been sent successfully! We will contact you soon.'
  },
  errorMessage: {
    ar: 'حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.',
    en: 'An error occurred while sending the message. Please try again.'
  },
  nameError: {
    ar: 'الاسم يجب أن يكون أكثر من حرفين',
    en: 'Name must be more than 2 characters'
  },
  emailError: {
    ar: 'يرجى إدخال بريد إلكتروني صحيح',
    en: 'Please enter a valid email address'
  },
  phoneError: {
    ar: 'يرجى إدخال رقم هاتف صحيح',
    en: 'Please enter a valid phone number'
  },
  messageError: {
    ar: 'الرسالة يجب أن تكون 10 أحرف على الأقل',
    en: 'Message must be at least 10 characters'
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'ar';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string) => {
    return translations[key]?.[language] || key;
  };

  const isRTL = language === 'ar';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
