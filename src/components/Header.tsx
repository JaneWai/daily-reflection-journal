import React from 'react';
import LoginButton from './LoginButton';
import { BookHeart } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-amber-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BookHeart size={28} className="text-amber-100" />
            <h1 className="text-2xl font-bold">Daily Reflection Journal</h1>
          </div>
          <LoginButton />
        </div>
        
        <div className="mt-2">
          <p className="text-amber-100 italic">
            "Take a moment to reflect, grow, and appreciate today."
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
