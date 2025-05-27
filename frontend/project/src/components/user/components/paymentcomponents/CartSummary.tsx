import React, { useEffect, useState } from 'react';
import { ShoppingBag, ChevronDown, ChevronUp } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartSummary: React.FC = () => {
  const { cartItems, updateQuantity } = useCart();

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.offerPrice * item.quantity, 0);
  const deliveryFee = 50;
  const total = subtotal + deliveryFee;

  const [isExpanded, setIsExpanded] = useState(true);
  const [storedTotal, setStoredTotal] = useState<number | null>(null);

  useEffect(() => {
    localStorage.setItem('cartTotal', total.toString());
  }, [total]);

  useEffect(() => {
    const savedTotal = localStorage.getItem('cartTotal');
    if (savedTotal) {
      setStoredTotal(Number(savedTotal));
    }
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm sticky top-4">
      <div className="p-5 border-b border-gray-100">
        <div 
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center">
            <ShoppingBag className="h-5 w-5 text-violet-600 mr-2" />
            <h2 className="text-lg font-bold text-gray-800">Cart Summary</h2>
            <span className="ml-2 text-sm bg-violet-100 text-violet-800 px-2 py-0.5 rounded-full">
              {cartItems.length} items
            </span>
          </div>
          <button className="text-gray-500 hover:text-violet-600">
            {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <>
          <div className="p-5 max-h-80 overflow-y-auto">
            {cartItems.map((item) => (
              <div key={item._id} className="flex py-3 border-b border-gray-100 last:border-b-0">
                <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0 bg-gray-100">
                  <img 
                    src={`http://localhost:5000/${item.product.images[0]}`}
                    alt={item.product.name} 
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="ml-4 flex-1">
                  <h3 className="text-sm font-medium text-gray-800">{item.product.name}</h3>
                  <p className="text-xs text-gray-500">{item.product.variant}</p>

                  <div className="flex justify-between items-center mt-2">
                    <div className="text-sm text-violet-700 font-medium">₹{item.product.offerPrice}</div>

                    <div className="flex items-center border border-gray-200 rounded-md">
                      <button 
                        onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                        className="px-2 py-0.5 text-gray-600 hover:text-violet-700"
                        aria-label="Decrease quantity"
                      >
                        <span className="text-lg">−</span>
                      </button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="px-2 py-0.5 text-gray-600 hover:text-violet-700"
                        aria-label="Increase quantity"
                      >
                        <span className="text-lg">+</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-5 bg-gray-50 rounded-b-xl">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery Fee</span>
                <span className="font-medium">₹{deliveryFee.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="font-bold text-gray-800">Total Amount</span>
                  <span className="font-bold text-violet-700">₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartSummary;
