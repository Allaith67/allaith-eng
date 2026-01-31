// Home page - Main task board interface
// Design: Kinetic Glass Morphism - complete task management dashboard with glass effects

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Sparkles } from 'lucide-react';
import { useTasks } from '@/hooks/useTasks';
import TaskColumn from '@/components/TaskColumn';
import TaskDialog from '@/components/TaskDialog';
import TaskFilters from '@/components/TaskFilters';
import { Task, TaskStatus } from '@/types/task';
import { toast } from 'sonner';

export default function Home() {
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
    toast.success('تم حذف المهمة بنجاح', {
      icon: '🗑️'
    });
  };

  const handleSaveTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    addTask(taskData);
    toast.success('تم إضافة المهمة بنجاح', {
      icon: '✓'
    });
  };

  const handleUpdateTask = (id: string, updates: Partial<Task>) => {
    updateTask(id, updates);
    toast.success('تم تحديث المهمة بنجاح', {
      icon: '✓'
    });
  };

  const handleDrop = (taskId: string, newStatus: TaskStatus) => {
    moveTask(taskId, newStatus);
    toast.success('تم نقل المهمة بنجاح', {
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
                    ALLAITH eng
                  </h1>
                  <p className="text-muted-foreground mt-1">لوحة إدارة المهام التعاونية</p>
                </div>
              </div>
              <Button
                onClick={handleAddTask}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white glow-effect px-6 py-6 text-lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                إضافة مهمة جديدة
              </Button>
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
              title="قيد الانتظار"
              tasks={tasksByStatus.todo}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              onDrop={handleDrop}
            />
            <TaskColumn
              status="in-progress"
              title="قيد التنفيذ"
              tasks={tasksByStatus['in-progress']}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              onDrop={handleDrop}
            />
            <TaskColumn
              status="done"
              title="مكتملة"
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
              © 2026 ALLAITH eng - جميع الحقوق محفوظة
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
    </div>
  );
}
