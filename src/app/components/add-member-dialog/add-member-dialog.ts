import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-add-member-dialog',
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule],
  templateUrl: './add-member-dialog.html',
  styleUrl: './add-member-dialog.css',
})
export class AddMemberDialog {
  private dialogRef = inject(MatDialogRef<AddMemberDialog>);
  public data = inject(MAT_DIALOG_DATA); 
  id: number = 0;

  onCancel() { this.dialogRef.close(); }
  onAdd() { this.dialogRef.close(this.id); } 
}
