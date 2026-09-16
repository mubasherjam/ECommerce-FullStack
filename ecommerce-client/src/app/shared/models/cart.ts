export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  total: number;
}

export interface Cart {
  id: number;
  items: CartItem[];
  total: number;
}