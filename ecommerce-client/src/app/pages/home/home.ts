import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Navbar } from '../../shared/components/navbar/navbar';

@Component({
  selector: 'app-home',
  imports: [Navbar],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

  message = '';

  constructor(private http: HttpClient) {}

  testProtectedApi(): void {

    this.http
      .get('https://localhost:44347/api/test/protected', {
        responseType: 'text'
      })
      .subscribe({
        next: (response) => {
          console.log(response);
          this.message = response;
        },

        error: (error) => {
          console.error(error);
          this.message = 'Request failed.';
        }
      });
  }
}