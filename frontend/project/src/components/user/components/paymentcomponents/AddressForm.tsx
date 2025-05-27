import React, { useEffect, useState } from 'react';
import { useCheckout } from '../../components/context/CheckoutContext';

interface FormData {
  fullName: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  pincode: string;
}

interface FormErrors {
  fullName?: string;
  phone?: string;
  address1?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

const AddressForm: React.FC = () => {
  const { setCurrentStep, setAddressData } = useCheckout();

  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    pincode: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Load saved data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('checkoutAddress');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setFormData(parsedData);
      } catch (error) {
        console.error('Failed to parse address data:', error);
        // If parsing fails, treat as legacy string format
        setFormData(prev => ({
          ...prev,
          address1: savedData
        }));
      }
    }
  }, []);

  // Save form data to localStorage on change
  useEffect(() => {
    localStorage.setItem('checkoutAddress', JSON.stringify(formData));
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, formData[name as keyof FormData]);
  };

  const validateField = (name: string, value: string) => {
    let fieldErrors: FormErrors = {};

    switch (name) {
      case 'fullName':
        if (!value.trim()) fieldErrors.fullName = 'Full name is required';
        else if (value.length < 3) fieldErrors.fullName = 'Name must be at least 3 characters';
        break;
      case 'phone':
        if (!value.trim()) fieldErrors.phone = 'Phone number is required';
        else if (!/^\d{10}$/.test(value)) fieldErrors.phone = 'Enter a valid 10-digit number';
        break;
      case 'address1':
        if (!value.trim()) fieldErrors.address1 = 'Address is required';
        break;
      case 'city':
        if (!value.trim()) fieldErrors.city = 'City is required';
        break;
      case 'state':
        if (!value.trim()) fieldErrors.state = 'State is required';
        break;
      case 'pincode':
        if (!value.trim()) fieldErrors.pincode = 'Pincode is required';
        else if (!/^\d{6}$/.test(value)) fieldErrors.pincode = 'Enter a valid 6-digit pincode';
        break;
    }

    setErrors(prev => ({ ...prev, ...fieldErrors }));
    return !Object.keys(fieldErrors).length;
  };

  const validateForm = () => {
    const requiredFields = ['fullName', 'phone', 'address1', 'city', 'state', 'pincode'];
    let isValid = true;

    requiredFields.forEach(field => {
      const value = formData[field as keyof FormData];
      if (!validateField(field, value)) {
        isValid = false;
      }
    });

    const allTouched = requiredFields.reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {} as Record<string, boolean>);

    setTouched(prev => ({ ...prev, ...allTouched }));
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setAddressData(formData);
      setCurrentStep('payment');
    }
  }; 

  const inputClasses = (fieldName: keyof FormData) =>
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
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputClasses('phone')}
              placeholder="9876543210"
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
            placeholder="123 Main St"
          />
          {errors.address1 && touched.address1 && (
            <p className="mt-1 text-sm text-red-600">{errors.address1}</p>
          )}
        </div>

        <div>
          <label htmlFor="address2" className="block text-sm font-medium text-gray-700 mb-1">
            Address Line 2
          </label>
          <input
            type="text"
            id="address2"
            name="address2"
            value={formData.address2}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-200 transition-colors"
            placeholder="Apt, Suite, etc. (optional)"
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
            <input
              type="text"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputClasses('state')}
              placeholder="State"
            />
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
              placeholder="600001"
            />
            {errors.pincode && touched.pincode && (
              <p className="mt-1 text-sm text-red-600">{errors.pincode}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-violet-600 hover:bg-violet-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
        >
          Continue to Payment
        </button>
      </form>
    </div>
  );
};

export default AddressForm;