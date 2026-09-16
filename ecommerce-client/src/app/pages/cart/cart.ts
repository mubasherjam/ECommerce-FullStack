import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';

import { CartService } from '../../core/services/cart';
import { OrderService } from '../../core/services/order';
import { Cart as CartModel, CartItem } from '../../shared/models/cart';

@Component({
  imports: [RouterLink],
  selector: 'app-cart',
  styleUrl: './cart.css',
  templateUrl: './cart.html',
})
export class Cart implements OnInit {

  cart: CartModel | null = null;

  loading = true;
  errorMessage = '';

  updatingItemId: number | null = null;

  placingOrder = false;
  checkoutError = '';

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {

    this.loading = true;
    this.errorMessage = '';

    this.cartService.getCart().subscribe({

      next: (response) => {

        this.cart = response;

        this.loading = false;
      },

      error: (error) => {

        console.error('Failed to load cart:', error);

        this.errorMessage = 'Unable to load your cart.';

        this.loading = false;
      }
    });
  }

  increaseQuantity(item: CartItem): void {
    this.updateQuantity(item, item.quantity + 1);
  }

  decreaseQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      this.updateQuantity(item, item.quantity - 1);
    }
  }

  updateQuantity(item: CartItem, quantity: number): void {

    this.updatingItemId = item.id;

    this.cartService.updateCartItem(item.id, quantity).subscribe({

      next: () => {
        this.updatingItemId = null;
        this.loadCart();
      },

      error: (error) => {

        console.error('Failed to update cart item:', error);

        this.errorMessage = error.error || 'Unable to update this item.';

        this.updatingItemId = null;
      }
    });
  }

  removeItem(item: CartItem): void {

    this.updatingItemId = item.id;

    this.cartService.removeCartItem(item.id).subscribe({

      next: () => {
        this.updatingItemId = null;
        this.loadCart();
      },

      error: (error) => {

        console.error('Failed to remove cart item:', error);

        this.errorMessage = 'Unable to remove this item.';

        this.updatingItemId = null;
      }
    });
  }

  checkout(): void {

    this.checkoutError = '';
    this.placingOrder = true;

    this.orderService.createOrder().subscribe({

      next: (order) => {

        this.placingOrder = false;

        this.router.navigate(['/orders'], {
          state: { justPlacedOrderId: order.id }
        });
      },

      error: (error) => {

        console.error('Failed to place order:', error);

        this.checkoutError = error.error || 'Unable to place your order.';

        this.placingOrder = false;
      }
    });
  }
}