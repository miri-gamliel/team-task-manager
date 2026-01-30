import { Component, computed, inject, input, output } from '@angular/core';
import { Project } from '../../models/project.model';
import { TeamService } from '../../services/team-service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-project-card',
  imports: [
    CommonModule, 
    MatCardModule, 
    MatButtonModule, 
    MatIconModule, 
    MatChipsModule,
    MatTooltipModule
  ],
  templateUrl: './project-card.html',
  styleUrl: './project-card.css',
  standalone: true
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

  getStatusConfig(status: string) {
    const configs: { [key: string]: { color: string; icon: string; label: string } } = {
      'Active': { color: 'primary', icon: 'play_circle', label: 'פעיל' },
      'Completed': { color: 'accent', icon: 'check_circle', label: 'הושלם' },
      'On Hold': { color: 'warn', icon: 'pause_circle', label: 'בהמתנה' }
    };
    return configs[status] || { color: '', icon: 'help', label: status || 'ללא סטטוס' };
  }
}