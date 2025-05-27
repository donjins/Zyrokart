import React from 'react';
import Header from './Header';
import CheckoutContainer from './CheckoutContainer';
import { CartProvider } from '../context/CartContext';
import { CheckoutProvider } from '../context/CheckoutContext';


const PaymentPage: React.FC = () => {
  return (
    <CartProvider>
      <CheckoutProvider>
        <div className="min-h-screen flex flex-col">
          <Header />
          <CheckoutContainer />
        </div>
      </CheckoutProvider>
    </CartProvider>
  );
};

export default PaymentPage;