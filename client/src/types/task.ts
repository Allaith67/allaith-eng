// Task management types for ALLAITH eng
// Design: Kinetic Glass Morphism - structured data types for task board

export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  assignedUser: string;
  createdAt: number;
  updatedAt: number;
}

export interface TaskFilters {
  priority?: TaskPriority;
  assignedUser?: string;
  searchTerm?: string;
}

export interface TaskUpdate {
  id: string;
  field: keyof Task;
  value: any;
  timestamp: number;
}
