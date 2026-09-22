import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Navbar } from '../../shared/components/navbar/navbar';
import { ProductService } from '../../core/services/product';
import { Product } from '../../shared/models/product';

@Component({
  selector: 'app-home',
  imports: [Navbar, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {

  products: Product[] = [];
  loading = true;

  constructor(
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.loadFeaturedProducts();
  }

  loadFeaturedProducts(): void {
    this.productService.getProducts().subscribe({
      next: (response) => {
        console.log('Home products:', response);

        this.products = response.slice(0, 4);
        this.loading = false;
      },

      error: (error) => {
        console.error('Failed to load products:', error);
        this.loading = false;
      }
    });
  }
}