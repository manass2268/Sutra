import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Send } from 'lucide-react';

export const CallToAction = () => {
  return (
    <section className="py-24 px-6 bg-[#03120F]">
        <div className="max-w-5xl mx-auto">
            <div className="bg-gradient-to-r from-[#071C17] to-[#0A2920] rounded-3xl p-12 md:p-16 border border-[#1a3a30] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl">
                
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 opacity-10">
                    <Send className="w-64 h-64 text-[#20E875] transform -rotate-12" />
                </div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#20E875]/20 via-[#20E875] to-[#20E875]/20 opacity-50"></div>
                
                <div className="relative z-10 max-w-xl text-center md:text-left">
                    <div className="inline-flex items-center gap-2 text-[#20E875] mb-4">
                        <Send className="w-6 h-6 fill-current transform rotate-[-45deg]" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                        Ready to Experience a Safer Way to Chat?
                    </h2>
                    <p className="text-[#A8B7B0] text-lg">
                        Join SUTRA today and take control of your communication.
                    </p>
                </div>
                
                <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                    <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-[#20E875] text-[#03120F] font-bold rounded-xl hover:bg-[#77F5A5] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(32,232,117,0.2)]">
                        Get Started Free <ArrowRight className="w-5 h-5" />
                    </Link>
                    <button className="w-full sm:w-auto px-8 py-4 border border-gray-600 text-white font-semibold rounded-xl hover:bg-[#0A1915] transition-colors">
                        Learn More
                    </button>
                </div>
            </div>
        </div>
    </section>
  );
};