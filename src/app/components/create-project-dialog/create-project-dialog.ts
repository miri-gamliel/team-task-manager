import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TeamService } from '../../services/team-service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-create-project-dialog',
  imports: [ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule],
  templateUrl: './create-project-dialog.html',
  styleUrl: './create-project-dialog.css',
})
export class CreateProjectDialog {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<CreateProjectDialog>);
  private teamService = inject(TeamService);
  data = inject(MAT_DIALOG_DATA);
  teams = this.teamService.allTeams;

  projectForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
    teamId: [this.data?.teamId || '', Validators.required] 
  });

  onCancel() { this.dialogRef.close(); }

  onSubmit() {
    if (this.projectForm.valid) {
      this.dialogRef.close(this.projectForm.value);
    }
  }

}
