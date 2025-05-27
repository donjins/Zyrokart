import React from 'react';
import { ShoppingBag } from 'lucide-react';
import TimerBar from './TimerBar';

const Header: React.FC = () => {
  return (
    <header className="w-full bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <ShoppingBag className="h-8 w-8 text-violet-700 mr-2" />
          <h1 className="text-xl font-bold text-violet-900">
             <span className="text-violet-500">ZyroKart</span>
          </h1>
        </div>
        <div className="hidden md:block">
          <nav className="flex space-x-6">
            <a href="/" className="text-gray-600 hover:text-violet-700 transition-colors">Home</a>
            <a href="#" className="text-gray-600 hover:text-violet-700 transition-colors">Shop</a>
            <a href="#" className="text-gray-600 hover:text-violet-700 transition-colors">Account</a>
            <a href="#" className="text-violet-700 font-medium">Checkout</a>
          </nav>
        </div>
      </div>
      <TimerBar initialMinutes={15} />
    </header>
  );
};

export default Header;