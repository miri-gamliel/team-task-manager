import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { Team } from '../../models/team.model';
import { TeamService } from '../../services/team-service';
import { CommonModule } from '@angular/common';
import { TeamCard } from "../team-card/team-card";
import { Router } from '@angular/router';

@Component({
  selector: 'app-teams-card',
  imports: [CommonModule, TeamCard],
  templateUrl: './teams-card.html',
  styleUrl: './teams-card.css',
})
export class TeamsCard implements OnInit{

  authService = inject(AuthService);
  teamService = inject(TeamService);
  teams = signal<Team[]>([]);
  error = signal<string|null>(null);
  router = inject(Router);
  isLoading = signal<boolean>(false); 

  ngOnInit() {
    this.loadTeams();
  }

loadTeams() {
    this.isLoading.set(true);
    this.teamService.getTeams().subscribe({
      next: (teams) => {
        this.teams.set(teams);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('לא הצלחנו לטעון את הצוותים שלך');
        this.isLoading.set(false);
      }
    });
  }
  onTeamClick(teamId: number) {
    // כשלוחצים על צוות, עוברים לנתיב של הפרויקטים שלו
    this.router.navigate(['/teams', teamId]);
  }
}
