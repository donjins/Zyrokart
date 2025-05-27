import React from 'react';
import { Users as UsersIcon } from 'lucide-react';

export function Users() {
  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all users in your store
          </p>
        </div>
      </div>

      <div className="mt-8">
        <div className="rounded-lg border border-gray-200 bg-white shadow">
          <div className="flex flex-col items-center justify-center p-12">
            <UsersIcon className="h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No users</h3>
            <p className="mt-1 text-sm text-gray-500">
              User accounts will appear here once created
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}