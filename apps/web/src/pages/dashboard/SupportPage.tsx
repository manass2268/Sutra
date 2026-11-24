import { HelpCircle, ShieldCheck, AtSign } from 'lucide-react';
import { slimScrollbar } from '../../types/chat';

export default function SupportPage() {
  return (
    <div className={`h-full overflow-y-auto p-6 md:p-8 bg-[#040B0A] ${slimScrollbar}`}>
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="p-6 rounded-2xl bg-[#07110E] border border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <HelpCircle size={22} className="text-[#00FF85]" />
            <h1 className="text-xl font-bold text-white">Help & Support</h1>
          </div>
          <p className="text-sm text-gray-400">
            Quick guide to using Sutraa private real-time communication.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#07110E] border border-white/10 space-y-2">
          <div className="flex items-center gap-2 text-[#00FF85] font-semibold text-sm">
            <AtSign size={16} /> How do I start a chat?
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            Set your unique @username in Settings, share it with your teammate, and click the + button in Chats to find them by exact @username.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#07110E] border border-white/10 space-y-2">
          <div className="flex items-center gap-2 text-[#00FF85] font-semibold text-sm">
            <ShieldCheck size={16} /> Privacy & Security
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            Public user directory browsing is disabled. Nobody can message you unless they know your exact @username.
          </p>
        </div>
      </div>
    </div>
  );
}