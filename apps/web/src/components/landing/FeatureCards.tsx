import { Shield, Users, Monitor, Database, Settings } from 'lucide-react';

export const FeatureCards = () => {
  const features = [
    { icon: Shield, title: "Privacy-Focused", desc: "Designed with privacy and user control as core principles." },
    { icon: Users, title: "Built for Teams", desc: "An organized communication experience for people and communities." },
    { icon: Monitor, title: "Simple & Clean", desc: "A focused and easy-to-use messaging experience." },
    { icon: Database, title: "Secure Data Handling", desc: "Security-focused architecture and protected data handling." },
    { icon: Settings, title: "Controlled Access", desc: "Structured permissions and controlled administrative operations." },
  ];

  return (
    <section className="py-24 px-6 bg-[#03120F] text-center">
        <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-16">Why Choose SUTRA?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 text-left">
                {features.map((feature, idx) => (
                    <div key={idx} className="p-6 bg-[#071C17] rounded-xl border border-gray-800 hover:border-gray-600 hover:-translate-y-1 transition-all duration-300 shadow-sm group h-full flex flex-col">
                        <feature.icon className="w-8 h-8 text-[#20E875] mb-5 group-hover:scale-110 transition-transform duration-300" />
                        <h3 className="font-bold text-white mb-3">{feature.title}</h3>
                        <p className="text-sm text-[#A8B7B0] leading-relaxed flex-grow">{feature.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
  );
};