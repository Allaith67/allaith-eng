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
import { useLanguage } from '@/contexts/LanguageContext';

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
  const { t, isRTL } = useLanguage();
  
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
          <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground`} />
          <Input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={searchInput}
            onChange={(e) => onSearchChange(e.target.value)}
            className={`glass-card border-white/20 text-foreground placeholder:text-muted-foreground ${isRTL ? 'pr-10' : 'pl-10'}`}
          />
        </div>

        {/* Priority Filter */}
        <div className="w-full lg:w-48">
          <Select 
            value={filters.priority || 'all'} 
            onValueChange={handlePriorityChange}
          >
            <SelectTrigger className="glass-card border-white/20 text-foreground">
              <SelectValue placeholder={t('priority')} />
            </SelectTrigger>
            <SelectContent className="glass-card border-white/20">
              <SelectItem value="all">{t('allPriorities')}</SelectItem>
              <SelectItem value="low">{t('low')}</SelectItem>
              <SelectItem value="medium">{t('medium')}</SelectItem>
              <SelectItem value="high">{t('high')}</SelectItem>
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
              <SelectValue placeholder={t('userFilter')} />
            </SelectTrigger>
            <SelectContent className="glass-card border-white/20">
              <SelectItem value="all">{t('allUsers')}</SelectItem>
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
            <X className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {t('clearFilters')}
          </Button>
        )}
      </div>
    </div>
  );
}
