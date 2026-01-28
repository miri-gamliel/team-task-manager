import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../models/auth.model';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  curruntUser = signal<User | null>(null);

  login(loginRequest:LoginRequest):Observable<User> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/api/auth/login`, loginRequest).pipe(
    tap((response)=>{
      sessionStorage.setItem('token', response.token);
      this.curruntUser.set(response.user);
    }),
    map((response:AuthResponse)=>
      response.user),
    catchError((error) => {
        console.error('Login error:', error);
        return throwError(() => error);
      })
    );
  }


  register(registerRequest:RegisterRequest): Observable<User> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/api/auth/register`, registerRequest).pipe(
      tap((response) => {
        sessionStorage.setItem('token', response.token);
        this.curruntUser.set(response.user);
       }),
      map((response: AuthResponse) => response.user),
      catchError((error) => {
        console.error('Registration error:', error);
        return throwError(() => error);
      })
    );
  }

  logout() {
    sessionStorage.removeItem('token');
    this.curruntUser.set(null);
  }

  getToken(): string | null {
    return sessionStorage.getItem('token');
  }
}
