import { Component, inject, input, OnInit, signal } from '@angular/core';
import { TaskComment } from '../../models/task.model';
import { CommentService } from '../../services/comment-service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-comment-section',
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    DatePipe
  ],
  templateUrl: './comment-section.html',
  styleUrl: './comment-section.css',
  standalone: true
})
export class CommentSection implements OnInit {
  taskId = input.required<number>();
  
  comments = signal<TaskComment[]>([]);
  isLoading = signal(true);
  isSending = signal(false);
  newCommentText = signal('');
  errorMessage = signal<string | null>(null);

  private commentService = inject(CommentService);
  private snackBar = inject(MatSnackBar);

  ngOnInit() {
    this.loadComments();
  }

  loadComments() {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    
    this.commentService.getComments(this.taskId()).subscribe({
      next: (data) => {
        this.comments.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load comments', err);
        this.errorMessage.set('שגיאה בטעינת ההערות');
        this.isLoading.set(false);
        this.snackBar.open('לא הצלחנו לטעון את ההערות', 'סגור', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  addComment() {
    const text = this.newCommentText().trim();
    
    if (!text) {
      this.snackBar.open('אנא כתוב הערה לפני השליחה', 'סגור', {
        duration: 2000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    if (text.length > 500) {
      this.snackBar.open('ההערה ארוכה מדי (מקסימום 500 תווים)', 'סגור', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    this.isSending.set(true);
    
    this.commentService.addComment(this.taskId(), text).subscribe({
      next: (newComment) => {
        this.comments.update(prev => [...prev, newComment]);
        this.newCommentText.set('');
        this.isSending.set(false);
        this.snackBar.open('ההערה נוספה בהצלחה', 'סגור', {
          duration: 2000,
          panelClass: ['success-snackbar']
        });
      },
      error: (err) => {
        console.error('Failed to add comment', err);
        this.isSending.set(false);
        this.snackBar.open('שגיאה בהוספת ההערה', 'סגור', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  getUserInitials(userId: number): string {
    return `U${userId}`;
  }

  getRelativeTime(date: Date | string): string {
    const now = new Date();
    const commentDate = new Date(date);
    const diffMs = now.getTime() - commentDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'עכשיו';
    if (diffMins < 60) return `לפני ${diffMins} דקות`;
    if (diffHours < 24) return `לפני ${diffHours} שעות`;
    if (diffDays < 7) return `לפני ${diffDays} ימים`;
    return '';
  }
}