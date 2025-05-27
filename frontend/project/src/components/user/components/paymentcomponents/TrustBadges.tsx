import React from 'react';
import { Shield, Box, Award } from 'lucide-react';

const TrustBadges: React.FC = () => {
  return (
    <div className="mt-10 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center p-3 border border-gray-100 bg-white rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-sm">
          <div className="p-2 bg-violet-100 rounded-full mr-3">
            <Shield className="h-5 w-5 text-violet-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-800">Secure Checkout</h3>
            <p className="text-xs text-gray-500">256-bit SSL encryption</p>
          </div>
        </div>
        
        <div className="flex items-center p-3 border border-gray-100 bg-white rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-sm">
          <div className="p-2 bg-violet-100 rounded-full mr-3">
            <Box className="h-5 w-5 text-violet-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-800">Fast Delivery</h3>
            <p className="text-xs text-gray-500">2-3 business days</p>
          </div>
        </div>
        
        <div className="flex items-center p-3 border border-gray-100 bg-white rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-sm">
          <div className="p-2 bg-violet-100 rounded-full mr-3">
            <Award className="h-5 w-5 text-violet-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-800">100% Genuine Products</h3>
            <p className="text-xs text-gray-500">Quality assured</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustBadges;