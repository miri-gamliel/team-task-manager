import { Component, inject, input, signal, computed } from '@angular/core';
import { ProjectService } from '../../../services/project-service';
import { TaskService } from '../../../services/task-service';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { Task, TaskStatus } from '../../../models/task.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TaskColumn } from '../../task-column/task-column';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { AddTaskDialog } from '../../add-task-dialog/add-task-dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-board-page',
  imports: [
    CommonModule,
    TaskColumn, 
    MatProgressSpinnerModule, 
    DragDropModule, 
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './task-board-page.html',
  styleUrl: './task-board-page.css',
  standalone: true
})
export class TaskBoardPage {
  projectId = input.required<string>();
  
  public taskService = inject(TaskService);
  private projectService = inject(ProjectService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);
  
  isLoading = signal(true);
  errorMessage = signal<string | null>(null);

  allColumnIds: TaskStatus[] = ['todo', 'in_progress', 'done'];

  projectName = computed(() => {
    const projects = this.projectService.allProjects();
    const project = projects.find(p => p.id === Number(this.projectId()));
    return project?.name || 'פרויקט';
  });

  totalTasks = computed(() => {
    return this.taskService.todoTasks().length +
           this.taskService.inProgressTasks().length +
           this.taskService.doneTasks().length;
  });

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    
    this.taskService.loadTasks(Number(this.projectId())).subscribe({
      next: () => {
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set('שגיאה בטעינת המשימות');
        this.isLoading.set(false);
        this.snackBar.open('לא הצלחנו לטעון את המשימות', 'סגור', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  onTaskDrop(event: CdkDragDrop<Task[]>) {
    console.log('Task dropped:', event);
    
    if (event.previousContainer === event.container) {
      // אותו עמודה - רק שינוי סדר (אופציונלי)
      return;
    }

    const task = event.item.data as Task;
    const newStatus = event.container.id as TaskStatus;

    if (!task || !newStatus) {
      console.error('Invalid drop data');
      return;
    }

    console.log(`Moving task ${task.id} from ${task.status} to ${newStatus}`);

    this.taskService.updateTaskStatus(task.id, newStatus).subscribe({
      next: () => {
        this.snackBar.open('המשימה עודכנה בהצלחה', 'סגור', {
          duration: 2000,
          panelClass: ['success-snackbar']
        });
      },
      error: (err) => {
        console.error('Failed to update task status:', err);
        this.snackBar.open('שגיאה בעדכון המשימה', 'סגור', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        // רענון לסנכרון מחדש
        this.loadData();
      }
    });
  }

  columnDataMap = {
    'todo': () => this.taskService.todoTasks(),
    'in_progress': () => this.taskService.inProgressTasks(),
    'done': () => this.taskService.doneTasks()
  };

  columnTitles = {
    'todo': 'לביצוע',
    'in_progress': 'בתהליך',
    'done': 'הושלם'
  };

  openAddTaskDialog() {
    const dialogRef = this.dialog.open(AddTaskDialog, {
      width: '550px',
      direction: 'rtl',
      data: { projectId: Number(this.projectId()) }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.taskService.createTask(result).subscribe({
          next: () => {
            this.snackBar.open('המשימה נוצרה בהצלחה!', 'סגור', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
          },
          error: (err) => {
            console.error('Error creating task', err);
            this.snackBar.open('שגיאה ביצירת המשימה', 'סגור', {
              duration: 3000,
              panelClass: ['error-snackbar']
            });
          }
        });
      }
    });
  }

  backToProjects() {
    this.router.navigate(['/projects']);
  }
}