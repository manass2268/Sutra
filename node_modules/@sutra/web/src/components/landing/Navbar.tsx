import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';

export const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-4 lg:px-8 py-4 bg-[#03120F] border-b border-[#071C17] sticky top-0 z-50 w-full">
      <div className="flex items-center gap-2 lg:gap-4">
        <div className="flex items-center gap-2 text-[#20E875]">
          <img src="/SUTRA-Icon-256.png" alt="SUTRA Logo" className="w-8 h-8 lg:w-10 lg:h-10 object-contain" />
          <span className="text-xl lg:text-2xl font-bold tracking-tight text-white">SUTRA</span>
        </div>
        <div className="hidden xl:block h-6 w-px bg-gray-700 mx-2"></div>
        <span className="hidden xl:block text-xs text-[#A8B7B0] max-w-[150px] leading-tight">
          Secure Messaging for People, Teams & Communities
        </span>
      </div>

      <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-[#A8B7B0]">
        <a href="#" className="text-[#20E875] border-b-2 border-[#20E875] pb-1">Home</a>
        <a href="#" className="hover:text-white transition-colors">Features</a>
        <a href="#" className="hover:text-white transition-colors">Security</a>
        <a href="#" className="hover:text-white transition-colors">How It Works</a>
      </div>

      <div className="flex items-center gap-3">
        <Link to="/login" className="hidden sm:block px-4 py-2 text-sm font-semibold text-white hover:bg-[#071C17] rounded-lg transition-colors border border-transparent hover:border-gray-700">
          Sign In
        </Link>
        <Link to="/register" className="px-4 py-2.5 text-sm font-semibold text-[#03120F] bg-[#20E875] hover:bg-[#77F5A5] rounded-lg transition-colors">
          Get Started
        </Link>
        <button className="lg:hidden text-white p-2">
            <Menu className="w-6 h-6" />
        </button>
      </div>
    </nav>
  );
};