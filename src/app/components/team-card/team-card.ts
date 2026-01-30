import { Component, inject, input, output, signal } from '@angular/core';
import { Team } from '../../models/team.model';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { TeamService } from '../../services/team-service';
import { AddMemberDialog } from '../add-member-dialog/add-member-dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-team-card',
  imports: [
    MatCardModule, 
    MatIconModule, 
    MatButtonModule,
    DatePipe,
    MatTooltipModule
  ],
  templateUrl: './team-card.html',
  styleUrl: './team-card.css',
  standalone: true
})
export class TeamCard {
  
  team = input.required<Team>();
  select = output<number>();
  memberAdded = output<void>();
  private dialog = inject(MatDialog);
  private teamService = inject(TeamService);
  private snackBar = inject(MatSnackBar);

  openAddUserDialog(event: MouseEvent) {
    event.stopPropagation();
    
    const dialogRef = this.dialog.open(AddMemberDialog, {
      width: '450px',
      direction: 'rtl',
      data: { 
        teamName: this.team().name, 
        teamId: this.team().id 
      }
    });

    dialogRef.afterClosed().subscribe((userId: number | undefined) => {
      if (userId === undefined || userId === null) {
        return;
      }

      this.teamService.addMemberToTeam(this.team().id, userId).subscribe({
        next: () => {
          //איך אני מעדכנת פה את מספר החברים בקבוצה שיתעדכן מייד בתצוגה?
          this.snackBar.open('המשתמש נוסף בהצלחה לצוות!', 'סגור', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.memberAdded.emit();
        },
        error: (err) => {
          const message = err?.error?.message || 'אירעה שגיאה בהוספת המשתמש';
          this.snackBar.open(message, 'סגור', {
            duration: 4000,
            panelClass: ['error-snackbar']
          });
        }
      });
    });
  }
}