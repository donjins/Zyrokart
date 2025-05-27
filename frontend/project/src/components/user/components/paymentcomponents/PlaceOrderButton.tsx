import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCheckout } from '../context/CheckoutContext';

const PlaceOrderButton: React.FC = () => {
  const { currentStep } = useCheckout();
  
  if (currentStep !== 'payment') {
    return null;
  }
  
  const handlePlaceOrder = () => {
    alert('Order placed successfully! Thank you for shopping with us.');
  };
  
  return (
    <button
      onClick={handlePlaceOrder}
      className="w-full md:w-auto px-6 py-3 mt-6 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-lg shadow-md transform transition duration-150 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-opacity-50 flex items-center justify-center"
    >
      <ShoppingCart className="h-5 w-5 mr-2" />
      Place Order
    </button>
  );
};

export default PlaceOrderButton;