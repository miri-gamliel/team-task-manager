import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TaskComment } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class CommentService {

  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  getComments(taskId: number): Observable<TaskComment[]> {
    return this.http.get<TaskComment[]>(`${this.apiUrl}/api/comments?taskId=${taskId}`);
  }

  addComment(taskId: number, body: string): Observable<TaskComment> {
    return this.http.post<TaskComment>(`${this.apiUrl}/api/comments`, {taskId:taskId, body:body });
  }
}
