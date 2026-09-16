import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Cart, CartItem } from '../../shared/models/cart';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private apiUrl = 'https://localhost:44347/api/cart';

  constructor(private http: HttpClient) {}

  getCart(): Observable<Cart> {
    return this.http.get<Cart>(this.apiUrl);
  }

  addToCart(productId: number, quantity: number): Observable<CartItem> {
    return this.http.post<CartItem>(`${this.apiUrl}/items`, {
      productId,
      quantity
    });
  }

  updateCartItem(itemId: number, quantity: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/items/${itemId}`, {
      quantity
    });
  }

  removeCartItem(itemId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/items/${itemId}`);
  }
}