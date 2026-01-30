import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TeamService } from '../../services/team-service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-project-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule, 
    MatDialogModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatSelectModule, 
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './create-project-dialog.html',
  styleUrl: './create-project-dialog.css',
  standalone: true
})
export class CreateProjectDialog {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<CreateProjectDialog>);
  private teamService = inject(TeamService);
  data = inject(MAT_DIALOG_DATA);
  
  teams = this.teamService.allTeams;
  isSubmitting = signal(false);

  projectForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    description: ['', [Validators.maxLength(200)]],
    teamId: [this.data?.teamId || '', Validators.required]
  });

  onCancel() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.projectForm.valid && !this.isSubmitting()) {
      this.isSubmitting.set(true);
      this.dialogRef.close(this.projectForm.value);
    }
  }

  getErrorMessage(fieldName: string): string {
    const field = this.projectForm.get(fieldName);
    
    if (!field || !field.touched || !field.errors) {
      return '';
    }

    if (field.errors['required']) {
      return `${this.getFieldLabel(fieldName)} הוא שדה חובה`;
    }

    if (fieldName === 'name') {
      if (field.errors['minlength']) return 'שם הפרויקט צריך להיות לפחות 3 תווים';
      if (field.errors['maxlength']) return 'שם הפרויקט לא יכול להיות יותר מ-50 תווים';
    }

    if (fieldName === 'description' && field.errors['maxlength']) {
      return 'התיאור לא יכול להיות יותר מ-200 תווים';
    }

    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      name: 'שם הפרויקט',
      teamId: 'צוות'
    };
    return labels[fieldName] || fieldName;
  }
}