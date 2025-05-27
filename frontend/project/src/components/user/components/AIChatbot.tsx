import React from 'react';
import { MessageCircle } from 'lucide-react';

export function AIChatbot() {
  return (
    <button className="fixed bottom-8 right-8 p-4 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-transform hover:scale-110">
      <MessageCircle size={24} />
    </button>
  );
}