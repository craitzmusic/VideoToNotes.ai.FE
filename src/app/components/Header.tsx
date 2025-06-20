'use client';

import { FC } from 'react';
import AuthButton from "./AuthButton";

// Header component: sticky top navigation bar with site title
const Header: FC = () => {
  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">VideoToNotes.ai</h1>
        <AuthButton />
        {/* Future: theme toggle or login buttons */}
        {/* <div>
          <button>Dark Mode</button>
        </div> */}
      </div>
    </header>
  );
};

export default Header;