import React, { createContext, useState, useContext } from 'react';
import { CreditCard, Truck, Check, ShoppingBag, ChevronDown, ChevronUp } from 'lucide-react';
import '../../../index.css';

// Cart Context
interface CartItem {
  id: number;
  name: string;
  variant: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartContextType {
  cartItems: CartItem[];
  updateQuantity: (id: number, quantity: number) => void;
  subtotal: number;
  deliveryFee: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Mock product data
const initialCartItems = [
  {
    id: 1,
    name: 'Wireless Headphones',
    variant: 'Matte Black',
    price: 1299.99,
    quantity: 1,
    image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    id: 2,
    name: 'Smart Watch Series 7',
    variant: 'Silver',
    price: 2499.99,
    quantity: 1,
    image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  }
];

// Checkout Context
type CheckoutStep = 'address' | 'payment';

interface CheckoutContextType {
  currentStep: CheckoutStep;
  setCurrentStep: (step: CheckoutStep) => void;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

// Cart Summary Component
const CartSummary: React.FC = () => {
  const { cartItems, updateQuantity, subtotal, deliveryFee, total } = useCart();
  const [isExpanded, setIsExpanded] = React.useState(true);

  return (
    <div className="bg-white rounded-xl shadow-sm">
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
              <div key={item.id} className="flex py-3 border-b border-gray-100 last:border-b-0">
                <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0 bg-gray-100">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="h-full w-full object-cover"
                  />
                </div>
                
                <div className="ml-4 flex-1">
                  <h3 className="text-sm font-medium text-gray-800">{item.name}</h3>
                  <p className="text-xs text-gray-500">{item.variant}</p>
                  
                  <div className="flex justify-between items-center mt-2">
                    <div className="text-sm text-violet-700 font-medium">₹{item.price.toFixed(2)}</div>
                    
                    <div className="flex items-center border border-gray-200 rounded-md">
                      <button 
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="px-2 py-0.5 text-gray-600 hover:text-violet-700"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-0.5 text-gray-600 hover:text-violet-700"
                      >
                        +
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

// Address Form Component
const AddressForm: React.FC = () => {
  const { setCurrentStep } = useCheckout();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    pincode: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, formData[name as keyof typeof formData]);
  };

  const validateField = (name: string, value: string) => {
    let error = '';
    switch (name) {
      case 'fullName':
        if (!value.trim()) error = 'Full name is required';
        else if (value.length < 3) error = 'Name must be at least 3 characters';
        break;
      case 'phone':
        if (!value.trim()) error = 'Phone number is required';
        else if (!/^\d{10}$/.test(value)) error = 'Enter a valid 10-digit number';
        break;
      case 'address1':
        if (!value.trim()) error = 'Address is required';
        break;
      case 'city':
        if (!value.trim()) error = 'City is required';
        break;
      case 'state':
        if (!value.trim()) error = 'State is required';
        break;
      case 'pincode':
        if (!value.trim()) error = 'Pincode is required';
        else if (!/^\d{6}$/.test(value)) error = 'Enter a valid 6-digit pincode';
        break;
    }
    setErrors(prev => ({ ...prev, [name]: error }));
    return !error;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = Object.keys(formData).every(key => {
      if (key === 'address2') return true;
      return validateField(key, formData[key as keyof typeof formData]);
    });
    
    if (isValid) {
      setCurrentStep('payment');
    }
  };

  const inputClasses = (fieldName: string) => 
    `w-full px-4 py-2 rounded-lg border ${
      errors[fieldName] && touched[fieldName] 
        ? 'border-red-300 bg-red-50' 
        : 'border-gray-300 focus:border-violet-500'
    } focus:outline-none focus:ring-2 focus:ring-violet-200 transition-colors`;

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-6">Delivery Address</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name*
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputClasses('fullName')}
              placeholder="John Doe"
            />
            {errors.fullName && touched.fullName && (
              <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number*
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputClasses('phone')}
              placeholder="10-digit mobile number"
            />
            {errors.phone && touched.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
            )}
          </div>
        </div>
        
        <div>
          <label htmlFor="address1" className="block text-sm font-medium text-gray-700 mb-1">
            Address Line 1*
          </label>
          <input
            type="text"
            id="address1"
            name="address1"
            value={formData.address1}
            onChange={handleChange}
            onBlur={handleBlur}
            className={inputClasses('address1')}
            placeholder="House/Flat number, Building name, Street"
          />
          {errors.address1 && touched.address1 && (
            <p className="mt-1 text-sm text-red-600">{errors.address1}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="address2" className="block text-sm font-medium text-gray-700 mb-1">
            Address Line 2 (Optional)
          </label>
          <input
            type="text"
            id="address2"
            name="address2"
            value={formData.address2}
            onChange={handleChange}
            className={inputClasses('address2')}
            placeholder="Landmark, Area"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
              City*
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputClasses('city')}
              placeholder="City"
            />
            {errors.city && touched.city && (
              <p className="mt-1 text-sm text-red-600">{errors.city}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
              State*
            </label>
            <select
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputClasses('state')}
            >
              <option value="">Select State</option>
              <option value="Delhi">Delhi</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Gujarat">Gujarat</option>
            </select>
            {errors.state && touched.state && (
              <p className="mt-1 text-sm text-red-600">{errors.state}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
              Pincode*
            </label>
            <input
              type="text"
              id="pincode"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputClasses('pincode')}
              placeholder="6-digit pincode"
            />
            {errors.pincode && touched.pincode && (
              <p className="mt-1 text-sm text-red-600">{errors.pincode}</p>
            )}
          </div>
        </div>
        
        <div className="pt-4">
          <button
            type="submit"
            className="w-full md:w-auto px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-lg shadow-sm transform transition duration-150 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-opacity-50"
          >
            Save & Continue
          </button>
        </div>
      </form>
    </div>
  );
};

// Payment Methods Component
const PaymentMethods: React.FC = () => {
  const { setCurrentStep } = useCheckout();
  const [selectedMethod, setSelectedMethod] = useState<'razorpay' | 'cod'>('razorpay');
  
  return (
    <div>
      <div className="flex items-center mb-6">
        <button 
          onClick={() => setCurrentStep('address')}
          className="text-violet-600 hover:text-violet-800 flex items-center text-sm font-medium"
        >
          Back to Address
        </button>
        <h2 className="text-xl font-bold text-gray-800 ml-4">Payment Options</h2>
      </div>
      
      <div className="space-y-4">
        <label className={`block cursor-pointer border rounded-xl p-4 transition-all ${
          selectedMethod === 'razorpay' 
            ? 'border-violet-400 bg-violet-50 ring-2 ring-violet-200' 
            : 'border-gray-200 hover:border-violet-200'
        }`}>
          <div className="flex">
            <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${
              selectedMethod === 'razorpay'
                ? 'border-violet-500 bg-violet-500'
                : 'border-gray-300'
            }`}>
              {selectedMethod === 'razorpay' && (
                <Check className="h-3 w-3 text-white" />
              )}
            </div>
            
            <div className="ml-3 flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 text-violet-600 mr-2" />
                  <span className="font-medium text-gray-900">Razorpay</span>
                </div>
                <img 
                  src="https://razorpay.com/build/browser/static/razorpay-logo.5cdb58df.svg" 
                  alt="Razorpay Logo" 
                  className="h-6"
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Pay securely using Credit/Debit card, UPI, or Net Banking
              </p>
            </div>
          </div>
          <input
            type="radio"
            name="paymentMethod"
            value="razorpay"
            checked={selectedMethod === 'razorpay'}
            onChange={() => setSelectedMethod('razorpay')}
            className="sr-only"
          />
        </label>
        
        <label className={`block cursor-pointer border rounded-xl p-4 transition-all ${
          selectedMethod === 'cod' 
            ? 'border-violet-400 bg-violet-50 ring-2 ring-violet-200' 
            : 'border-gray-200 hover:border-violet-200'
        }`}>
          <div className="flex">
            <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${
              selectedMethod === 'cod'
                ? 'border-violet-500 bg-violet-500'
                : 'border-gray-300'
            }`}>
              {selectedMethod === 'cod' && (
                <Check className="h-3 w-3 text-white" />
              )}
            </div>
            
            <div className="ml-3 flex-1">
              <div className="flex items-center">
                <Truck className="h-5 w-5 text-violet-600 mr-2" />
                <span className="font-medium text-gray-900">Cash on Delivery</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Pay at your doorstep when your package arrives
              </p>
            </div>
          </div>
          <input
            type="radio"
            name="paymentMethod"
            value="cod"
            checked={selectedMethod === 'cod'}
            onChange={() => setSelectedMethod('cod')}
            className="sr-only"
          />
        </label>
      </div>
      
      {selectedMethod === 'razorpay' && (
        <div className="mt-6">
          <button
            className="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-lg shadow-sm transform transition duration-150 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-opacity-50 flex items-center justify-center"
          >
            <img 
              src="https://razorpay.com/build/browser/static/razorpay-logo.5cdb58df.svg" 
              alt="Razorpay" 
              className="h-5 mr-2 brightness-200 contrast-200"
            />
            Pay via Razorpay
          </button>
        </div>
      )}
    </div>
  );
};

// Cart Provider Component
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  
  const updateQuantity = (id: number, quantity: number) => {
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };
  
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity, 
    0
  );
  
  const deliveryFee = subtotal > 0 ? 49.99 : 0;
  const total = subtotal + deliveryFee;
  
  return (
    <CartContext.Provider value={{ 
      cartItems, 
      updateQuantity,
      subtotal,
      deliveryFee,
      total
    }}>
      {children}
    </CartContext.Provider>
  );
};

// Checkout Provider Component
export const CheckoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('address');
  
  return (
    <CheckoutContext.Provider value={{ currentStep, setCurrentStep }}>
      {children}
    </CheckoutContext.Provider>
  );
};

// Custom Hooks
const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};

const useCheckout = () => {
  const context = useContext(CheckoutContext);
  if (!context) throw new Error('useCheckout must be used within CheckoutProvider');
  return context;
};

// Main App Component
const Payment: React.FC = () => {
  const { currentStep } = useCheckout();
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <main className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 order-2 lg:order-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              {currentStep === 'address' ? <AddressForm /> : <PaymentMethods />}
            </div>
          </div>
          <div className="lg:w-1/3 order-1 lg:order-2">
            <CartSummary />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Payment;