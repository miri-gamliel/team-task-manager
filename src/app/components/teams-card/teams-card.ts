import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { Team } from '../../models/team.model';
import { TeamService } from '../../services/team-service';
import { CommonModule } from '@angular/common';
import { TeamCard } from "../team-card/team-card";
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { CreateTeamDialog } from '../create-team-dialog/create-team-dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-teams-card',
  imports: [
    CommonModule, 
    TeamCard, 
    MatButtonModule, 
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './teams-card.html',
  styleUrl: './teams-card.css',
  standalone: true
})
export class TeamsCard implements OnInit {

  authService = inject(AuthService);
  teamService = inject(TeamService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  teams = signal<Team[]>([]);
  error = signal<string | null>(null);
  router = inject(Router);
  isLoading = signal<boolean>(false);

  ngOnInit() {
    this.loadTeams();
  }

  loadTeams() {
    this.isLoading.set(true);
    this.error.set(null);
    
    this.teamService.getTeams().subscribe({
      next: (teams) => {
        this.teams.set(teams);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('לא הצלחנו לטעון את הצוותים שלך');
        this.isLoading.set(false);
        this.snackBar.open('שגיאה בטעינת הצוותים', 'סגור', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  onTeamClick(teamId: number) {
    this.router.navigate(['/teams', teamId]);
  }

  openCreateTeamDialog() {
    const dialogRef = this.dialog.open(CreateTeamDialog, {
      width: '500px',
      direction: 'rtl'
    });

  dialogRef.afterClosed().subscribe((teamName: string | undefined) => {
    if (!teamName) return;
 
    this.teamService.createTeam({ name: teamName }).subscribe({
      next: (newTeam) => {
        this.snackBar.open('הצוות נוצר בהצלחה!', 'סגור', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.loadTeams();
      },
      error: () => {
        this.snackBar.open('שגיאה ביצירת הצוות', 'סגור', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  });
  }
}