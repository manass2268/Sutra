import { useState, useEffect, useRef } from 'react';
import { Users, Search, Plus, MoreVertical, CheckCheck } from 'lucide-react';
import { type ChatRoom, slimScrollbar } from '../../types/chat';
interface ChatListSidebarProps {
  chats: ChatRoom[];
  activeChat: ChatRoom | null;
  currentUserId?: string;
  defaultFilter?: 'All' | 'Unread' | 'Groups' | 'Pinned';
  onSelectChat: (chat: ChatRoom) => void;
  onOpenNewChat: () => void;
}

export default function ChatListSidebar({
  chats,
  activeChat,
  currentUserId,
  defaultFilter = 'All',
  onSelectChat,
  onOpenNewChat,
}: ChatListSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'All' | 'Unread' | 'Groups' | 'Pinned'>(defaultFilter);
  const [chatListWidth, setChatListWidth] = useState(340);

  const isResizingRef = useRef(false);
  const sidebarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setActiveFilter(defaultFilter);
  }, [defaultFilter]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizingRef.current || !sidebarRef.current) return;
      const leftEdge = sidebarRef.current.getBoundingClientRect().left;
      const newWidth = Math.min(Math.max(e.clientX - leftEdge, 270), 500);
      setChatListWidth(newWidth);
    };

    const handleMouseUp = () => {
      if (isResizingRef.current) {
        isResizingRef.current = false;
        document.body.style.cursor = 'default';
        document.body.style.userSelect = 'auto';
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const startResizing = () => {
    isResizingRef.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  const getChatName = (chat: ChatRoom) => {
    if (chat.isGroup) return chat.name || 'Unnamed Group';
    const otherUid = chat.participants.find((id) => id !== currentUserId);
    return (otherUid && chat.participantDetails?.[otherUid]?.displayName) || 'Direct Chat';
  };

  const getChatAvatar = (chat: ChatRoom) => {
    if (chat.isGroup) return null;
    const otherUid = chat.participants.find((id) => id !== currentUserId);
    return (otherUid && chat.participantDetails?.[otherUid]?.photoURL) || null;
  };

  const getUnreadCount = (chat: ChatRoom) => {
    if (!currentUserId || activeChat?.id === chat.id) return 0;
    return chat.unreadCounts?.[currentUserId] || 0;
  };

  const totalUnreadChats = chats.filter((c) => getUnreadCount(c) > 0).length;

  const formatTime = (timestamp: any) => {
    if (!timestamp?.seconds) return '';
    return new Date(timestamp.seconds * 1000).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredChats = chats.filter((chat) => {
    const nameMatch = getChatName(chat).toLowerCase().includes(searchQuery.toLowerCase());
    if (activeFilter === 'Groups') return nameMatch && chat.isGroup;
    if (activeFilter === 'Unread') return nameMatch && getUnreadCount(chat) > 0;
    return nameMatch;
  });

  return (
    <section
      ref={sidebarRef}
      style={{ width: typeof window !== 'undefined' && window.innerWidth >= 768 ? `${chatListWidth}px` : undefined }}
      className={`w-full md:w-auto bg-[#07110E] border-r border-white/10 flex-col shrink-0 relative ${
        activeChat ? 'hidden md:flex' : 'flex'
      }`}
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-2.5 flex items-center justify-between shrink-0">
        <h1 className="text-xl font-bold tracking-tight text-white">
          {defaultFilter === 'Groups' ? 'Groups' : 'Chats'}
        </h1>
        <div className="flex items-center gap-1">
          <button
            onClick={onOpenNewChat}
            title="New Chat / Group"
            className="p-2 rounded-full hover:bg-white/10 hover:text-[#00FF85] text-gray-300 transition"
          >
            <Plus size={19} />
          </button>
          <button className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition">
            <MoreVertical size={18} />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-3 pb-2.5 shrink-0">
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search or start a new chat"
            className="w-full bg-[#0C1B17] text-[13px] text-gray-200 placeholder-gray-500 pl-10 pr-4 py-2 rounded-lg border border-white/5 focus:outline-none focus:border-[#00FF85]/40 transition"
          />
        </div>
      </div>

      {/* Filter Pills */}
      <div className="px-3 pb-2.5 flex items-center gap-1.5 flex-wrap shrink-0 border-b border-white/5">
        {(['All', 'Unread', 'Groups', 'Pinned'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition flex items-center gap-1.5 ${
              activeFilter === tab
                ? 'bg-[#00FF85]/20 text-[#00FF85] border border-[#00FF85]/30'
                : 'bg-[#0C1B17] text-gray-400 hover:bg-white/10 hover:text-gray-200 border border-transparent'
            }`}
          >
            <span>{tab}</span>
            {tab === 'Unread' && totalUnreadChats > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#00FF85] text-[#040B0A]">
                {totalUnreadChats}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Chat List */}
      <div className={`flex-1 overflow-y-auto ${slimScrollbar}`}>
        {filteredChats.length === 0 ? (
          <div className="text-center py-14 px-4">
            <p className="text-sm text-gray-500 mb-4">
              {activeFilter === 'Unread' ? 'No unread messages.' : 'No chats found.'}
            </p>
            {activeFilter !== 'Unread' && (
              <button
                onClick={onOpenNewChat}
                className="text-xs bg-[#00FF85] hover:bg-[#00e677] text-[#040B0A] px-4 py-2 rounded-full font-bold transition"
              >
                + Start a New Chat
              </button>
            )}
          </div>
        ) : (
          filteredChats.map((chat) => {
            const isSelected = activeChat?.id === chat.id;
            const name = getChatName(chat);
            const avatar = getChatAvatar(chat);
            const unread = getUnreadCount(chat);
            const isLastFromMe = chat.lastSenderId === currentUserId;

            return (
              <div
                key={chat.id}
                onClick={() => onSelectChat(chat)}
                className={`flex items-center gap-3 px-3.5 py-3 cursor-pointer transition border-b border-white/[0.04] ${
                  isSelected ? 'bg-[#0F241D]' : 'hover:bg-white/[0.04]'
                }`}
              >
                <div className="relative shrink-0">
                  {chat.isGroup ? (
                    <div className="w-12 h-12 rounded-full bg-[#00FF85]/15 border border-[#00FF85]/25 flex items-center justify-center text-[#00FF85]">
                      <Users size={20} />
                    </div>
                  ) : avatar ? (
                    <img src={avatar} alt={name} className="w-12 h-12 rounded-full object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-[#0F2E22] text-[#00FF85] flex items-center justify-center font-bold text-base">
                      {name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#00FF85] border-2 border-[#07110E] rounded-full" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className={`text-[15px] truncate ${unread > 0 ? 'font-bold text-white' : 'font-medium text-gray-100'}`}>
                      {name}
                    </h3>
                    <span className={`text-[11px] shrink-0 ml-2 ${unread > 0 ? 'text-[#00FF85] font-semibold' : 'text-gray-500'}`}>
                      {formatTime(chat.updatedAt)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <div className="flex items-center gap-1 min-w-0">
                      {isLastFromMe && unread === 0 && (
                        <CheckCheck size={14} className="text-[#00FF85] shrink-0" />
                      )}
                      <p className={`text-[13px] truncate ${unread > 0 ? 'text-gray-100 font-medium' : 'text-gray-400'}`}>
                        {chat.lastMessage || 'Say hi!'}
                      </p>
                    </div>
                    {unread > 0 && (
                      <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-[#00FF85] text-[#040B0A] text-[11px] font-bold flex items-center justify-center shrink-0">
                        {unread > 99 ? '99+' : unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Drag Resize Handle */}
      <div
        onMouseDown={startResizing}
        title="Drag to resize"
        className="hidden md:block absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-[#00FF85]/50 active:bg-[#00FF85] transition-colors z-20"
      />
    </section>
  );
}