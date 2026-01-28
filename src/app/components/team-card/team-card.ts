import { Component, inject, input, Input, output } from '@angular/core';
import { Team } from '../../models/team.model';
import { MatCard, MatCardHeader, MatCardTitle, MatCardSubtitle, MatCardContent, MatCardActions } from '@angular/material/card';
import {  MatIcon } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { TeamService } from '../../services/team-service';
import { AddMemberDialog } from '../add-member-dialog/add-member-dialog';
@Component({
  selector: 'app-team-card',
  imports: [MatCard, MatCardHeader, MatCardTitle, MatCardSubtitle, MatCardContent, MatIcon, DatePipe, MatCardActions],
  templateUrl: './team-card.html',
  styleUrl: './team-card.css',
})
export class TeamCard {
  
  team= input.required<Team>();
  select = output<number>();
  private dialog = inject(MatDialog);
  teamService = inject(TeamService);

  openAddUserDialog(event:MouseEvent) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(AddMemberDialog,{
      width: '400px',
      data: { teamName: this.team().name, teamId: this.team().id }
    })
    dialogRef.afterClosed().subscribe((result: number | undefined) => {
      if (result === undefined || result === null) {
        return;
      }
      this.teamService.addMemberToTeam(this.team().id, result).subscribe({
        next: () => {
          console.log('המשתמש נוסף בהצלחה לצוות');
          // TODO: רענון רשימת הצוותים/ספירת החברים אם נדרש
        },
        error: (err) => {
          const message = err?.error?.message || err?.message || 'אירעה שגיאה בהוספת המשתמש לצוות';
          console.error(message, err);
        }
      });
    });
  }

}
