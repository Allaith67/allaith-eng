// TaskCard component with glass morphism design
// Design: Kinetic Glass Morphism - frosted glass cards with glow effects and smooth animations

import { Task, TaskPriority } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, User } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  isDragging?: boolean;
}

const priorityColors: Record<TaskPriority, { border: string; glow: string; text: string }> = {
  low: {
    border: 'border-l-blue-400',
    glow: 'hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]',
    text: 'text-blue-400'
  },
  medium: {
    border: 'border-l-amber-400',
    glow: 'hover:shadow-[0_0_20px_rgba(245,158,11,0.3)]',
    text: 'text-amber-400'
  },
  high: {
    border: 'border-l-pink-400',
    glow: 'hover:shadow-[0_0_20px_rgba(236,72,153,0.3)]',
    text: 'text-pink-400'
  }
};

export default function TaskCard({ task, onEdit, onDelete, isDragging }: TaskCardProps) {
  const { t, isRTL } = useLanguage();
  const colors = priorityColors[task.priority];

  const priorityLabels: Record<TaskPriority, string> = {
    low: t('low'),
    medium: t('medium'),
    high: t('high')
  };

  return (
    <div
      className={`
        glass-card rounded-xl p-4 border-l-4 ${colors.border}
        transition-all duration-300 ${colors.glow}
        ${isDragging ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}
        hover:translate-y-[-2px] cursor-move
      `}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('taskId', task.id);
      }}
    >
      {/* Task Title */}
      <h3 className="font-display font-semibold text-lg mb-2 text-foreground">
        {task.title}
      </h3>

      {/* Task Description */}
      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
        {task.description}
      </p>

      {/* Priority Badge */}
      <div className="flex items-center justify-between mb-3">
        <span className={`text-xs font-medium px-3 py-1 rounded-full ${colors.text} bg-white/5 backdrop-blur-sm`}>
          {t('priorityLabel')}: {priorityLabels[task.priority]}
        </span>
      </div>

      {/* Assigned User */}
      <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
        <User className="w-4 h-4" />
        <span>{task.assignedUser}</span>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-3 border-t border-white/10">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(task)}
          className="flex-1 hover:bg-white/10 hover:text-blue-400 transition-colors"
        >
          <Pencil className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          {t('edit')}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(task.id)}
          className="flex-1 hover:bg-white/10 hover:text-pink-400 transition-colors"
        >
          <Trash2 className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          {t('delete')}
        </Button>
      </div>
    </div>
  );
}
