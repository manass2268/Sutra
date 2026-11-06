import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowRight, Play, Users, Search } from 'lucide-react';

export const HeroSection = () => {
  return (
    <section className="relative pt-12 lg:pt-20 pb-16 px-4 lg:px-12 overflow-hidden flex flex-col items-center bg-[#03120F] w-full">
      <div className="absolute top-1/4 left-1/4 -z-10 w-[400px] lg:w-[600px] h-[400px] lg:h-[600px] bg-[#071C17] rounded-full blur-[100px] lg:blur-[120px] opacity-80"></div>
      

      <div className="max-w-[1400px] mx-auto grid xl:grid-cols-2 gap-12 xl:gap-8 items-center w-full">
        
        {/* Left Text Content */}
        <div className="space-y-6 lg:space-y-8 z-10 w-full text-center xl:text-left pt-8 xl:pt-0">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#071C17] text-[#77F5A5] border border-[#1a3a30] text-xs font-medium tracking-wide mx-auto xl:mx-0">
            <Shield className="w-3.5 h-3.5" /> Privacy • Controlled • Reliable
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-[4rem] font-extrabold leading-[1.15] text-white tracking-tight">
            More Than Just Chat —<br className="hidden sm:block" />
            A Secure Space to <br/>
            <span className="text-[#20E875]">Connect, Collaborate <br className="hidden sm:block"/>and Organize.</span>
          </h1>
          
          <p className="text-base lg:text-lg text-[#A8B7B0] max-w-xl leading-relaxed mx-auto xl:mx-0">
            SUTRA is a modern, privacy-conscious messaging platform built for individuals, study groups, teams and organizations that value control, security and a clutter-free experience.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center xl:justify-start gap-4 pt-4">
            <Link to="/register" className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 bg-[#20E875] text-[#03120F] font-bold rounded-xl hover:bg-[#77F5A5] transition-all shadow-[0_0_15px_rgba(32,232,117,0.3)]">
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Link>
            <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 bg-transparent text-white border border-gray-600 font-semibold rounded-xl hover:bg-[#071C17] transition-all">
              <Play className="w-5 h-5" /> Watch Overview
            </button>
          </div>
        </div>

      
        <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] w-full flex items-center justify-center z-10 transform scale-75 sm:scale-90 lg:scale-100 origin-center xl:origin-right mt-10 xl:mt-0">
           
           {/* Desktop Mockup */}
           <div className="absolute right-0 lg:right-10 top-0 lg:top-10 w-[700px] h-[450px] bg-[#0A1915] rounded-xl border border-gray-700 shadow-2xl flex-col overflow-hidden z-10 hidden md:flex">
                <div className="h-14 border-b border-gray-800 flex items-center justify-between px-4 bg-[#071C17]">
                    <div className="flex items-center gap-2 text-[#20E875]">
                        <img src="/SUTRA-Icon-256.png" alt="SUTRA Logo" className="w-8 h-8 lg:w-10 lg:h-10 object-contain" />
                        <span className="font-bold text-white tracking-wide">SUTRA</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <span className="text-white text-sm font-medium">Chats</span>
                        <Search className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="flex items-center gap-3">
                         <div className="flex items-center gap-2 bg-[#122A23] px-3 py-1.5 rounded-md border border-gray-700">
                             <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center text-xs text-white">N</div>
                             <div>
                                 <p className="text-xs text-white font-medium">Team NEXORA</p>
                             </div>
                         </div>
                    </div>
                </div>

                <div className="flex flex-1">
                    <div className="w-48 border-r border-gray-800 bg-[#071C17] flex flex-col py-4">
                         <div className="px-4 space-y-2">
                             <div className="flex items-center gap-3 text-[#20E875] bg-[#122A23] px-3 py-2 rounded-lg">
                                 <span className="text-sm font-medium text-white">Chats</span>
                             </div>
                             <div className="flex items-center gap-3 text-gray-400 px-3 py-2">
                                 <Users className="w-4 h-4" /> <span className="text-sm font-medium">Groups</span>
                             </div>
                         </div>
                    </div>

                    <div className="w-64 border-r border-gray-800 bg-[#0A1915] flex flex-col">
                        <div className="p-3 border-b border-gray-800">
                            <div className="relative">
                                <Search className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
                                <input type="text" placeholder="Search chats..." className="w-full bg-[#122A23] text-sm text-white rounded-md pl-9 pr-3 py-2 border border-gray-700" />
                            </div>
                        </div>
                        <div className="flex-1 p-3">
                            <div className="flex items-center gap-3 p-3 bg-[#122A23] border-l-2 border-[#20E875]">
                                <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold">N</div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-white">Team NEXORA</p>
                                    <p className="text-xs text-[#20E875] truncate mt-1">Phase 2 is ready...</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 bg-[#03120F] flex flex-col p-4 justify-between">
                         <div className="flex flex-col items-start max-w-[75%]">
                            <div className="bg-[#122A23] border border-gray-800 text-white text-sm p-3 rounded-2xl rounded-tl-none">
                                Build Phase 2 is ready for review.
                            </div>
                         </div>
                    </div>
                </div>
           </div>

           {/* Mobile Mockup */}
           <div className="absolute right-0 sm:right-10 md:-right-10 bottom-0 md:bottom-10 w-[240px] h-[480px] bg-[#0A1915] rounded-[2.5rem] border-[8px] border-[#1F2937] shadow-2xl flex flex-col overflow-hidden z-20">
               <div className="h-6 bg-[#0A1915] flex items-center justify-between px-4">
                   <span className="text-[10px] text-white font-medium">9:30</span>
               </div>
               
               <div className="flex-1 bg-gradient-to-b from-[#071C17] to-[#03120F] flex flex-col items-center justify-center p-6 text-center">
                   <div className="w-16 h-16 rounded-2xl bg-[#0A1915] border border-gray-700 flex items-center justify-center mb-6 shadow-lg shadow-[#20E875]/10">
                       <img src="/SUTRA-Icon-256.png" alt="SUTRA Logo" className="w-8 h-8 lg:w-10 lg:h-10 object-contain" />
                   </div>
                   <h3 className="text-2xl font-bold text-white tracking-widest">SUTRA</h3>
               </div>
           </div>
        </div>
      </div>
    </section>
  );
};