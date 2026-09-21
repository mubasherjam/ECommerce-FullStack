import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ProductService } from '../../core/services/product';
import { Product } from '../../shared/models/product';
import { Navbar } from '../../shared/components/navbar/navbar';

@Component({
  selector: 'app-products',
  imports: [RouterLink, Navbar],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class Products implements OnInit {

  products = signal<Product[]>([]);
  loading = signal(true);
  errorMessage = signal('');

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {

    this.loading.set(true);
    this.errorMessage.set('');

    this.productService.getProducts().subscribe({

      next: (response) => {

        this.products.set(response);

        this.loading.set(false);
      },

      error: (error) => {

        console.error('Failed to load products:', error);

        this.errorMessage.set('Unable to load products.');

        this.loading.set(false);
      }

    });
  }
}