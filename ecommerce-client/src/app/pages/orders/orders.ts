import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { OrderService } from '../../core/services/order';
import { Order } from '../../shared/models/order';
import { Navbar } from '../../shared/components/navbar/navbar';

@Component({
  imports: [CommonModule, RouterLink, Navbar],
  selector: 'app-orders',
  styleUrl: './orders.css',
  templateUrl: './orders.html',
})
export class Orders implements OnInit {

  orders = signal<Order[]>([]);

  loading = signal(true);
  errorMessage = signal('');

  justPlacedOrderId: number | null = (history.state as { justPlacedOrderId?: number })
    ?.justPlacedOrderId ?? null;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {

    this.loading.set(true);
    this.errorMessage.set('');

    this.orderService.getOrders().subscribe({

      next: (response) => {

        const sorted = response.sort((a, b) =>
          new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
        );

        this.orders.set(sorted);

        this.loading.set(false);
      },

      error: (error) => {

        console.error('Failed to load orders:', error);

        this.errorMessage.set('Unable to load your orders.');

        this.loading.set(false);
      }
    });
  }
}