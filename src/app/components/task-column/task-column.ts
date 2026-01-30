import { Component, input, output } from '@angular/core';
import { Task, TaskStatus } from '../../models/task.model';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { TaskCard } from '../task-card/task-card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-task-column',
  imports: [
    CommonModule, 
    TaskCard, 
    DragDropModule,
    MatIconModule
  ],
  templateUrl: './task-column.html',
  styleUrl: './task-column.css',
  standalone: true
})
export class TaskColumn {
  title = input.required<string>();
  tasks = input.required<Task[]>();
  columnId = input.required<TaskStatus>();
  connectedTo = input<string[]>();
  dropped = output<CdkDragDrop<Task[]>>();

  getColumnIcon(): string {
    const icons: { [key: string]: string } = {
      'todo': 'playlist_add_check',
      'in_progress': 'sync',
      'done': 'check_circle'
    };
    return icons[this.columnId()] || 'list';
  }

  getColumnColor(): string {
    const colors: { [key: string]: string } = {
      'todo': '#3b82f6',
      'in_progress': '#f59e0b',
      'done': '#10b981'
    };
    return colors[this.columnId()] || '#718096';
  }
}