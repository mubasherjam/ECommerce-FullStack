export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Order {
  id: number;
  totalAmount: number;
  status: string;
  orderDate: string;
  items: OrderItem[];
}