import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-add-task-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule
  ],
  templateUrl: './add-task-dialog.html',
  styleUrl: './add-task-dialog.css',
  standalone: true
})
export class AddTaskDialog {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<AddTaskDialog>);
  data = inject(MAT_DIALOG_DATA);

  isSubmitting = signal(false);

  taskForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    description: ['', [Validators.maxLength(500)]],
    priority: ['MEDIUM', Validators.required],
    assigneeId: [null as number | null]
  });

  priorityOptions = [
    { value: 'LOW', label: 'נמוכה', icon: 'low_priority', color: '#10b981' },
    { value: 'MEDIUM', label: 'בינונית', icon: 'drag_handle', color: '#f59e0b' },
    { value: 'HIGH', label: 'גבוהה', icon: 'priority_high', color: '#ef4444' }
  ];

  onCancel() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.taskForm.valid && !this.isSubmitting()) {
      this.isSubmitting.set(true);
      
      const formValue = this.taskForm.value;
      const newTask = {
        title: formValue.title!,
        description: formValue.description || '',
        priority: formValue.priority!,
        assigneeId: formValue.assigneeId || undefined,
        status: 'todo',
        projectId: this.data.projectId
      };

      this.dialogRef.close(newTask);
    }
  }

  getErrorMessage(fieldName: string): string {
    const field = this.taskForm.get(fieldName);
    
    if (!field || !field.touched || !field.errors) {
      return '';
    }

    if (field.errors['required']) {
      return `${this.getFieldLabel(fieldName)} הוא שדה חובה`;
    }

    if (fieldName === 'title') {
      if (field.errors['minlength']) return 'כותרת המשימה צריכה להיות לפחות 3 תווים';
      if (field.errors['maxlength']) return 'כותרת המשימה לא יכולה להיות יותר מ-100 תווים';
    }

    if (fieldName === 'description' && field.errors['maxlength']) {
      return 'התיאור לא יכול להיות יותר מ-500 תווים';
    }

    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      title: 'כותרת',
      priority: 'עדיפות'
    };
    return labels[fieldName] || fieldName;
  }
}