import React from 'react';
import { Shield } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#03120F] border-t border-gray-900 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4 text-[#A8B7B0] text-sm">
                <div className="flex items-center gap-2 text-[#20E875]">
                    <img src="/SUTRA-Icon-256.png" alt="SUTRA Logo" className="w-8 h-8 lg:w-10 lg:h-10 object-contain" />
                    <span className="text-xl font-bold tracking-tight text-white">SUTRA</span>
                </div>
                <div className="hidden sm:block h-4 w-px bg-gray-800"></div>
                <span className="hidden sm:block">Secure Messaging for People, Teams & Communities</span>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-[#A8B7B0]">
                <a href="#" className="hover:text-white transition-colors">About</a>
                <a href="#" className="hover:text-white transition-colors">Features</a>
                <a href="#" className="hover:text-white transition-colors">Security</a>
                <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-900 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-600">
            <p>© {new Date().getFullYear()} SUTRA. All rights reserved.</p>
            <div className="flex items-center gap-4">
                <a href="#" className="hover:text-gray-400">Privacy Policy</a>
                <a href="#" className="hover:text-gray-400">Terms of Service</a>
            </div>
        </div>
    </footer>
  );
};