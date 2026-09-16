import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Auth } from '../../core/services/auth';
import { LoginRequest } from '../../shared/models/login-request';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  loginRequest: LoginRequest = {
    email: '',
    password: ''
  };

  errorMessage = '';
  successMessage = '';
  isLoading = false;

 constructor(
  private authService: Auth,
  private router: Router
) {}

  login(): void {

    this.errorMessage = '';
    this.successMessage = '';
    this.isLoading = true;

    this.authService.login(this.loginRequest).subscribe({
      
      next: (response) => {

        console.log('Login successful:', response);

        // Save JWT token
        localStorage.setItem('token', response.token);

        // Save user information
        localStorage.setItem('email', response.email);
        localStorage.setItem('role', response.role);

        this.successMessage = 'Login successful!';

        this.isLoading = false;

        this.router.navigate(['/']);
      },

      error: (error) => {

        console.error('Login failed:', error);

        this.errorMessage =
          error.error || 'Invalid email or password.';

        this.isLoading = false;
      }
    });
  }
}