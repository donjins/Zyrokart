import React from 'react';
import { BarChart, Users, ShoppingBag, DollarSign } from 'lucide-react';

const stats = [
  { name: 'Total Revenue', value: '$45,231.00', icon: DollarSign },
  { name: 'Total Products Sold', value: '2,345 Units', icon: ShoppingBag },
  { name: 'Registered Users', value: '1,234 Users', icon: Users },
  { name: 'Sales Growth Rate', value: '+12.5% Increase', icon: BarChart },
];

export function Dashboard() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-extrabold text-gray-900">Business Dashboard</h1>
      
      <dl className="mt-8 flex space-x-6 overflow-x-auto">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="flex-shrink-0 w-72 relative overflow-hidden rounded-2xl bg-white p-8 shadow-md transition-transform transform hover:scale-105 hover:shadow-xl"
          >
            <dt className="flex items-center space-x-4">
              <div className="rounded-full bg-indigo-600 p-4">
                <stat.icon className="h-10 w-10 text-white" aria-hidden="true" />
              </div>
              <p className="text-lg font-semibold text-gray-700">{stat.name}</p>
            </dt>
            <dd className="mt-4 text-4xl font-bold text-gray-900">{stat.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-12">
        <h2 className="text-2xl font-semibold text-gray-900">Recent Activity</h2>
        <div className="mt-4 rounded-2xl border border-gray-300 bg-white shadow-md p-8 text-center">
          <p className="text-lg text-gray-500">No recent activity recorded</p>
        </div>
      </div>
    </div>
  );
}