import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { CreateProjectRequest, Project } from '../models/project.model';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  private projectsSignal = signal<Project[]>([]);
  public allProjects = this.projectsSignal.asReadonly();

  loadProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiUrl}/api/projects`).pipe(
      tap((data) => this.projectsSignal.set(data)),
      catchError(this.handleError));
  }

  getProjectsByTeam(teamId: number) {
    return computed(() =>
      this.projectsSignal().filter(project => project.team_id === teamId)
    );
  }

  createProject(projectData: CreateProjectRequest): Observable<Project> {
    return this.http.post<Project>(`${this.apiUrl}/api/projects`, projectData).pipe(
      tap((newProject) => {
        this.projectsSignal.update(projects => [...projects, newProject]);
      }),
      catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'חלה שגיאה לא ידועה';

    if (error.error instanceof ErrorEvent) {
      // שגיאת צד לקוח (Client-side)
      errorMessage = `שגיאה: ${error.error.message}`;
    } else {
      // שגיאת צד שרת (Server-side)
      console.error(`קוד שגיאה: ${error.status}, הודעה: ${error.message}`);
      errorMessage = `שגיאת שרת: ${error.status}`;
    }

    // אנחנו זורקים את השגיאה הלאה כדי שהקומפוננטה תוכל לעשות לה Subscribe
    return throwError(() => new Error(errorMessage));
  }
}
