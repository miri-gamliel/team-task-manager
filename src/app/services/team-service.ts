import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { CreateTeamRequest, Team } from '../models/team.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TeamService {

  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);
  selectedTeam = signal<Team | null>(null);
  private teamsSignal = signal<Team[]>([]);
  public allTeams = this.teamsSignal.asReadonly();
  
  getTeams(): Observable<Team[]> {
    return this.http.get<Team[]>(`${this.apiUrl}/api/teams`).pipe(
      tap(teams => this.teamsSignal.set(teams)),
      catchError((error) => {
        console.error('Error fetching teams:', error);
        return throwError(() => error);
      })
    );
  }

  createTeam(createTeamRequest: CreateTeamRequest): Observable<Team> {
    return this.http.post<Team>(`${this.apiUrl}/api/teams`, createTeamRequest).pipe(
      tap(newTeam => {
        this.teamsSignal.update(teams => [...teams, newTeam]);
      }),
      catchError((error) => {
        console.error('Error creating team:', error);
        return throwError(() => error);
      })
    );
  }

  addMemberToTeam(teamId: number, memberId: number) {
    return this.http.post<Team>(`${this.apiUrl}/api/teams/${teamId}/members`, { userId: memberId, role: "member" }).pipe(
      catchError((error) => {
        console.error('Error adding member to team:', error);
        return throwError(() => error);
      })
    );
  }

  selectTeam(team: Team | null) {
    this.selectedTeam.set(team);
  }

}
