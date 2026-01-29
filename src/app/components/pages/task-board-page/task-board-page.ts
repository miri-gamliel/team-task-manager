import { Component, inject, input, signal } from '@angular/core';
import { ProjectService } from '../../../services/project-service';
import { TaskService } from '../../../services/task-service';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { TaskStatus } from '../../../models/task.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TaskColumn } from '../../task-column/task-column';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-task-board-page',
  imports: [TaskColumn, MatProgressSpinnerModule, DragDropModule, MatIcon],
  templateUrl: './task-board-page.html',
  styleUrl: './task-board-page.css',
})
export class TaskBoardPage {
  projectId = input.required<string>();
  public taskService = inject(TaskService);
  private projectService = inject(ProjectService);
  isLoading = signal(true);

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading.set(true);
    this.taskService.loadTasks(Number(this.projectId())).subscribe({
      next: () => this.isLoading.set(false),
      error: () => this.isLoading.set(false)
    });
  }

  onTaskDrop(event: CdkDragDrop<any>) {
    if (event.previousContainer !== event.container) {
      const taskId = event.item.data.id;
      const newStatus = event.container.id as TaskStatus; 

      this.taskService.updateTaskStatus(taskId, newStatus);
    }
  }

}
