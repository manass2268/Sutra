import React from 'react';
import { Shield, Users, Lock, Sliders, UserCheck } from 'lucide-react';

export const BenefitsStrip = () => {
  const benefits = [
    { icon: Shield, text: "Privacy-conscious\nMessaging" },
    { icon: Users, text: "Groups & Teams" },
    { icon: Lock, text: "Encrypted Storage" },
    { icon: Sliders, text: "Controlled Access" },
    { icon: UserCheck, text: "Designed for People & Teams" },
  ];

  return (
    <div className="bg-[#03120F] border-t border-b border-gray-800 py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center lg:justify-between items-center gap-6 text-sm font-medium text-[#A8B7B0]">
            {benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-center gap-3">
                    <benefit.icon className="w-5 h-5 text-[#20E875]" />
                    <span className="whitespace-pre-line">{benefit.text}</span>
                    {idx < benefits.length - 1 && <div className="hidden lg:block h-8 w-px bg-gray-800 ml-6"></div>}
                </div>
            ))}
        </div>
    </div>
  );
};