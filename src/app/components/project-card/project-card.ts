import { Component, computed, inject, input, output } from '@angular/core';
import { Project } from '../../models/project.model';
import { TeamService } from '../../services/team-service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-project-card',
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatChipsModule],
  templateUrl: './project-card.html',
  styleUrl: './project-card.css',
})
export class ProjectCard {
  project = input.required<Project>();
  private teamService = inject(TeamService);
  viewTasks = output<number>();

  teamName = computed(() => {
    const teams = this.teamService.allTeams();
    const team = teams.find(t => t.id === this.project().team_id);
    return team ? team.name : 'צוות לא ידוע';
  });

  getStatusColor(status: string) {
    switch (status) {
      case 'Active': return 'primary';
      case 'Completed': return 'accent';
      case 'On Hold': return 'warn';
      default: return '';
    }
  }

}
