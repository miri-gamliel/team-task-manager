import { Component, computed, inject, input, signal } from '@angular/core';
import { ProjectService } from '../../../services/project-service';
import { TeamService } from '../../../services/team-service';
import { ProjectCard } from '../../project-card/project-card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIcon } from "@angular/material/icon";
import { MatDialog } from '@angular/material/dialog';
import { CreateProjectDialog } from '../../create-project-dialog/create-project-dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-projects-page',
  imports: [ProjectCard, MatProgressSpinnerModule, MatIcon],
  templateUrl: './projects-page.html',
  styleUrl: './projects-page.css',
})
export class ProjectsPage {
  teamId = input<string | undefined>();

  private projectService = inject(ProjectService);
  private teamService = inject(TeamService);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  private dialog = inject(MatDialog);
  private router = inject(Router);
  displayProjects = computed(() => {
    const id = this.teamId();
    if (id) {
      return this.projectService.getProjectsByTeam(Number(id))();
    }
    return this.projectService.allProjects();
  });

  pageTitle = computed(() => {
    const id = this.teamId();
    if (id) {
      const team = this.teamService.allTeams().find(t => t.id === Number(id));
      return team ? `פרויקטים של צוות: ${team.name}` : 'טוען צוות...';
    }
    return 'כל הפרויקטים שלי';
  });

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading.set(true);
    
    this.teamService.getTeams().subscribe();

    this.projectService.loadProjects().subscribe({
      next: () => this.isLoading.set(false),
      error: (err) => {
        this.errorMessage.set(err.message);
        this.isLoading.set(false);
      }
    });
  }
  openCreateProjectDialog() {
  const dialogRef = this.dialog.open(CreateProjectDialog, {
    width: '450px',
    data: { teamId: Number(this.teamId()) } // מעבירים את ה-ID הנוכחי אם קיים
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.projectService.createProject(result).subscribe({
        next: () => {
          // בזכות ה-Signal ב-Service, הרשימה תתעדכן אוטומטית!
          console.log('Project created successfully');
        },
        error: (err) => this.errorMessage.set('שגיאה ביצירת פרויקט')
      });
    }
  });
}
onViewTasks(projectId: number) {
    console.log('נווט למשימות של פרויקט:', projectId);
    
    this.router.navigate(['/projects', projectId, 'tasks']);
  }
}
