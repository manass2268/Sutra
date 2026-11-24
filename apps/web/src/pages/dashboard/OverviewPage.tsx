import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { MessageSquare, Users, Bell, AtSign, ArrowUpRight, Plus } from 'lucide-react';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { type ChatRoom, slimScrollbar } from '../../types/chat';

export default function OverviewPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [chats, setChats] = useState<ChatRoom[]>([]);
  const [username, setUsername] = useState('');

  useEffect(() => {
    if (!user) return;

    getDoc(doc(db, 'users', user.uid)).then((snap) => {
      if (snap.exists()) setUsername(snap.data().username || '');
    });

    const q = query(collection(db, 'chats'), where('participants', 'array-contains', user.uid));
    const unsub = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as ChatRoom[];
      list.sort((a, b) => (b.updatedAt?.seconds || 0) - (a.updatedAt?.seconds || 0));
      setChats(list);
    });

    return () => unsub();
  }, [user]);

  const totalUnread = chats.reduce((acc, c) => acc + (user ? c.unreadCounts?.[user.uid] || 0 : 0), 0);
  const groupCount = chats.filter((c) => c.isGroup).length;

  return (
    <div className={`h-full overflow-y-auto p-6 md:p-8 bg-[#040B0A] ${slimScrollbar}`}>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Welcome Banner */}
        <div className="p-6 rounded-2xl bg-[#07110E] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Welcome back, {user?.displayName || 'User'} 👋
            </h1>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#00FF85]/15 text-[#00FF85] text-xs font-semibold">
                <AtSign size={12} /> {username || 'set-username'}
              </span>
              <button
                onClick={() => navigate('/dashboard/settings')}
                className="text-xs text-gray-400 hover:text-[#00FF85] underline transition"
              >
                Edit username
              </button>
            </div>
          </div>

          <button
            onClick={() => navigate('/dashboard/chats')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00FF85] hover:bg-[#00e677] text-[#040B0A] text-sm font-bold transition self-start sm:self-auto"
          >
            <Plus size={17} /> Open Chats
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-[#07110E] border border-white/10">
            <div className="flex items-center justify-between text-gray-400 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider">Active Chats</span>
              <MessageSquare size={18} className="text-[#00FF85]" />
            </div>
            <p className="text-3xl font-bold text-white">{chats.length}</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#07110E] border border-white/10">
            <div className="flex items-center justify-between text-gray-400 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider">Unread Messages</span>
              <Bell size={18} className="text-[#00FF85]" />
            </div>
            <p className="text-3xl font-bold text-[#00FF85]">{totalUnread}</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#07110E] border border-white/10">
            <div className="flex items-center justify-between text-gray-400 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider">Groups</span>
              <Users size={18} className="text-[#00FF85]" />
            </div>
            <p className="text-3xl font-bold text-white">{groupCount}</p>
          </div>
        </div>

        {/* Recent Conversations */}
        <div className="p-6 rounded-2xl bg-[#07110E] border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-white">Recent Conversations</h2>
            <button
              onClick={() => navigate('/dashboard/chats')}
              className="text-xs text-[#00FF85] hover:underline flex items-center gap-1"
            >
              View all <ArrowUpRight size={14} />
            </button>
          </div>

          {chats.length === 0 ? (
            <p className="text-sm text-gray-500 py-6 text-center">
              No conversations yet. Go to Chats and find someone using their @username.
            </p>
          ) : (
            <div className="divide-y divide-white/5">
              {chats.slice(0, 5).map((chat) => {
                const otherUid = chat.participants.find((id) => id !== user?.uid);
                const title = chat.isGroup
                  ? chat.name
                  : (otherUid && chat.participantDetails?.[otherUid]?.displayName) || 'Direct Chat';
                const unread = user ? chat.unreadCounts?.[user.uid] || 0 : 0;

                return (
                  <div
                    key={chat.id}
                    onClick={() => navigate('/dashboard/chats', { state: { openChatId: chat.id } })}
                    className="py-3 flex items-center justify-between cursor-pointer hover:bg-white/[0.03] px-3 rounded-xl transition"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{title}</p>
                      <p className="text-xs text-gray-400 truncate mt-0.5">{chat.lastMessage}</p>
                    </div>
                    {unread > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-[#00FF85] text-[#040B0A] text-xs font-bold">
                        {unread} new
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}