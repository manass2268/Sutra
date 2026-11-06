
import { UserPlus, Users, MessageCircle, Layers } from 'lucide-react';

export const HowItWorks = () => {
  const steps = [
    { num: 1, icon: UserPlus, title: "Create an Account", desc: "Set up your SUTRA account in a few simple steps." },
    { num: 2, icon: Users, title: "Join or Create Groups", desc: "Build groups for study, work or your community." },
    { num: 3, icon: MessageCircle, title: "Start Messaging", desc: "Chat, share updates and collaborate in real time." },
    { num: 4, icon: Layers, title: "Stay Organized", desc: "Keep your conversations, files and groups in one place." },
  ];

  return (
    <section className="py-24 px-6 bg-[#03120F] text-center border-t border-gray-900">
        <div className="max-w-[1200px] mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-20">How It Works</h2>
            
            <div className="flex flex-col md:flex-row items-start justify-between relative gap-10 md:gap-4">
                {/* Connecting Line (Desktop) */}
                <div className="absolute top-10 left-[10%] right-[10%] h-px bg-gray-800 hidden md:block -z-10"></div>
                
                {steps.map((step, idx) => (
                    <div key={idx} className="flex flex-col items-center md:items-start text-center md:text-left relative flex-1 w-full">
                        <div className="flex items-center justify-center w-20 h-20 bg-[#071C17] border border-gray-700 rounded-2xl mb-6 shadow-md relative group">
                             {/* Number Badge */}
                             <div className="absolute -top-3 -left-3 w-7 h-7 rounded-full bg-[#1a3a30] text-[#20E875] border border-gray-700 text-xs font-bold flex items-center justify-center group-hover:bg-[#20E875] group-hover:text-[#03120F] transition-colors">
                                 {step.num}
                             </div>
                             <step.icon className="w-8 h-8 text-[#20E875]" />
                        </div>
                        <h3 className="font-bold text-white mb-2">{step.title}</h3>
                        <p className="text-sm text-[#A8B7B0] leading-relaxed max-w-[200px] md:max-w-none">{step.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
  );
};