import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { AdmNavbar } from './AdmNavbar';


export function Layout() {
  return (
    <div>
      <Sidebar />
      <div className="lg:pl-64">
        <AdmNavbar />
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}