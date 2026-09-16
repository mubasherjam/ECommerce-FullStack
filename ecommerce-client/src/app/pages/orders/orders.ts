import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { OrderService } from '../../core/services/order';
import { Order } from '../../shared/models/order';

@Component({
  imports: [CommonModule, RouterLink],
  selector: 'app-orders',
  styleUrl: './orders.css',
  templateUrl: './orders.html',
})
export class Orders implements OnInit {

  orders: Order[] = [];

  loading = true;
  errorMessage = '';

  justPlacedOrderId: number | null = (history.state as { justPlacedOrderId?: number })
    ?.justPlacedOrderId ?? null;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {

    this.orderService.getOrders().subscribe({

      next: (response) => {

        this.orders = response.sort((a, b) =>
          new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
        );

        this.loading = false;
      },

      error: (error) => {

        console.error('Failed to load orders:', error);

        this.errorMessage = 'Unable to load your orders.';

        this.loading = false;
      }
    });
  }
}