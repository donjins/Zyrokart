import React, { createContext, useContext, useState } from 'react';

type CheckoutStep = 'address' | 'payment';

interface CheckoutContextType {
  currentStep: CheckoutStep;
  setCurrentStep: (step: CheckoutStep) => void;
  addressData: FormData | null;
  setAddressData: (data: FormData) => void;
}

interface FormData {
  fullName: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  pincode: string;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export const CheckoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('address');
  const [addressData, setAddressData] = useState<FormData | null>(null);
  
  return (
    <CheckoutContext.Provider value={{ 
      currentStep, 
      setCurrentStep,
      addressData,
      setAddressData
    }}>
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckout = () => {
  const context = useContext(CheckoutContext);
  if (context === undefined) {
    throw new Error('useCheckout must be used within a CheckoutProvider');
  }
  return context;
};