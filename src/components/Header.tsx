import React from 'react';
import { BookHeart } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-amber-100 to-amber-200 p-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookHeart className="h-8 w-8 text-amber-700" />
          <h1 className="text-2xl font-bold text-amber-800">Daily Reflections</h1>
        </div>
        <p className="text-amber-700 italic">Nurture your growth through daily reflection</p>
      </div>
    </header>
  );
};

export default Header;
