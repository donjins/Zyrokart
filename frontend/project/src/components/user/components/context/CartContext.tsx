import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  variant: string;
  offerPrice: number;
}

interface CartItem {
  _id: string;
  product: Product;
  quantity: number;
  offerPrice: number;
}

interface CartContextType {
  cartItems: CartItem[];
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  subtotal: number;
  deliveryFee: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const fetchCartData = async () => {
    try {
      const sessionRes = await fetch("http://localhost:5000/api/auth/session", {
        credentials: "include",
      });
      const session = await sessionRes.json();

      if (!session?.user) {
        return;
      }

      const storedUser = localStorage.getItem('user');
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;
      const userId = parsedUser?._id;

      const cartRes = await axios.get(`http://localhost:5000/api/cart/${userId}`, {
        withCredentials: true,
      });

      const cartData = cartRes.data.cart || cartRes.data;

      if (!Array.isArray(cartData.items)) {
        console.error("Expected cart items to be an array, got:", cartData.items);
        setCartItems([]);
        return;
      }

      const detailedItems = await Promise.all(
        cartData.items.map(async (item: any) => {
          const productId = typeof item.product === "object" ? item.product._id : item.product;
          const productRes = await axios.get(`http://localhost:5000/api/product/${productId}`);
          return {
            ...item,
            product: productRes.data,
            offerPrice: productRes.data.offerPrice,
          };
        })
      );

      setCartItems(detailedItems);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, []);

  const updateQuantity = (id: string, quantity: number) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item._id === id ? { ...item, quantity } : item
      )
    );
    // Optional: send update to server here
  };

  const removeItem = (id: string) => {
    setCartItems(prevItems => prevItems.filter(item => item._id !== id));
    // Optional: send delete request to server here
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.offerPrice * item.quantity,
    0
  );

  const deliveryFee = subtotal > 0 ? 49.99 : 0;
  const total = subtotal + deliveryFee;

  useEffect(() => {
    localStorage.setItem('cartTotal', total.toString());
  }, [total]);

  return (
    <CartContext.Provider value={{
      cartItems,
      updateQuantity,
      removeItem,
      subtotal,
      deliveryFee,
      total
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
