// Custom hooks for task management
// Design: Kinetic Glass Morphism - React hooks for state management and effects

import { useState, useEffect, useMemo } from 'react';
import { Task, TaskFilters, TaskPriority, TaskStatus } from '@/types/task';
import { nanoid } from 'nanoid';

// Hook for debouncing search input
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Hook for local storage persistence
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  };

  return [storedValue, setValue];
}

// Generate sample tasks for demo
const generateSampleTasks = (): Task[] => {
  const users = ['Ahmed', 'Sara', 'Mohammed', 'Layla', 'Omar'];
  const titles = [
    'Design new landing page',
    'Fix authentication bug',
    'Update documentation',
    'Implement search feature',
    'Review pull requests',
    'Setup CI/CD pipeline',
    'Optimize database queries',
    'Create API endpoints',
    'Write unit tests',
    'Deploy to production'
  ];
  
  const descriptions = [
    'Complete the task with attention to detail',
    'Ensure all requirements are met',
    'Test thoroughly before submission',
    'Coordinate with team members',
    'Follow best practices and guidelines'
  ];

  const priorities: TaskPriority[] = ['low', 'medium', 'high'];
  const statuses: TaskStatus[] = ['todo', 'in-progress', 'done'];

  return titles.map((title, index) => ({
    id: nanoid(),
    title,
    description: descriptions[index % descriptions.length],
    priority: priorities[index % priorities.length],
    status: statuses[index % statuses.length],
    assignedUser: users[index % users.length],
    createdAt: Date.now() - (index * 3600000),
    updatedAt: Date.now() - (index * 3600000)
  }));
};

// Main hook for task management
export function useTasks() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('allaith-tasks', generateSampleTasks());
  const [filters, setFilters] = useState<TaskFilters>({});
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 300);

  // Filtered tasks based on current filters
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // Priority filter
      if (filters.priority && task.priority !== filters.priority) {
        return false;
      }
      
      // Assigned user filter
      if (filters.assignedUser && task.assignedUser !== filters.assignedUser) {
        return false;
      }
      
      // Search filter
      if (debouncedSearch) {
        const searchLower = debouncedSearch.toLowerCase();
        return (
          task.title.toLowerCase().includes(searchLower) ||
          task.description.toLowerCase().includes(searchLower) ||
          task.assignedUser.toLowerCase().includes(searchLower)
        );
      }
      
      return true;
    });
  }, [tasks, filters, debouncedSearch]);

  // Group tasks by status
  const tasksByStatus = useMemo(() => {
    return {
      todo: filteredTasks.filter(t => t.status === 'todo'),
      'in-progress': filteredTasks.filter(t => t.status === 'in-progress'),
      done: filteredTasks.filter(t => t.status === 'done')
    };
  }, [filteredTasks]);

  // Get unique users for filter dropdown
  const uniqueUsers = useMemo(() => {
    return Array.from(new Set(tasks.map(t => t.assignedUser))).sort();
  }, [tasks]);

  // Add new task
  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: nanoid(),
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    setTasks([...tasks, newTask]);
  };

  // Update task
  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(tasks.map(task => 
      task.id === id 
        ? { ...task, ...updates, updatedAt: Date.now() }
        : task
    ));
  };

  // Delete task
  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // Move task to different status
  const moveTask = (id: string, newStatus: TaskStatus) => {
    updateTask(id, { status: newStatus });
  };

  // Reorder tasks within a column
  const reorderTasks = (status: TaskStatus, startIndex: number, endIndex: number) => {
    const statusTasks = tasksByStatus[status];
    const [removed] = statusTasks.splice(startIndex, 1);
    statusTasks.splice(endIndex, 0, removed);
    
    // Update the main tasks array
    const otherTasks = tasks.filter(t => t.status !== status);
    setTasks([...otherTasks, ...statusTasks]);
  };

  return {
    tasks,
    filteredTasks,
    tasksByStatus,
    uniqueUsers,
    filters,
    setFilters,
    searchInput,
    setSearchInput,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    reorderTasks
  };
}
