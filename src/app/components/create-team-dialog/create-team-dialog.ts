import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-create-team-dialog',
  imports: [
    MatDialogModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule, 
    FormsModule,
    MatIconModule
  ],
  templateUrl: './create-team-dialog.html',
  styleUrl: './create-team-dialog.css',
  standalone: true
})
export class CreateTeamDialog {
  private dialogRef = inject(MatDialogRef<CreateTeamDialog>);
  teamName = signal<string>('');

  onCancel() {
    this.dialogRef.close();
  }

  onCreate() {
    if (this.teamName().trim()) {
      this.dialogRef.close(this.teamName().trim());
    }
  }
}