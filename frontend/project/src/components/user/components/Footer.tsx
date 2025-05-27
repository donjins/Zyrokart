import React from "react";

export function Footer() {
  return (
    <footer className="bg-gray-200 text-gray-700 text-center py-6 mt-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center space-x-6 mb-4">
          <a href="#" className="hover:underline">Home</a>
          <a href="#" className="hover:underline">About</a>
          <a href="#" className="hover:underline">Services</a>
          <a href="#" className="hover:underline">Contact</a>
        </div>

        <div className="flex justify-center space-x-4 mb-4">
          <a href="#" className="hover:opacity-75">📘 Facebook</a>
          <a href="#" className="hover:opacity-75">🐦 Twitter</a>
          <a href="#" className="hover:opacity-75">📷 Instagram</a>
          <a href="#" className="hover:opacity-75">🔗 LinkedIn</a>
        </div>

        <div className="mb-4">
          <p>Email: <a href="mailto:support@yourcompany.com" className="hover:underline">support@yourcompany.com</a></p>
          <p>Phone: <a href="tel:+11234567890" className="hover:underline">+1 (123) 456-7890</a></p>
        </div>

        <p>&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
      </div>
    </footer>
  );
}