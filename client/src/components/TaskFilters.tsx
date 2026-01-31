// TaskFilters component for filtering and searching
// Design: Kinetic Glass Morphism - glass filter bar with search and dropdowns

import { TaskFilters as TaskFiltersType, TaskPriority } from '@/types/task';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TaskFiltersProps {
  filters: TaskFiltersType;
  onFiltersChange: (filters: TaskFiltersType) => void;
  searchInput: string;
  onSearchChange: (search: string) => void;
  users: string[];
}

export default function TaskFilters({ 
  filters, 
  onFiltersChange, 
  searchInput, 
  onSearchChange,
  users 
}: TaskFiltersProps) {
  
  const handlePriorityChange = (value: string) => {
    if (value === 'all') {
      onFiltersChange({ ...filters, priority: undefined });
    } else {
      onFiltersChange({ ...filters, priority: value as TaskPriority });
    }
  };

  const handleUserChange = (value: string) => {
    if (value === 'all') {
      onFiltersChange({ ...filters, assignedUser: undefined });
    } else {
      onFiltersChange({ ...filters, assignedUser: value });
    }
  };

  const clearFilters = () => {
    onFiltersChange({});
    onSearchChange('');
  };

  const hasActiveFilters = filters.priority || filters.assignedUser || searchInput;

  return (
    <div className="glass-card rounded-xl p-4 mb-6 border border-white/10">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="ابحث عن مهمة..."
            value={searchInput}
            onChange={(e) => onSearchChange(e.target.value)}
            className="glass-card border-white/20 text-foreground placeholder:text-muted-foreground pl-10"
          />
        </div>

        {/* Priority Filter */}
        <div className="w-full lg:w-48">
          <Select 
            value={filters.priority || 'all'} 
            onValueChange={handlePriorityChange}
          >
            <SelectTrigger className="glass-card border-white/20 text-foreground">
              <SelectValue placeholder="الأولوية" />
            </SelectTrigger>
            <SelectContent className="glass-card border-white/20">
              <SelectItem value="all">كل الأولويات</SelectItem>
              <SelectItem value="low">منخفضة</SelectItem>
              <SelectItem value="medium">متوسطة</SelectItem>
              <SelectItem value="high">عالية</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* User Filter */}
        <div className="w-full lg:w-48">
          <Select 
            value={filters.assignedUser || 'all'} 
            onValueChange={handleUserChange}
          >
            <SelectTrigger className="glass-card border-white/20 text-foreground">
              <SelectValue placeholder="المستخدم" />
            </SelectTrigger>
            <SelectContent className="glass-card border-white/20">
              <SelectItem value="all">كل المستخدمين</SelectItem>
              {users.map(user => (
                <SelectItem key={user} value={user}>{user}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={clearFilters}
            className="hover:bg-white/10 text-pink-400 hover:text-pink-300"
          >
            <X className="w-4 h-4 mr-2" />
            مسح الفلاتر
          </Button>
        )}
      </div>
    </div>
  );
}
