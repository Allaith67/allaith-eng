// TaskColumn component for kanban board
// Design: Kinetic Glass Morphism - glass columns with drag-and-drop support

import { Task, TaskStatus } from '@/types/task';
import TaskCard from './TaskCard';
import { useState } from 'react';

interface TaskColumnProps {
  status: TaskStatus;
  title: string;
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onDrop: (taskId: string, newStatus: TaskStatus) => void;
}

const statusColors: Record<TaskStatus, { bg: string; text: string; icon: string }> = {
  'todo': {
    bg: 'bg-blue-500/20',
    text: 'text-blue-400',
    icon: '📋'
  },
  'in-progress': {
    bg: 'bg-amber-500/20',
    text: 'text-amber-400',
    icon: '⚡'
  },
  'done': {
    bg: 'bg-green-500/20',
    text: 'text-green-400',
    icon: '✓'
  }
};

export default function TaskColumn({ status, title, tasks, onEdit, onDelete, onDrop }: TaskColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const colors = statusColors[status];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      onDrop(taskId, status);
    }
  };

  return (
    <div className="flex-1 min-w-[320px]">
      {/* Column Header */}
      <div className={`glass-card rounded-xl p-4 mb-4 ${colors.bg} border border-white/10`}>
        <div className="flex items-center justify-between">
          <h2 className={`font-display font-semibold text-xl ${colors.text} flex items-center gap-2`}>
            <span className="text-2xl">{colors.icon}</span>
            {title}
          </h2>
          <span className={`${colors.text} font-bold text-lg px-3 py-1 rounded-full bg-white/10`}>
            {tasks.length}
          </span>
        </div>
      </div>

      {/* Tasks Container */}
      <div
        className={`
          min-h-[500px] p-4 rounded-xl border-2 border-dashed
          transition-all duration-300
          ${isDragOver 
            ? 'border-blue-400 bg-blue-500/10 scale-[1.02]' 
            : 'border-white/20 bg-white/5'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="space-y-4">
          {tasks.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg">لا توجد مهام هنا</p>
              <p className="text-sm mt-2">اسحب المهام إلى هذا العمود</p>
            </div>
          ) : (
            tasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
