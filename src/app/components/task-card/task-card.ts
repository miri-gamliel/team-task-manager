import { Component, inject, input, signal } from '@angular/core';
import { Task } from '../../models/task.model';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommentSection } from '../comment-section/comment-section';
import { TaskService } from '../../services/task-service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-task-card',
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule,
    DatePipe,
    CommentSection
  ],
  templateUrl: './task-card.html',
  styleUrl: './task-card.css',
  standalone: true
})
export class TaskCard {
  task = input.required<Task>();
  showComments = signal(false);
  
  private taskService = inject(TaskService);
  private snackBar = inject(MatSnackBar);

  getPriorityConfig(priority: string) {
    const configs: { [key: string]: { color: string; icon: string; label: string } } = {
      'HIGH': { color: '#ef4444', icon: 'priority_high', label: 'גבוהה' },
      'MEDIUM': { color: '#f59e0b', icon: 'drag_handle', label: 'בינונית' },
      'LOW': { color: '#10b981', icon: 'low_priority', label: 'נמוכה' }
    };
    return configs[priority?.toUpperCase()] || configs['LOW'];
  }

  getInitials(id?: number): string {
    return id ? `U${id}` : '?';
  }

  toggleComments(event: MouseEvent) {
    event.stopPropagation();
    this.showComments.update(v => !v);
  }

  onDelete(event: MouseEvent) {
    event.stopPropagation();
    
    const confirmed = confirm(`האם אתה בטוח שברצונך למחוק את המשימה "${this.task().title}"?`);
    
    if (confirmed) {
      this.taskService.deleteTask(this.task().id).subscribe({
        next: () => {
          this.snackBar.open('המשימה נמחקה בהצלחה', 'סגור', {
            duration: 2000,
            panelClass: ['success-snackbar']
          });
        },
        error: (err) => {
          console.error('Delete failed', err);
          this.snackBar.open('שגיאה במחיקת המשימה', 'סגור', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }
}