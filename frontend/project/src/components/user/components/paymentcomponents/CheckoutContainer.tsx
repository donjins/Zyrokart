import React from 'react';
import AddressForm from './AddressForm';
import CartSummary from './CartSummary';
import PaymentMethods from './PaymentMethods';
import TrustBadges from './TrustBadges';
import PlaceOrderButton from './PlaceOrderButton';
import { useCheckout } from '../context/CheckoutContext';

const CheckoutContainer: React.FC = () => {
  const { currentStep } = useCheckout();

  return (
    <main className="flex-1 container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 order-2 lg:order-1">
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            {currentStep === 'address' && <AddressForm />}
            {currentStep === 'payment' && <PaymentMethods />}
          </div>
          <PlaceOrderButton />
          <TrustBadges />
        </div>
        
        <div className="lg:w-1/3 order-1 lg:order-2">
          <CartSummary />
        </div>
      </div>
    </main>
  );
};

export default CheckoutContainer;