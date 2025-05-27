export interface Phone {
  name: string;
  price: number;
  brand: string;
  originalPrice?: number;
  rating: number;
  image: string;
}
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface CartState {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
}

