import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ProductService } from '../../../core/services/product';
import { Product } from '../../../shared/models/product';
import { Navbar } from '../../../shared/components/navbar/navbar';


@Component({
  selector: 'app-manage-products',
  imports: [RouterLink, Navbar],
  templateUrl: './manage-products.html',
  styleUrl: './manage-products.css'
})

export class ManageProducts implements OnInit {

  products = signal<Product[]>([]);
  loading = signal(true);
  errorMessage = signal('');

  deletingId = signal<number | null>(null);

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

  deleteProduct(product: Product): void {

    const confirmed = confirm(`Delete "${product.name}"? This can't be undone.`);

    if (!confirmed) {
      return;
    }

    this.deletingId.set(product.id);

    this.productService.deleteProduct(product.id).subscribe({

      next: () => {

        this.products.set(
          this.products().filter(p => p.id !== product.id)
        );

        this.deletingId.set(null);
      },

      error: (error) => {

        console.error('Failed to delete product:', error);

        this.errorMessage.set('Unable to delete this product.');

        this.deletingId.set(null);
      }
    });
  }
}