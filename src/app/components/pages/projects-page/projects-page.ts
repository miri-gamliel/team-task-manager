import { Component, computed, inject, input, signal } from '@angular/core';
import { ProjectService } from '../../../services/project-service';
import { TeamService } from '../../../services/team-service';
import { ProjectCard } from '../../project-card/project-card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { CreateProjectDialog } from '../../create-project-dialog/create-project-dialog';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-projects-page',
  imports: [
    CommonModule,
    ProjectCard, 
    MatProgressSpinnerModule, 
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './projects-page.html',
  styleUrl: './projects-page.css',
  standalone: true
})
export class ProjectsPage {

  teamId = input<string | undefined>();

  private projectService = inject(ProjectService);
  private teamService = inject(TeamService);
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

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
      return team ? `פרויקטים של צוות ${team.name}` : 'טוען צוות...';
    }
    return 'כל הפרויקטים שלי';
  });

  pageSubtitle = computed(() => {
    const count = this.displayProjects().length;
    if (count === 0) return 'אין פרויקטים להצגה';
    if (count === 1) return 'פרויקט אחד';
    return `${count} פרויקטים`;
  });

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    
    this.teamService.getTeams().subscribe();

    this.projectService.loadProjects().subscribe({
      next: () => {
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set('שגיאה בטעינת הפרויקטים');
        this.isLoading.set(false);
        this.snackBar.open('לא הצלחנו לטעון את הפרויקטים', 'סגור', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  openCreateProjectDialog() {
    const dialogRef = this.dialog.open(CreateProjectDialog, {
      width: '550px',
      direction: 'rtl',
      data: { teamId: Number(this.teamId()) }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.projectService.createProject(result).subscribe({
          next: () => {
            this.snackBar.open('הפרויקט נוצר בהצלחה!', 'סגור', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
          },
          error: (err) => {
            this.errorMessage.set('שגיאה ביצירת פרויקט');
            this.snackBar.open('שגיאה ביצירת הפרויקט', 'סגור', {
              duration: 3000,
              panelClass: ['error-snackbar']
            });
          }
        });
      }
    });
  }

  onViewTasks(projectId: number) {
    this.router.navigate(['/projects', projectId]);
  }

  backToTeams() {
    this.router.navigate(['/teams']);
  }
}