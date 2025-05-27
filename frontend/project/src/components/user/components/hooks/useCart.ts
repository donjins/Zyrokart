import { useState, useEffect } from 'react';
import { CartItem } from '../types/cart';

// Simulated cart data - in a real app, this would come from an API
const initialCartItems: CartItem[] = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    price: 199.99,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
  },
  {
    id: '2',
    name: 'Smart Watch Series 5',
    price: 299.99,
    quantity: 2,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80',
  },
];

export const useCart = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call
    const fetchCart = async () => {
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setItems(initialCartItems);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to fetch cart items');
        setIsLoading(false);
      }
    };

    fetchCart();
  }, []);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const getTotalAmount = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return {
    items,
    isLoading,
    error,
    updateQuantity,
    removeItem,
    getTotalAmount,
  };
};