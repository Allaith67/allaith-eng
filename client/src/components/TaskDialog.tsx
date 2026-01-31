// TaskDialog component for creating and editing tasks
// Design: Kinetic Glass Morphism - glass modal with form inputs

import { Task, TaskPriority, TaskStatus } from '@/types/task';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState, useEffect } from 'react';

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task | null;
  onSave: (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  users: string[];
}

export default function TaskDialog({ open, onOpenChange, task, onSave, onUpdate, users }: TaskDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [assignedUser, setAssignedUser] = useState('');

  // Reset form when dialog opens with a task
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setPriority(task.priority);
      setStatus(task.status);
      setAssignedUser(task.assignedUser);
    } else {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setStatus('todo');
      setAssignedUser(users[0] || '');
    }
  }, [task, users, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      return;
    }

    if (task) {
      // Update existing task
      onUpdate(task.id, {
        title,
        description,
        priority,
        status,
        assignedUser
      });
    } else {
      // Create new task
      onSave({
        title,
        description,
        priority,
        status,
        assignedUser
      });
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-white/20 sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-foreground">
            {task ? 'تعديل المهمة' : 'إضافة مهمة جديدة'}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {task ? 'قم بتعديل تفاصيل المهمة' : 'أدخل تفاصيل المهمة الجديدة'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-foreground">عنوان المهمة</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="أدخل عنوان المهمة"
              className="glass-card border-white/20 text-foreground placeholder:text-muted-foreground"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground">الوصف</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="أدخل وصف المهمة"
              className="glass-card border-white/20 text-foreground placeholder:text-muted-foreground min-h-[100px]"
              required
            />
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label htmlFor="priority" className="text-foreground">الأولوية</Label>
            <Select value={priority} onValueChange={(value) => setPriority(value as TaskPriority)}>
              <SelectTrigger className="glass-card border-white/20 text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-card border-white/20">
                <SelectItem value="low">منخفضة</SelectItem>
                <SelectItem value="medium">متوسطة</SelectItem>
                <SelectItem value="high">عالية</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status" className="text-foreground">الحالة</Label>
            <Select value={status} onValueChange={(value) => setStatus(value as TaskStatus)}>
              <SelectTrigger className="glass-card border-white/20 text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-card border-white/20">
                <SelectItem value="todo">قيد الانتظار</SelectItem>
                <SelectItem value="in-progress">قيد التنفيذ</SelectItem>
                <SelectItem value="done">مكتملة</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Assigned User */}
          <div className="space-y-2">
            <Label htmlFor="user" className="text-foreground">المستخدم المعين</Label>
            <Select value={assignedUser} onValueChange={setAssignedUser}>
              <SelectTrigger className="glass-card border-white/20 text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-card border-white/20">
                {users.map(user => (
                  <SelectItem key={user} value={user}>{user}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="hover:bg-white/10"
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white glow-effect"
            >
              {task ? 'حفظ التعديلات' : 'إضافة المهمة'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
