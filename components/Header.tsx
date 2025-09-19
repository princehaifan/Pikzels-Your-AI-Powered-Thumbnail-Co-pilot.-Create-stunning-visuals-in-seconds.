
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center">
      <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight">
        <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
          Pikzels
        </span>
      </h1>
      <p className="mt-3 text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto">
        Your AI-Powered Thumbnail Co-pilot. Create stunning visuals in seconds.
      </p>
    </header>
  );
};

export default Header;
