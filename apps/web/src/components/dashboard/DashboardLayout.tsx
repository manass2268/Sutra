import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useTrackMyPresence } from '../../hooks/useUserPresence';
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  BookUser,
  Settings,
  HelpCircle,
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import Logo from '../../assets/SUTRA-favicon-64.png';

interface NavConfig {
  to: string;
  label: string;
  icon: React.ReactNode;
  end?: boolean;
  isChats?: boolean;
}

export default function DashboardLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useTrackMyPresence(user?.uid);

  const [isPinned, setIsPinned] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [liveDisplayName, setLiveDisplayName] = useState('');
  const [livePhotoURL, setLivePhotoURL] = useState('');

  const isExpanded = isPinned || isHovered;

  useEffect(() => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);

    const unsub = onSnapshot(userRef, async (snap) => {
      if (snap.exists() && snap.data().username) {
        const data = snap.data();
        setUsername(data.username);
        setLiveDisplayName(data.displayName || user.displayName || 'User');
        setLivePhotoURL(data.photoURL || user.photoURL || '');
      } else {
        const base = (user.email?.split('@')[0] || 'user')
          .replace(/[^a-z0-9]/gi, '')
          .toLowerCase();
        const generated = `${base}_${user.uid.slice(0, 4).toLowerCase()}`;
        await setDoc(
          userRef,
          {
            uid: user.uid,
            displayName: user.displayName || base,
            email: user.email || '',
            username: generated,
          },
          { merge: true }
        );
      }
    });

    return () => unsub();
  }, [user]);

  const handleLogout = async () => {
    if (user) {
      await setDoc(
        doc(db, 'users', user.uid),
        { isOnline: false, lastSeen: serverTimestamp() },
        { merge: true }
      ).catch(() => {});
    }
    await signOut(auth);
    navigate('/login');
  };

  const navItems: NavConfig[] = [
    { to: '/dashboard/overview', label: 'Overview', icon: <LayoutDashboard size={19} /> },
    { to: '/dashboard', label: 'Chats', icon: <MessageSquare size={19} />, end: true, isChats: true },
    { to: '/dashboard/contacts', label: 'Contacts', icon: <BookUser size={19} /> },
    { to: '/dashboard/groups', label: 'Groups', icon: <Users size={19} /> },
  ];

  const prefItems: NavConfig[] = [
    { to: '/dashboard/settings', label: 'Settings', icon: <Settings size={19} /> },
    { to: '/dashboard/support', label: 'Help & Support', icon: <HelpCircle size={19} /> },
  ];

  const displayNameToShow = liveDisplayName || user?.displayName || 'User';

  return (
    <div className="h-[100dvh] w-full bg-[#040B0A] text-white flex overflow-hidden font-sans">
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`fixed md:static inset-y-0 left-0 z-50 flex flex-col bg-[#07110E] border-r border-white/10 transition-all duration-300 ease-in-out shrink-0 ${
          mobileOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'
        } ${isExpanded ? 'md:w-64' : 'md:w-[76px]'}`}
      >
        <div className="h-16 px-4 flex items-center justify-between border-b border-white/5 shrink-0">
          <NavLink
            to="/dashboard"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 overflow-hidden"
          >
            <img
              src={Logo}
              alt="SUTRA Logo"
              className="w-9 h-9 shrink-0 filter drop-shadow-[0_0_8px_rgba(0,255,133,0.45)]"
            />
            <span
              className={`text-lg font-bold tracking-wider text-white whitespace-nowrap transition-opacity duration-200 ${
                isExpanded || mobileOpen ? 'opacity-100' : 'opacity-0 md:hidden'
              }`}
            >
              SUTRAA
            </span>
          </NavLink>

          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto overflow-x-hidden">
          <button
            type="button"
            onClick={() => setIsPinned((prev) => !prev)}
            title={isPinned ? 'Unpin Sidebar' : 'Pin Sidebar Open'}
            className={`hidden md:flex w-full items-center gap-3 px-3 py-2.5 mb-2 rounded-xl transition-all border ${
              !isExpanded ? 'justify-center' : ''
            } ${
              isPinned
                ? 'bg-[#00FF85]/12 text-[#00FF85] border-[#00FF85]/25'
                : 'text-gray-400 hover:bg-white/5 hover:text-white border-transparent'
            }`}
          >
            <span className="shrink-0">
              {isPinned ? <PanelLeftClose size={19} /> : <PanelLeftOpen size={19} />}
            </span>
            {isExpanded && (
              <span className="font-medium text-sm whitespace-nowrap truncate">
                {isPinned ? 'Collapse Menu' : 'Pin Menu'}
              </span>
            )}
          </button>

          {navItems.map((item) => (
            <SidebarLink
              key={item.to}
              item={item}
              expanded={isExpanded || mobileOpen}
              currentPath={location.pathname}
              onClick={() => setMobileOpen(false)}
            />
          ))}

          <div className="pt-6 pb-2">
            {isExpanded || mobileOpen ? (
              <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-3">
                Preferences
              </p>
            ) : (
              <div className="border-t border-white/10 mx-2" />
            )}
          </div>

          {prefItems.map((item) => (
            <SidebarLink
              key={item.to}
              item={item}
              expanded={isExpanded || mobileOpen}
              currentPath={location.pathname}
              onClick={() => setMobileOpen(false)}
            />
          ))}
        </nav>

        <div className="p-3 border-t border-white/5 shrink-0">
          <button
            onClick={handleLogout}
            title="Logout"
            className={`flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors ${
              !(isExpanded || mobileOpen) ? 'justify-center' : ''
            }`}
          >
            <LogOut size={19} className="shrink-0" />
            {(isExpanded || mobileOpen) && (
              <span className="font-medium text-sm whitespace-nowrap">Logout</span>
            )}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-[100dvh] min-w-0 overflow-hidden">
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 bg-[#040B0A] border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
            >
              <Menu size={20} />
            </button>

            <div className="hidden md:flex items-center bg-[#07110E] border border-white/10 focus-within:border-[#00FF85]/50 rounded-full px-4 py-2 w-72 lg:w-96 transition">
              <Search size={15} className="text-gray-500 shrink-0" />
              <input
                type="text"
                placeholder="Search SUTRAA..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') navigate('/dashboard/contacts');
                }}
                className="bg-transparent border-none outline-none text-sm ml-3 w-full text-white placeholder-gray-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-5">
            <button
              onClick={() => navigate('/dashboard')}
              className="relative p-2 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
            >
              <Bell size={19} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#00FF85] rounded-full"></span>
            </button>

            <NavLink
              to="/dashboard/settings"
              title="Edit Profile & Settings"
              className="flex items-center gap-3"
            >
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold leading-none text-white">
                  {displayNameToShow}
                </p>
                <p className="text-xs text-[#00FF85] mt-1">
                  {username ? `@${username}` : user?.email}
                </p>
              </div>
              {livePhotoURL ? (
                <img
                  src={livePhotoURL}
                  alt={displayNameToShow}
                  className="w-9 h-9 rounded-full object-cover border border-[#00FF85]/40 shrink-0"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-[#0F2E22] border border-[#00FF85]/35 flex items-center justify-center text-[#00FF85] font-bold text-sm shrink-0">
                  {displayNameToShow.charAt(0).toUpperCase()}
                </div>
              )}
            </NavLink>
          </div>
        </header>

        <div className="flex-1 overflow-hidden">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

function SidebarLink({
  item,
  expanded,
  currentPath,
  onClick,
}: {
  item: NavConfig;
  expanded: boolean;
  currentPath: string;
  onClick: () => void;
}) {
  return (
    <NavLink
      to={item.to}
      end={item.end}
      onClick={onClick}
      title={!expanded ? item.label : undefined}
      className={({ isActive }) => {
        const active =
          isActive || (item.isChats && currentPath.startsWith('/dashboard/chats'));
        return `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
          !expanded ? 'justify-center' : ''
        } ${
          active
            ? 'bg-[#00FF85]/12 text-[#00FF85] border border-[#00FF85]/25 shadow-[0_0_15px_rgba(0,255,133,0.08)]'
            : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
        }`;
      }}
    >
      <span className="shrink-0">{item.icon}</span>
      {expanded && <span className="font-medium text-sm whitespace-nowrap truncate">{item.label}</span>}
    </NavLink>
  );
}