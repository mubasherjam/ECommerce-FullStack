import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { Auth } from '../../core/services/auth';
import { RegisterRequest } from '../../shared/models/register-request';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  registerRequest: RegisterRequest = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  };

  confirmPassword = '';

  errorMessage = signal('');
  successMessage = signal('');
  isLoading = signal(false);

  constructor(
    private authService: Auth,
    private router: Router
  ) {}

  register(): void {
    this.errorMessage.set('');
    this.successMessage.set('');

    if (this.registerRequest.password !== this.confirmPassword) {
      this.errorMessage.set('Passwords do not match.');
      return;
    }

    if (this.registerRequest.password.length < 6) {
      this.errorMessage.set('Password must be at least 6 characters.');
      return;
    }

    this.isLoading.set(true);

    this.authService
      .register(this.registerRequest)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: () => {
          this.successMessage.set('Registration successful! Redirecting to login...');

          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1500);
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

    return 'Unable to register. Please try again.';
  }
}