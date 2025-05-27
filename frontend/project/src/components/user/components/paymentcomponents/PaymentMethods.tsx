import React, { useState, useEffect } from 'react';
import { CreditCard, ArrowLeft, Wallet } from 'lucide-react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface FormData {
  name: string;
  phone: string;
  email: string;
  address: string;
  address2: string;
  city: string;
  state: string;
  pincode: string;
}

const PaymentMethods: React.FC = () => {
  const [step, setStep] = useState<'form' | 'payment'>('form');
  const [selectedMethod, setSelectedMethod] = useState<'razorpay' | 'cod'>('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    address: '',
    address2: '',
    city: '',
    state: '',
    pincode: '',
  });

  const [totalAmount, setTotalAmount] = useState<number>(0);

  useEffect(() => {
    const storedTotal = localStorage.getItem('cartTotal');
    if (storedTotal) {
      setTotalAmount(Number(storedTotal));
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    const { name, phone, email, address, city, state, pincode } = formData;
    if (!name || !phone || !email || !address || !city || !state || !pincode) {
      alert('Please fill all required fields');
      return false;
    }
    if (!/^\d{10}$/.test(phone)) {
      alert('Please enter a valid 10-digit phone number');
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      alert('Please enter a valid email address');
      return false;
    }
    if (!/^\d{6}$/.test(pincode)) {
      alert('Please enter a valid 6-digit pincode');
      return false;
    }
    return true;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setStep('payment');
  };
  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
      console.log('Cart Items for Payment:', cartItems);  // Log cart items for debugging
  
      const res = await fetch('http://localhost:5000/api/orders/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          cartItems,
          customerEmail: formData.email,
          customerName: formData.name,
          customerPhone: formData.phone,
          checkoutAddress: {
            address: formData.address,
            address2: formData.address2,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
          },
        }),
      });
  
      const data = await res.json();
      console.log('Response from Order Creation:', data); // Log order creation response
  
      if (!res.ok) {
        throw new Error(data.message || 'Failed to create order');
      }
  
      const options = {
        key: 'rzp_test_yourkey', // Replace with your Razorpay key
        amount: data.amount,
        currency: data.currency,
        name: 'Zyrokart Store',
        description: 'Order Payment',
        order_id: data.razorpayOrderId,
        handler: async function (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string; }) {
          console.log('Payment Success Response:', response); // Log payment success response
          // Save the order after successful payment
          await saveOrder(response);
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: '#F37254',
        },
      };
  
      console.log('Razorpay Payment Options:', options); // Log Razorpay payment options for debugging
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Error during payment:', err); // Log error if payment fails
      alert('Payment failed: ' + err.message);
    } finally {
      setIsProcessing(false); // Stop loading indicator
    }
  };
  

  const handleCOD = async () => {
    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');

    const saveRes = await fetch('http://localhost:5000/api/orders/saveorder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        orderItems: cartItems.map((item: any) => ({
          name: item.name,
          qty: item.qty,
          price: item.price,
          product: item._id,
        })),
        totalPrice: totalAmount,
        shippingAddress: {
          address: formData.address,
          address2: formData.address2,
          city: formData.city,
          postalCode: formData.pincode,
          country: formData.state,
        },
        paymentMethod: selectedMethod,
        customerDetails: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        },
        paymentResult: {
          id: 'cod',
          status: 'pending',
          update_time: new Date().toISOString(),
          email_address: formData.email,
        },
      }),
    });

    const result = await saveRes.json();
    if (result.message) {
      alert('Order placed with Cash on Delivery!');
    } else {
      alert('Failed to save the order');
    }
  };

  return (
    <div className="p-5 bg-gray-100">
      {step === 'form' ? (
        <form onSubmit={handleFormSubmit} className="flex flex-col space-y-4">
          <input name="name" placeholder="Name" onChange={handleInputChange} className="p-2 border rounded-md" />
          <input name="phone" placeholder="Phone" onChange={handleInputChange} className="p-2 border rounded-md" />
          <input name="email" placeholder="Email" onChange={handleInputChange} className="p-2 border rounded-md" />
          <input name="address" placeholder="Address Line 1" onChange={handleInputChange} className="p-2 border rounded-md" />
          <input name="address2" placeholder="Address Line 2" onChange={handleInputChange} className="p-2 border rounded-md" />
          <input name="city" placeholder="City" onChange={handleInputChange} className="p-2 border rounded-md" />
          <input name="state" placeholder="State" onChange={handleInputChange} className="p-2 border rounded-md" />
          <input name="pincode" placeholder="Pincode" onChange={handleInputChange} className="p-2 border rounded-md" />
          <button type="submit" className="bg-violet-600 text-white p-2 rounded-md hover:bg-violet-700 transition">
            Continue to Payment
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSelectedMethod('razorpay')}
              className={`flex items-center p-2 rounded-md border ${selectedMethod === 'razorpay' ? 'border-violet-500' : 'border-gray-300'}`}
            >
              <CreditCard className="mr-2" />
              Razorpay
            </button>
            <button
              onClick={() => setSelectedMethod('cod')}
              className={`flex items-center p-2 rounded-md border ${selectedMethod === 'cod' ? 'border-violet-500' : 'border-gray-300'}`}
            >
              <Wallet className="mr-2" />
              Cash on Delivery
            </button>
          </div>

          <p className="text-lg font-semibold">Total: ₹{totalAmount}</p>

          {selectedMethod === 'razorpay' && (
            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="bg-violet-600 text-white p-2 rounded-md hover:bg-violet-700 transition"
            >
              {isProcessing ? 'Processing...' : 'Pay with Razorpay'}
            </button>
          )}

          {selectedMethod === 'cod' && (
            <button
              onClick={handleCOD}
              className="bg-gray-700 text-white p-2 rounded-md hover:bg-gray-800 transition"
            >
              Place Order with COD
            </button>
          )}

          <button onClick={() => setStep('form')} className="flex items-center text-sm text-gray-500 mt-2">
            <ArrowLeft className="mr-1" size={16} /> Back to Address Form
          </button>
        </div>
      )}
    </div>
  );
};

export default PaymentMethods;
