import { Outlet, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { MessageSquare, Users, BookUser, Settings, HelpCircle, LogOut, Bell, Search, Menu } from 'lucide-react';
import Logo from '../../assets/SUTRA-favicon-64.png';

export default function DashboardLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#03120F] text-white flex font-sans">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-[#071C17] border-r border-white/5">
        <div className="p-6 flex items-center gap-3">
          <img src={Logo} alt="SUTRA Logo" className="w-8 h-8 filter drop-shadow-[0_0_8px_rgba(32,232,117,0.5)]" />
          <span className="text-xl font-bold tracking-wide">SUTRAA</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <NavItem icon={<MessageSquare size={18} />} label="Overview" active />
          <NavItem icon={<MessageSquare size={18} />} label="Chats" />
          <NavItem icon={<BookUser size={18} />} label="Contacts" />
          <NavItem icon={<Users size={18} />} label="Groups" />
          <div className="pt-8 pb-2">
            <p className="text-xs font-semibold text-gray-500 uppercase px-3">Preferences</p>
          </div>
          <NavItem icon={<Settings size={18} />} label="Settings" />
          <NavItem icon={<HelpCircle size={18} />} label="Help & Support" />
        </nav>

        <div className="p-4 border-t border-white/5">
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 w-full text-left text-gray-400 hover:text-[#ff4d4d] hover:bg-white/5 rounded-lg transition-colors">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Topbar */}
        <header className="h-16 flex items-center justify-between px-6 bg-[#03120F] border-b border-white/5 shrink-0">
          <div className="flex items-center gap-4 md:hidden">
            <button className="text-gray-400 hover:text-white"><Menu size={24} /></button>
          </div>
          
          <div className="hidden md:flex items-center bg-[#071C17] border border-white/10 rounded-full px-4 py-2 w-96">
            <Search size={16} className="text-gray-500" />
            <input type="text" placeholder="Search SUTRAA..." className="bg-transparent border-none outline-none text-sm ml-3 w-full text-white placeholder-gray-500" />
          </div>

          <div className="flex items-center gap-6 ml-auto">
            <button className="relative text-gray-400 hover:text-white transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#20E875] rounded-full"></span>
            </button>
            <div className="flex items-center gap-3">
              <div className="hidden text-right md:block">
                <p className="text-sm font-medium leading-none">{user?.displayName || 'User'}</p>
                <p className="text-xs text-gray-400 mt-1">{user?.email}</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-[#0A1915] border border-[#20E875]/30 flex items-center justify-center text-[#20E875] font-bold">
                {user?.displayName ? user.displayName.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <a href="#" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${active ? 'bg-[#20E875]/10 text-[#20E875] border border-[#20E875]/20 shadow-[0_0_15px_rgba(32,232,117,0.1)]' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
      {icon}
      <span className="font-medium text-sm">{label}</span>
    </a>
  );
}