import { Component, input } from '@angular/core';
import { Task } from '../../models/task.model';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-task-card',
  imports: [CommonModule, MatCardModule, MatIconModule, MatChipsModule, DatePipe,DragDropModule],
  templateUrl: './task-card.html',
  styleUrl: './task-card.css',
})
export class TaskCard {
  task = input.required<Task>();

  getPriorityClass(priority: string) {
    switch (priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return 'priority-low';
    }
  }

  getInitials(id?: number) {
    return id ? 'U' + id : '?';
  }


}
