import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ProductService } from '../../core/services/product';
import { Product } from '../../shared/models/product';

@Component({
  selector: 'app-products',
  imports: [RouterLink],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class Products implements OnInit {

  products: Product[] = [];

  loading = true;
  errorMessage = '';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {

    this.productService.getProducts().subscribe({

      next: (response) => {

        console.log('Products:', response);

        this.products = response;

        this.loading = false;
      },

      error: (error) => {

        console.error('Failed to load products:', error);

        this.errorMessage = 'Unable to load products.';

        this.loading = false;
      }

    });
  }
}