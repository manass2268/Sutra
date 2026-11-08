import { useAuth } from '../contexts/AuthContext';
import { MessageSquare, Users, BookUser, Plus } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const firstName = user?.displayName?.split(' ')[0] || 'there';

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome Section */}
      <section className="bg-gradient-to-r from-[#071C17] to-[#0A1915] border border-white/5 rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#20E875]/5 rounded-full blur-[80px] pointer-events-none"></div>
        <h1 className="text-3xl font-bold mb-2">Welcome back, {firstName}.</h1>
        <p className="text-gray-400 text-sm max-w-lg">Your private communication workspace is ready. Invite your trusted contacts to get started with end-to-end encrypted messaging.</p>
        <button className="mt-6 flex items-center gap-2 bg-[#20E875] hover:bg-[#77F5A5] text-[#03120F] font-bold py-2.5 px-5 rounded-lg transition-all shadow-[0_0_20px_rgba(32,232,117,0.2)]">
          <Plus size={18} /> New Conversation
        </button>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon={<MessageSquare className="text-[#20E875]" size={24} />} title="Total Conversations" value="0" subtitle="Ready to start" />
        <StatCard icon={<BookUser className="text-[#20E875]" size={24} />} title="Trusted Contacts" value="0" subtitle="Sync your network" />
        <StatCard icon={<Users className="text-[#20E875]" size={24} />} title="Active Groups" value="0" subtitle="Create a space" />
      </section>

      {/* Zero Data State / Recent Activity */}
      <section className="bg-[#071C17] border border-white/5 rounded-2xl p-8 text-center mt-8">
        <div className="w-16 h-16 rounded-full bg-[#0A1915] border border-white/10 flex items-center justify-center mx-auto mb-4">
          <MessageSquare size={28} className="text-gray-500" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No recent activity</h3>
        <p className="text-gray-400 text-sm max-w-sm mx-auto">When you start messaging contacts or joining groups, your recent activity will securely appear here.</p>
      </section>
    </div>
  );
}

function StatCard({ icon, title, value, subtitle }: { icon: React.ReactNode, title: string, value: string, subtitle: string }) {
  return (
    <div className="bg-[#071C17] border border-white/5 rounded-2xl p-6 hover:border-[#20E875]/30 transition-colors group">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-[#0A1915] rounded-xl group-hover:bg-[#20E875]/10 transition-colors">{icon}</div>
      </div>
      <h3 className="text-3xl font-bold text-white mb-1">{value}</h3>
      <p className="text-sm font-medium text-gray-300">{title}</p>
      <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
    </div>
  );
}