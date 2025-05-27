export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  productId: string;
  quantity: number;
  totalAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
}