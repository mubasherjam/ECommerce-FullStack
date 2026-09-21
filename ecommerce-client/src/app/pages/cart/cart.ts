import { Component, OnInit, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';

import { CartService } from '../../core/services/cart';
import { OrderService } from '../../core/services/order';
import { Cart as CartModel, CartItem } from '../../shared/models/cart';
import { Navbar } from '../../shared/components/navbar/navbar';

@Component({
  imports: [RouterLink, Navbar],
  selector: 'app-cart',
  styleUrl: './cart.css',
  templateUrl: './cart.html',
})
export class Cart implements OnInit {

  cart = signal<CartModel | null>(null);

  loading = signal(true);
  errorMessage = signal('');

  updatingItemId = signal<number | null>(null);

  placingOrder = signal(false);
  checkoutError = signal('');

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {

    this.loading.set(true);
    this.errorMessage.set('');

    this.cartService.getCart().subscribe({

      next: (response) => {

        this.cart.set(response);

        this.loading.set(false);
      },

      error: (error) => {

        console.error('Failed to load cart:', error);

        this.errorMessage.set('Unable to load your cart.');

        this.loading.set(false);
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

    this.updatingItemId.set(item.id);

    this.cartService.updateCartItem(item.id, quantity).subscribe({

      next: () => {
        this.updatingItemId.set(null);
        this.loadCart();
      },

      error: (error) => {

        console.error('Failed to update cart item:', error);

        this.errorMessage.set(error.error || 'Unable to update this item.');

        this.updatingItemId.set(null);
      }
    });
  }

  removeItem(item: CartItem): void {

    this.updatingItemId.set(item.id);

    this.cartService.removeCartItem(item.id).subscribe({

      next: () => {
        this.updatingItemId.set(null);
        this.loadCart();
      },

      error: (error) => {

        console.error('Failed to remove cart item:', error);

        this.errorMessage.set('Unable to remove this item.');

        this.updatingItemId.set(null);
      }
    });
  }

  checkout(): void {

    this.checkoutError.set('');
    this.placingOrder.set(true);

    this.orderService.createOrder().subscribe({

      next: (order) => {

        this.placingOrder.set(false);

        this.router.navigate(['/orders'], {
          state: { justPlacedOrderId: order.id }
        });
      },

      error: (error) => {

        console.error('Failed to place order:', error);

        this.checkoutError.set(error.error || 'Unable to place your order.');

        this.placingOrder.set(false);
      }
    });
  }
}