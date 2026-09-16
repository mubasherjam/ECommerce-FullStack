import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ProductService } from '../../core/services/product';
import { CartService } from '../../core/services/cart';
import { Product } from '../../shared/models/product';

@Component({
  imports: [],
  selector: 'app-product-details',
  styleUrl: './product-details.css',
  templateUrl: './product-details.html',
})
export class ProductDetails implements OnInit {

  product: Product | null = null;

  loading = true;
  errorMessage = '';

  quantity = 1;

  addingToCart = false;
  cartMessage = '';
  cartError = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadProduct(id);
  }

  loadProduct(id: number): void {

    this.productService.getProduct(id).subscribe({

      next: (response) => {

        this.product = response;

        this.loading = false;
      },

      error: (error) => {

        console.error('Failed to load product:', error);

        this.errorMessage = 'Unable to load this product.';

        this.loading = false;
      }
    });
  }

  increaseQuantity(): void {
    if (this.product && this.quantity < this.product.stockQuantity) {
      this.quantity++;
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(): void {

    if (!localStorage.getItem('token')) {
      this.router.navigate(['/login']);
      return;
    }

    if (!this.product) {
      return;
    }

    this.cartMessage = '';
    this.cartError = '';
    this.addingToCart = true;

    this.cartService.addToCart(this.product.id, this.quantity).subscribe({

      next: () => {

        this.cartMessage = 'Added to cart!';

        this.addingToCart = false;
      },

      error: (error) => {

        console.error('Failed to add to cart:', error);

        this.cartError = error.error || 'Unable to add this product to your cart.';

        this.addingToCart = false;
      }
    });
  }
}