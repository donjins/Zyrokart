import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-purple-600 p-3 rounded-xl">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">{title}</h1>
          <p className="text-center text-gray-600 mb-8">{subtitle}</p>
          {children}
        </div>
      </motion.div>
    </div>
  );
}