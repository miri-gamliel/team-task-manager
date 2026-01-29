import { Component, input, output } from '@angular/core';
import { Task, TaskStatus } from '../../models/task.model';
import { CdkDragDrop,CdkDropList, DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { TaskCard } from '../task-card/task-card';

@Component({
  selector: 'app-task-column',
  imports: [CommonModule, TaskCard, DragDropModule],
  templateUrl: './task-column.html',
  styleUrl: './task-column.css',
})
export class TaskColumn {
  title = input.required<string>();
  tasks = input.required<Task[]>();
  columnId = input.required<TaskStatus>();
  connectedTo = input<string[]>();  // חדש
  dropped = output<CdkDragDrop<any>>();
}
