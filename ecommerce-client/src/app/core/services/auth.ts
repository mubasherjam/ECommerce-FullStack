import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { LoginRequest } from '../../shared/models/login-request';
import { AuthResponse } from '../../shared/models/auth-response';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  private apiUrl = 'https://localhost:44347/api/Auth';

  constructor(private http: HttpClient) {}

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/login`,
      request
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
  }
}