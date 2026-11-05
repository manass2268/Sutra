import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Moon, Menu } from 'lucide-react';

export const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-[#03120F] border-b border-[#071C17] sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-[#20E875]">
          <Shield className="w-8 h-8 fill-current" />
          <span className="text-2xl font-bold tracking-tight text-white">SUTRA</span>
        </div>
        <div className="hidden lg:block h-6 w-px bg-gray-700 mx-2"></div>
        <span className="hidden lg:block text-xs text-[#A8B7B0] max-w-[150px] leading-tight">
          Secure Messaging for People, Teams & Communities
        </span>
      </div>

      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#A8B7B0]">
        <a href="#" className="text-[#20E875] border-b-2 border-[#20E875] pb-1">Home</a>
        <a href="#" className="hover:text-white transition-colors">Features</a>
        <a href="#" className="hover:text-white transition-colors">Security</a>
        <a href="#" className="hover:text-white transition-colors">How It Works</a>
        <a href="#" className="hover:text-white transition-colors">Team</a>
        <a href="#" className="hover:text-white transition-colors">Contact</a>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-[#A8B7B0] hover:text-white transition-colors hidden sm:block">
          <Moon className="w-5 h-5" />
        </button>
        <Link to="/login" className="px-4 py-2 text-sm font-semibold text-white hover:bg-[#071C17] rounded-lg transition-colors border border-transparent hover:border-gray-700">
          Sign In
        </Link>
        <Link to="/register" className="px-5 py-2 text-sm font-semibold text-[#03120F] bg-[#20E875] hover:bg-[#77F5A5] rounded-lg transition-colors shadow-sm">
          Get Started
        </Link>
        <button className="md:hidden text-white p-2">
            <Menu className="w-6 h-6" />
        </button>
      </div>
    </nav>
  );
};