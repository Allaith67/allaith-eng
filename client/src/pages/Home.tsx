// Home page - Main task board interface
// Design: Kinetic Glass Morphism - complete task management dashboard with glass effects

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Sparkles } from 'lucide-react';
import { useTasks } from '@/hooks/useTasks';
import TaskColumn from '@/components/TaskColumn';
import TaskDialog from '@/components/TaskDialog';
import TaskFilters from '@/components/TaskFilters';
import ContactForm from '@/components/ContactForm';
import FloatingChat from '@/components/FloatingChat';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MessageCircle } from 'lucide-react';
import { Task, TaskStatus } from '@/types/task';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageToggle } from '@/components/LanguageToggle';

export default function Home() {
  const { t } = useLanguage();
  const {
    tasksByStatus,
    uniqueUsers,
    filters,
    setFilters,
    searchInput,
    setSearchInput,
    addTask,
    updateTask,
    deleteTask,
    moveTask
  } = useTasks();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Simulate real-time updates from other users
  useEffect(() => {
    const interval = setInterval(() => {
      const shouldSimulate = Math.random() > 0.7; // 30% chance
      if (shouldSimulate) {
        const actions = [
          'قام أحمد بتحديث مهمة',
          'أضافت سارة مهمة جديدة',
          'أكمل محمد مهمة',
          'قامت ليلى بتعديل أولوية مهمة'
        ];
        const randomAction = actions[Math.floor(Math.random() * actions.length)];
        toast.info(randomAction, {
          duration: 3000,
          icon: '👥'
        });
      }
    }, 15000); // Every 15 seconds

    return () => clearInterval(interval);
  }, []);

  const handleAddTask = () => {
    setEditingTask(null);
    setIsDialogOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsDialogOpen(true);
  };

  const handleDeleteTask = (id: string) => {
    deleteTask(id);
    toast.success(t('taskDeleted'), {
      icon: '🗑️'
    });
  };

  const handleSaveTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    addTask(taskData);
    toast.success(t('taskAdded'), {
      icon: '✓'
    });
  };

  const handleUpdateTask = (id: string, updates: Partial<Task>) => {
    updateTask(id, updates);
    toast.success(t('taskUpdated'), {
      icon: '✓'
    });
  };

  const handleDrop = (taskId: string, newStatus: TaskStatus) => {
    moveTask(taskId, newStatus);
    toast.success(t('taskMoved'), {
      icon: '🎯'
    });
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background image */}
      <div 
        className="fixed inset-0 z-0 opacity-30"
        style={{
          backgroundImage: 'url(/images/hero-background.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />

      {/* Floating particles effect */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="container py-8">
          <div className="glass-card rounded-2xl p-6 border border-white/10 mb-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center glow-effect">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="font-display text-4xl font-bold text-foreground bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {t('appName')}
                  </h1>
                  <p className="text-muted-foreground mt-1">{t('appSubtitle')}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <LanguageToggle />
                
                <Dialog open={isContactOpen} onOpenChange={setIsContactOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="glass-card border-white/20 hover:bg-white/10 text-foreground px-6 py-6 text-lg"
                    >
                      <MessageCircle className="w-5 h-5 mr-2 text-blue-400" />
                      {t('contactUs')}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px] glass-card border-white/10 bg-black/40 backdrop-blur-xl text-foreground">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        {t('sendMessage')}
                      </DialogTitle>
                      <DialogDescription className="text-muted-foreground">
                        {t('fillForm')}
                      </DialogDescription>
                    </DialogHeader>
                    <ContactForm onSuccess={() => setIsContactOpen(false)} />
                  </DialogContent>
                </Dialog>

                <Button
                  onClick={handleAddTask}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white glow-effect px-6 py-6 text-lg"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  {t('addNewTask')}
                </Button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <TaskFilters
            filters={filters}
            onFiltersChange={setFilters}
            searchInput={searchInput}
            onSearchChange={setSearchInput}
            users={uniqueUsers}
          />
        </header>

        {/* Task Board */}
        <main className="container pb-12">
          <div className="flex flex-col lg:flex-row gap-6 overflow-x-auto">
            <TaskColumn
              status="todo"
              title={t('todo')}
              tasks={tasksByStatus.todo}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              onDrop={handleDrop}
            />
            <TaskColumn
              status="in-progress"
              title={t('inProgress')}
              tasks={tasksByStatus['in-progress']}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              onDrop={handleDrop}
            />
            <TaskColumn
              status="done"
              title={t('done')}
              tasks={tasksByStatus.done}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              onDrop={handleDrop}
            />
          </div>
        </main>

        {/* Footer */}
        <footer className="container py-8">
          <div className="glass-card rounded-xl p-4 border border-white/10 text-center">
            <p className="text-muted-foreground text-sm">
              © 2026 {t('appName')} - {t('allRightsReserved')}
            </p>
          </div>
        </footer>
      </div>

      {/* Task Dialog */}
      <TaskDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        task={editingTask}
        onSave={handleSaveTask}
        onUpdate={handleUpdateTask}
        users={uniqueUsers}
      />

      {/* Floating Chat Widget */}
      <FloatingChat />
    </div>
  );
}
