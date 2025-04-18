import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-amber-700 text-white py-4">
      <div className="container mx-auto px-4 text-center">
        <p className="text-amber-100">
          Daily Reflection Journal &copy; {new Date().getFullYear()} | 
          <a 
            href="https://www.chatandbuild.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="ml-1 hover:text-white underline"
          >
            Powered by ChatAndBuild
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
