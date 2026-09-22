import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {

  constructor(
    private authService: Auth,
    private router: Router
  ) {}

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
  isAdmin(): boolean {
    return localStorage.getItem('role') === 'Admin';
  }
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}