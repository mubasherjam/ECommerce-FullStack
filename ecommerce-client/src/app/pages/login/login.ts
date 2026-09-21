import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { Auth } from '../../core/services/auth';
import { LoginRequest } from '../../shared/models/login-request';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginRequest: LoginRequest = {
    email: '',
    password: '',
  };

  errorMessage = signal('');
  successMessage = signal('');
  isLoading = signal(false);

  constructor(
    private authService: Auth,
    private router: Router
  ) {}

  login(): void {
    this.errorMessage.set('');
    this.successMessage.set('');
    this.isLoading.set(true);

    this.authService
      .login(this.loginRequest)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (response) => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('email', response.email);
          localStorage.setItem('role', response.role);

          this.successMessage.set('Login successful!');

          this.router.navigate(['/']);
        },
        error: (error: unknown) => {
          this.errorMessage.set(this.getErrorMessage(error));
        },
      });
  }

  private getErrorMessage(error: unknown): string {
    if (typeof error === 'string') {
      return error;
    }

    if (error && typeof error === 'object') {
      const httpError = error as {
        error?: string | { message?: string; error?: string };
        message?: string;
      };

      if (typeof httpError.error === 'string') {
        return httpError.error;
      }

      if (httpError.error && typeof httpError.error === 'object') {
        const nestedError = httpError.error as {
          message?: string;
          error?: string;
        };

        if (typeof nestedError.message === 'string') {
          return nestedError.message;
        }

        if (typeof nestedError.error === 'string') {
          return nestedError.error;
        }
      }

      if (typeof httpError.message === 'string') {
        return httpError.message;
      }
    }

    return 'Invalid email or password.';
  }
}