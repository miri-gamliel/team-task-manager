// נגדיר את הערכים האפשריים כדי למנוע שגיאות כתיב בקוד
export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type TaskPriority = 'low' | 'normal' | 'high';

export interface Task {
  id: number;
  project_id: number; // השרת מחזיר snake_case
  assignee_id: number; // השרת מחזיר snake_case
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskRequest {
  projectId: number; // שולחים camelCase
  assigneeId: number; // שולחים camelCase
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  orderIndex: number;
}

// ב-PATCH אנחנו שולחים רק חלק מהשדות (Partial)
export interface UpdateTaskRequest {
  status?: TaskStatus;
  priority?: TaskPriority;
  title?: string;
  description?: string;
  assigneeId?: number;
  dueDate?: string;
  orderIndex?: number;
}

export interface AddCommentRequest {
  taskId: number;
  body: string;
}

export interface TaskComment {
  id: number;
  task_id: number;
  user_id: number; 
  body: string; 
  created_at: string | Date;
}