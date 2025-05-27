import React from 'react';
import { ShoppingCart } from 'lucide-react';

export function Orders() {
  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all orders in your store
          </p>
        </div>
      </div>

      <div className="mt-8">
        <div className="rounded-lg border border-gray-200 bg-white shadow">
          <div className="flex flex-col items-center justify-center p-12">
            <ShoppingCart className="h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No orders</h3>
            <p className="mt-1 text-sm text-gray-500">
              Orders will appear here when customers make purchases
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}