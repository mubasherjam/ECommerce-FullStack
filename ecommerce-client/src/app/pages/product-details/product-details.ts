import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { ProductService } from '../../core/services/product';
import { CartService } from '../../core/services/cart';
import { Product } from '../../shared/models/product';
import { Navbar } from '../../shared/components/navbar/navbar';

@Component({
  imports: [RouterLink, Navbar],
  selector: 'app-product-details',
  styleUrl: './product-details.css',
  templateUrl: './product-details.html',
})
export class ProductDetails implements OnInit {

  product = signal<Product | null>(null);

  loading = signal(true);
  errorMessage = signal('');

  quantity = signal(1);

  addingToCart = signal(false);
  cartMessage = signal('');
  cartError = signal('');

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

        this.product.set(response);

        this.loading.set(false);
      },

      error: (error) => {

        console.error('Failed to load product:', error);

        this.errorMessage.set('Unable to load this product.');

        this.loading.set(false);
      }
    });
  }

  increaseQuantity(): void {
    const current = this.product();
    if (current && this.quantity() < current.stockQuantity) {
      this.quantity.set(this.quantity() + 1);
    }
  }

  decreaseQuantity(): void {
    if (this.quantity() > 1) {
      this.quantity.set(this.quantity() - 1);
    }
  }

  addToCart(): void {

    if (!localStorage.getItem('token')) {
      this.router.navigate(['/login']);
      return;
    }

    const current = this.product();

    if (!current) {
      return;
    }

    this.cartMessage.set('');
    this.cartError.set('');
    this.addingToCart.set(true);

    this.cartService.addToCart(current.id, this.quantity()).subscribe({

      next: () => {

        this.cartMessage.set('Added to cart!');

        this.addingToCart.set(false);
      },

      error: (error) => {

        console.error('Failed to add to cart:', error);

        this.cartError.set(error.error || 'Unable to add this product to your cart.');

        this.addingToCart.set(false);
      }
    });
  }
}