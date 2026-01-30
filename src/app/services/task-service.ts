import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { CreateTaskRequest, Task, TaskPriority, TaskStatus } from '../models/task.model';
import { tap, catchError, throwError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  private tasksSignal = signal<Task[]>([]);

  public tasks = this.tasksSignal.asReadonly();
  public todoTasks = computed(() => this.tasksSignal().filter(t => t.status === 'todo'));
  public inProgressTasks = computed(() => this.tasksSignal().filter(t => t.status === 'in_progress'));
  public doneTasks = computed(() => this.tasksSignal().filter(t => t.status === 'done'));

  loadTasks(projectId: number) {
    return this.http.get<Task[]>(`${this.apiUrl}/api/tasks/?projectId=${projectId}`).pipe(
      tap(tasks => this.tasksSignal.set(tasks)),
      catchError(err => {
        console.error('Error loading tasks', err);
        return throwError(() => err);
      })
    );
  }

  createTask(taskData: CreateTaskRequest): Observable<Task> {
    return this.http.post<Task>(`${this.apiUrl}/api/tasks`, taskData).pipe(
      tap(newTask => {
        this.tasksSignal.update(tasks => [...tasks, newTask]);
      })
    );
  }
  
  updateTaskStatus(taskId: number, newStatus: TaskStatus ):Observable<Task>{
    const previousTasks = this.tasksSignal();

    this.tasksSignal.update(tasks => 
      tasks.map(t => t.id === taskId ? { ...t, status: newStatus} : t)
    );

    return this.http.patch<Task>(`${this.apiUrl}/api/tasks/${taskId}`, { status: newStatus }).pipe(
      catchError(err => {
        console.error('Update failed, rolling back', err);
        this.tasksSignal.set(previousTasks);
        return throwError(() => err);
      })
    );
  }

deleteTask(taskId: number): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/api/tasks/${taskId}`).pipe(
    tap(() => {
      this.tasksSignal.update(tasks => tasks.filter(t => t.id !== taskId));
    })
  );
  
}
}
