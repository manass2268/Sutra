import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  getDocs,
  increment,
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import {
  MessageSquare,
  Users,
  Phone,
  Settings,
  Search,
  Plus,
  MoreVertical,
  Video,
  Paperclip,
  Smile,
  Send,
  UserPlus,
  Image as ImageIcon,
  Pin,
  FileText,
  ChevronRight,
  CheckCheck,
  X,
  ArrowLeft,
  Info,
} from 'lucide-react';

interface AppUser {
  uid: string;
  displayName: string;
  email: string;
  username?: string;
  photoURL?: string;
}

interface ChatRoom {
  id: string;
  name?: string;
  isGroup: boolean;
  participants: string[];
  participantDetails?: Record<string, { displayName: string; photoURL?: string; email?: string }>;
  lastMessage?: string;
  lastSenderId?: string;
  unreadCounts?: Record<string, number>;
  updatedAt?: any;
  createdBy?: string;
}

interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  senderPhoto?: string;
  createdAt?: any;
}

// Custom dark slim scrollbar utility
const slimScrollbar =
  '[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/20';

export default function DashboardPage() {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [chats, setChats] = useState<ChatRoom[]>([]);
  const [activeChat, setActiveChat] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'All' | 'Unread' | 'Groups' | 'Pinned'>('All');
  const [showRightPanel, setShowRightPanel] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 1280 : false
  );

  // Resizable Chats Sidebar State
  const [chatListWidth, setChatListWidth] = useState(340);
  const isResizingRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // New Chat / Group Modal State (Exact Match Only)
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [usernameQuery, setUsernameQuery] = useState('');
  const [matchedUser, setMatchedUser] = useState<AppUser | null>(null);
  const [searchError, setSearchError] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<AppUser[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Drag-to-resize handler for Chats Sidebar
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizingRef.current || !containerRef.current) return;
      const containerLeft = containerRef.current.getBoundingClientRect().left;
      const newWidth = Math.min(Math.max(e.clientX - containerLeft, 270), 500);
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

  // 1. Auth Listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/login');
      } else {
        setCurrentUser(user);
      }
    });
    return () => unsub();
  }, [navigate]);

  // Helper: Mark active chat as read
  const markChatAsRead = async (chatId: string) => {
    if (!currentUser) return;
    try {
      await updateDoc(doc(db, 'chats', chatId), {
        [`unreadCounts.${currentUser.uid}`]: 0,
      });
    } catch (err) {
      console.error('Failed to mark chat as read:', err);
    }
  };

  // 2. Real-time Chats Listener
  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', currentUser.uid)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const chatList: ChatRoom[] = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as ChatRoom[];

      chatList.sort((a, b) => {
        const timeA = a.updatedAt?.seconds || 0;
        const timeB = b.updatedAt?.seconds || 0;
        return timeB - timeA;
      });

      setChats(chatList);
    });

    return () => unsub();
  }, [currentUser]);

  // 3. Real-time Messages Listener + Auto Mark Read
  useEffect(() => {
    if (!activeChat) {
      setMessages([]);
      return;
    }

    markChatAsRead(activeChat.id);

    const q = query(
      collection(db, 'chats', activeChat.id, 'messages'),
      orderBy('createdAt', 'asc')
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const msgList: Message[] = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as Message[];
      setMessages(msgList);
      markChatAsRead(activeChat.id);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 80);
    });

    return () => unsub();
  }, [activeChat?.id, currentUser?.uid]);

  // Open Modal (No user list fetched)
  const openNewChatModal = () => {
    setShowNewChatModal(true);
    setUsernameQuery('');
    setMatchedUser(null);
    setSearchError('');
    setSelectedUsers([]);
    setGroupName('');
    setIsCreatingGroup(false);
  };

  // Exact Username / Email Match Search
  const handleSearchUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = usernameQuery.trim();
    if (!trimmed || !currentUser) return;

    setIsSearching(true);
    setSearchError('');
    setMatchedUser(null);

    try {
      const usersRef = collection(db, 'users');

      let snap = await getDocs(query(usersRef, where('username', '==', trimmed)));
      if (snap.empty) {
        snap = await getDocs(query(usersRef, where('email', '==', trimmed)));
      }
      if (snap.empty) {
        snap = await getDocs(query(usersRef, where('displayName', '==', trimmed)));
      }

      if (snap.empty) {
        setSearchError('No user found with this exact username.');
      } else {
        const found = snap.docs[0].data() as AppUser;
        if (found.uid === currentUser.uid) {
          setSearchError("You can't message yourself.");
        } else {
          setMatchedUser(found);
        }
      }
    } catch {
      setSearchError('Error searching user. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  // Start 1-on-1 Chat
  const startDirectChat = async (targetUser: AppUser) => {
    if (!currentUser) return;

    const existing = chats.find(
      (c) => !c.isGroup && c.participants.includes(targetUser.uid)
    );
    if (existing) {
      setActiveChat(existing);
      setShowNewChatModal(false);
      return;
    }

    const newChatRef = await addDoc(collection(db, 'chats'), {
      isGroup: false,
      participants: [currentUser.uid, targetUser.uid],
      participantDetails: {
        [currentUser.uid]: {
          displayName: currentUser.displayName || 'Sutra User',
          photoURL: currentUser.photoURL || '',
          email: currentUser.email || '',
        },
        [targetUser.uid]: {
          displayName: targetUser.displayName || 'Sutra User',
          photoURL: targetUser.photoURL || '',
          email: targetUser.email || '',
        },
      },
      lastMessage: 'Started a conversation',
      lastSenderId: currentUser.uid,
      unreadCounts: {
        [currentUser.uid]: 0,
        [targetUser.uid]: 0,
      },
      updatedAt: serverTimestamp(),
      createdBy: currentUser.uid,
    });

    setActiveChat({
      id: newChatRef.id,
      isGroup: false,
      participants: [currentUser.uid, targetUser.uid],
      participantDetails: {
        [currentUser.uid]: { displayName: currentUser.displayName || 'You', photoURL: currentUser.photoURL || '' },
        [targetUser.uid]: { displayName: targetUser.displayName, photoURL: targetUser.photoURL || '' },
      },
    });
    setShowNewChatModal(false);
  };

  // Create Group Chat
  const createGroupChat = async () => {
    if (!currentUser || !groupName.trim() || selectedUsers.length === 0) return;

    const participantIds = [currentUser.uid, ...selectedUsers.map((u) => u.uid)];
    const participantDetails: Record<string, any> = {
      [currentUser.uid]: {
        displayName: currentUser.displayName || 'You',
        photoURL: currentUser.photoURL || '',
        email: currentUser.email || '',
      },
    };
    const unreadCounts: Record<string, number> = { [currentUser.uid]: 0 };

    selectedUsers.forEach((u) => {
      participantDetails[u.uid] = {
        displayName: u.displayName || 'User',
        photoURL: u.photoURL || '',
        email: u.email || '',
      };
      unreadCounts[u.uid] = 1;
    });

    const newGroupRef = await addDoc(collection(db, 'chats'), {
      name: groupName.trim(),
      isGroup: true,
      participants: participantIds,
      participantDetails,
      lastMessage: `${currentUser.displayName || 'Admin'} created group`,
      lastSenderId: currentUser.uid,
      unreadCounts,
      updatedAt: serverTimestamp(),
      createdBy: currentUser.uid,
    });

    setActiveChat({
      id: newGroupRef.id,
      name: groupName.trim(),
      isGroup: true,
      participants: participantIds,
      participantDetails,
      createdBy: currentUser.uid,
    });
    setShowNewChatModal(false);
  };

  // Send Real-time Message + Increment Receiver Unread Count
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat || !currentUser) return;

    const textToSend = newMessage.trim();
    setNewMessage('');

    await addDoc(collection(db, 'chats', activeChat.id, 'messages'), {
      text: textToSend,
      senderId: currentUser.uid,
      senderName: currentUser.displayName || 'User',
      senderPhoto: currentUser.photoURL || '',
      createdAt: serverTimestamp(),
    });

    const updatePayload: Record<string, any> = {
      lastMessage: textToSend,
      lastSenderId: currentUser.uid,
      updatedAt: serverTimestamp(),
      [`unreadCounts.${currentUser.uid}`]: 0,
    };

    activeChat.participants.forEach((uid) => {
      if (uid !== currentUser.uid) {
        updatePayload[`unreadCounts.${uid}`] = increment(1);
      }
    });

    await updateDoc(doc(db, 'chats', activeChat.id), updatePayload);
  };

  // Helpers
  const getChatName = (chat: ChatRoom) => {
    if (chat.isGroup) return chat.name || 'Unnamed Group';
    const otherUid = chat.participants.find((id) => id !== currentUser?.uid);
    return (otherUid && chat.participantDetails?.[otherUid]?.displayName) || 'Direct Chat';
  };

  const getChatAvatar = (chat: ChatRoom) => {
    if (chat.isGroup) return null;
    const otherUid = chat.participants.find((id) => id !== currentUser?.uid);
    return (otherUid && chat.participantDetails?.[otherUid]?.photoURL) || null;
  };

  const getUnreadCount = (chat: ChatRoom) => {
    if (!currentUser || activeChat?.id === chat.id) return 0;
    return chat.unreadCounts?.[currentUser.uid] || 0;
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
    <div
      ref={containerRef}
      className="h-full w-full bg-[#040B0A] text-gray-100 flex overflow-hidden font-sans relative"
    >
      {/* 1. WHATSAPP-STYLE RESIZABLE CHATS SIDEBAR */}
      <section
        style={{ width: typeof window !== 'undefined' && window.innerWidth >= 768 ? `${chatListWidth}px` : undefined }}
        className={`w-full md:w-auto bg-[#07110E] border-r border-white/10 flex-col shrink-0 relative ${
          activeChat ? 'hidden md:flex' : 'flex'
        }`}
      >
        {/* Header */}
        <div className="px-4 pt-4 pb-2.5 flex items-center justify-between shrink-0">
          <h1 className="text-xl font-bold tracking-tight text-white">Chats</h1>
          <div className="flex items-center gap-1">
            <button
              onClick={openNewChatModal}
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

        {/* Search Bar */}
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

        {/* Filter Pills (No ugly horizontal scrollbar) */}
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

        {/* Chat List (WhatsApp Web Edge-to-Edge Rows) */}
        <div className={`flex-1 overflow-y-auto ${slimScrollbar}`}>
          {filteredChats.length === 0 ? (
            <div className="text-center py-14 px-4">
              <p className="text-sm text-gray-500 mb-4">
                {activeFilter === 'Unread' ? 'No unread messages.' : 'No chats yet.'}
              </p>
              {activeFilter !== 'Unread' && (
                <button
                  onClick={openNewChatModal}
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
              const isLastFromMe = chat.lastSenderId === currentUser?.uid;

              return (
                <div
                  key={chat.id}
                  onClick={() => {
                    setActiveChat(chat);
                    if (unread > 0) markChatAsRead(chat.id);
                  }}
                  className={`flex items-center gap-3 px-3.5 py-3 cursor-pointer transition border-b border-white/[0.04] ${
                    isSelected
                      ? 'bg-[#0F241D]'
                      : 'hover:bg-white/[0.04]'
                  }`}
                >
                  {/* Avatar */}
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

                  {/* Name, Time & Last Message */}
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

      {/* 2. WHATSAPP WEB STYLE CHAT WINDOW */}
      <main
        className={`flex-1 flex-col bg-[#050C0A] relative min-w-0 ${
          activeChat ? 'flex' : 'hidden md:flex'
        }`}
      >
        {activeChat ? (
          <>
            {/* Chat Header */}
            <header className="h-[60px] px-4 border-b border-white/10 bg-[#07110E] flex items-center justify-between shrink-0 z-10">
              <div
                onClick={() => setShowRightPanel(!showRightPanel)}
                className="flex items-center gap-3 min-w-0 cursor-pointer"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveChat(null);
                  }}
                  className="md:hidden p-1.5 -ml-1 rounded-full text-gray-400 hover:bg-white/10 hover:text-white transition"
                >
                  <ArrowLeft size={20} />
                </button>

                {activeChat.isGroup ? (
                  <div className="w-10 h-10 rounded-full bg-[#00FF85]/15 flex items-center justify-center text-[#00FF85] shrink-0">
                    <Users size={18} />
                  </div>
                ) : getChatAvatar(activeChat) ? (
                  <img src={getChatAvatar(activeChat)!} alt="" className="w-10 h-10 rounded-full object-cover shrink-0" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#0F2E22] text-[#00FF85] flex items-center justify-center font-bold shrink-0">
                    {getChatName(activeChat).charAt(0).toUpperCase()}
                  </div>
                )}

                <div className="min-w-0">
                  <h2 className="text-[15px] font-semibold text-white leading-tight truncate">
                    {getChatName(activeChat)}
                  </h2>
                  <p className="text-[12px] text-[#00FF85]/80 leading-tight mt-0.5">
                    {activeChat.isGroup ? `${activeChat.participants.length} members` : 'online'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-gray-400">
                <button className="hidden sm:flex p-2 rounded-full hover:bg-white/10 hover:text-white transition">
                  <Video size={18} />
                </button>
                <button className="hidden sm:flex p-2 rounded-full hover:bg-white/10 hover:text-white transition">
                  <Phone size={17} />
                </button>
                <button className="p-2 rounded-full hover:bg-white/10 hover:text-white transition">
                  <Search size={17} />
                </button>
                <button
                  onClick={() => setShowRightPanel(!showRightPanel)}
                  title="Chat Info"
                  className={`p-2 rounded-full transition ${
                    showRightPanel ? 'bg-[#00FF85]/15 text-[#00FF85]' : 'hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Info size={18} />
                </button>
              </div>
            </header>

            {/* Messages Area (Subtle WhatsApp Dark Pattern + Compact Grouped Bubbles) */}
            <div
              style={{
                backgroundImage:
                  'radial-gradient(rgba(0, 255, 133, 0.04) 1px, transparent 1px)',
                backgroundSize: '22px 22px',
              }}
              className={`flex-1 overflow-y-auto px-4 sm:px-8 lg:px-14 py-4 flex flex-col ${slimScrollbar}`}
            >
              <div className="flex justify-center mb-4">
                <span className="px-3 py-1 rounded-lg bg-[#0B1915] text-[11px] font-medium text-gray-400 border border-white/5 shadow-sm">
                  Today
                </span>
              </div>

              {messages.map((msg, idx) => {
                const isMe = msg.senderId === currentUser?.uid;
                const prevMsg = idx > 0 ? messages[idx - 1] : null;
                const isSameSenderAsPrev = prevMsg?.senderId === msg.senderId;

                return (
                  <div
                    key={msg.id}
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'} ${
                      isSameSenderAsPrev ? 'mt-1' : 'mt-3'
                    }`}
                  >
                    <div
                      className={`relative max-w-[82%] sm:max-w-[65%] px-3 py-1.5 shadow-sm ${
                        isMe
                          ? `bg-[#0B3B2A] text-gray-100 rounded-lg ${!isSameSenderAsPrev ? 'rounded-tr-none' : ''}`
                          : `bg-[#101F1B] text-gray-100 rounded-lg border border-white/[0.04] ${!isSameSenderAsPrev ? 'rounded-tl-none' : ''}`
                      }`}
                    >
                      {!isMe && activeChat.isGroup && !isSameSenderAsPrev && (
                        <p className="text-[11px] font-semibold text-[#00FF85] mb-0.5">{msg.senderName}</p>
                      )}

                      {/* Inline Text + Timestamp (WhatsApp Web style) */}
                      <div className="flex flex-wrap items-end gap-x-2.5">
                        <span className="text-[14px] leading-[1.35] break-words whitespace-pre-wrap">
                          {msg.text}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] ml-auto pt-1 shrink-0 select-none ${
                            isMe ? 'text-[#86efac]/75' : 'text-gray-400/80'
                          }`}
                        >
                          {formatTime(msg.createdAt)}
                          {isMe && <CheckCheck size={13} className="text-[#00FF85]" />}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* WhatsApp Web Style Input Footer */}
            <form onSubmit={handleSendMessage} className="px-3 sm:px-4 py-2.5 bg-[#07110E] border-t border-white/10 shrink-0">
              <div className="flex items-center gap-2">
                <button type="button" className="p-2 rounded-full text-gray-400 hover:bg-white/5 hover:text-[#00FF85] transition">
                  <Smile size={20} />
                </button>
                <button type="button" className="p-2 rounded-full text-gray-400 hover:bg-white/5 hover:text-[#00FF85] transition">
                  <Paperclip size={19} />
                </button>

                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message"
                  className="flex-1 bg-[#0C1B17] text-sm text-white placeholder-gray-500 px-4 py-2.5 rounded-lg border border-white/5 focus:outline-none focus:border-[#00FF85]/40 transition min-w-0"
                />

                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="p-2.5 rounded-full bg-[#00FF85] hover:bg-[#00e677] disabled:opacity-40 text-[#040B0A] flex items-center justify-center transition shrink-0"
                >
                  <Send size={17} />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
            <div className="w-16 h-16 rounded-2xl bg-[#00FF85]/10 border border-[#00FF85]/20 flex items-center justify-center mb-4">
              <MessageSquare size={30} className="text-[#00FF85]" />
            </div>
            <h2 className="text-xl font-bold text-white mb-1.5">Sutraa Web</h2>
            <p className="text-sm text-gray-400 max-w-sm mb-6">
              Send and receive real-time private messages seamlessly. Select a chat or start a new one.
            </p>
            <button
              onClick={openNewChatModal}
              className="px-5 py-2.5 rounded-full bg-[#00FF85] hover:bg-[#00e677] text-[#040B0A] text-sm font-bold transition"
            >
              + New Conversation
            </button>
          </div>
        )}
      </main>

      {/* 3. RIGHT INFO PANEL */}
      {activeChat && showRightPanel && (
        <>
          <div
            onClick={() => setShowRightPanel(false)}
            className="fixed inset-0 bg-black/60 z-30 xl:hidden"
          />
          <aside className={`fixed xl:static inset-y-0 right-0 z-40 w-[290px] bg-[#07110E] border-l border-white/10 flex flex-col overflow-y-auto shrink-0 shadow-2xl xl:shadow-none ${slimScrollbar}`}>
            <div className="h-[60px] px-4 border-b border-white/10 flex items-center justify-between shrink-0">
              <span className="text-sm font-semibold text-gray-200">
                {activeChat.isGroup ? 'Group info' : 'Contact info'}
              </span>
              <button
                onClick={() => setShowRightPanel(false)}
                className="p-1.5 rounded-full text-gray-400 hover:bg-white/10 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Profile Summary */}
            <div className="px-6 py-6 flex flex-col items-center text-center border-b border-white/10">
              {activeChat.isGroup ? (
                <div className="w-20 h-20 rounded-full bg-[#00FF85]/15 border border-[#00FF85]/30 flex items-center justify-center text-[#00FF85] mb-3">
                  <Users size={32} />
                </div>
              ) : getChatAvatar(activeChat) ? (
                <img src={getChatAvatar(activeChat)!} alt="" className="w-20 h-20 rounded-full object-cover mb-3" />
              ) : (
                <div className="w-20 h-20 rounded-full bg-[#0F2E22] border border-[#00FF85]/30 text-[#00FF85] flex items-center justify-center text-2xl font-bold mb-3">
                  {getChatName(activeChat).charAt(0).toUpperCase()}
                </div>
              )}
              <h3 className="text-base font-bold text-white">{getChatName(activeChat)}</h3>
              <p className="text-xs text-[#00FF85]/80 mt-0.5">
                {activeChat.isGroup ? `${activeChat.participants.length} members` : 'Online'}
              </p>

              <div className="grid grid-cols-4 gap-2 w-full mt-5">
                {[
                  { icon: UserPlus, label: 'Add' },
                  { icon: Phone, label: 'Call' },
                  { icon: Video, label: 'Video' },
                  { icon: MoreVertical, label: 'More' },
                ].map((item) => (
                  <button
                    key={item.label}
                    className="flex flex-col items-center justify-center gap-1 py-2 rounded-xl bg-[#0C1B17] hover:bg-[#00FF85]/10 hover:text-[#00FF85] transition text-gray-300"
                  >
                    <item.icon size={16} />
                    <span className="text-[10px] text-gray-400">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Info Links */}
            <div className="p-3 space-y-1 border-b border-white/10">
              {[
                { icon: ImageIcon, label: 'Media, files & links', count: '0' },
                { icon: Pin, label: 'Pinned messages', count: '0' },
                { icon: FileText, label: 'Shared documents', count: '0' },
                { icon: Settings, label: activeChat.isGroup ? 'Group settings' : 'Chat settings', count: '' },
              ].map((row) => (
                <button
                  key={row.label}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-white/5 transition text-sm text-gray-300"
                >
                  <div className="flex items-center gap-3">
                    <row.icon size={16} className="text-[#00FF85]/80" />
                    <span>{row.label}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    {row.count && <span>{row.count}</span>}
                    <ChevronRight size={15} />
                  </div>
                </button>
              ))}
            </div>

            {/* Members List */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Members ({activeChat.participants.length})
                </span>
                <Search size={14} className="text-gray-500" />
              </div>

              <div className="space-y-3">
                {activeChat.participants.map((uid) => {
                  const detail = activeChat.participantDetails?.[uid];
                  const isYou = uid === currentUser?.uid;
                  const isAdmin = uid === activeChat.createdBy;
                  return (
                    <div key={uid} className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-[#0F2E22] text-[#00FF85] flex items-center justify-center text-xs font-bold shrink-0">
                          {(detail?.displayName || 'U').charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm text-gray-200 truncate">
                          {detail?.displayName || 'User'} {isYou && '(You)'}
                        </span>
                      </div>
                      <span className={`text-[11px] ${isAdmin ? 'text-[#00FF85] font-medium' : 'text-gray-500'}`}>
                        {isAdmin ? 'Admin' : 'Member'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>
        </>
      )}

      {/* NEW CHAT / GROUP MODAL (Exact Username Match Only) */}
      {showNewChatModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0A1512] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white">
                {isCreatingGroup ? 'Create New Group' : 'Start New Chat'}
              </h3>
              <button onClick={() => setShowNewChatModal(false)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="flex gap-2 mb-4">
              <button
                type="button"
                onClick={() => {
                  setIsCreatingGroup(false);
                  setMatchedUser(null);
                  setSearchError('');
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
                  !isCreatingGroup ? 'bg-[#00FF85] text-[#040B0A]' : 'bg-white/5 text-gray-400 hover:text-white'
                }`}
              >
                Direct Message
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsCreatingGroup(true);
                  setMatchedUser(null);
                  setSearchError('');
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
                  isCreatingGroup ? 'bg-[#00FF85] text-[#040B0A]' : 'bg-white/5 text-gray-400 hover:text-white'
                }`}
              >
                Create Group
              </button>
            </div>

            {isCreatingGroup && (
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Group Name (e.g., Team NEXORA)"
                className="w-full mb-3 bg-[#050C0A] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00FF85]"
              />
            )}

            <form onSubmit={handleSearchUser} className="flex gap-2 mb-4">
              <input
                type="text"
                value={usernameQuery}
                onChange={(e) => setUsernameQuery(e.target.value)}
                placeholder="Enter exact username or email..."
                className="flex-1 bg-[#050C0A] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00FF85]"
              />
              <button
                type="submit"
                disabled={isSearching || !usernameQuery.trim()}
                className="px-4 py-2.5 rounded-xl bg-[#00FF85] hover:bg-[#00e677] disabled:opacity-40 text-[#040B0A] text-xs font-bold transition shrink-0"
              >
                {isSearching ? '...' : 'Find'}
              </button>
            </form>

            {searchError && (
              <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2 mb-4">
                {searchError}
              </p>
            )}

            {matchedUser && (
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#0E241C] border border-[#00FF85]/35 mb-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-[#0F2E22] border border-[#00FF85]/30 text-[#00FF85] flex items-center justify-center font-bold text-sm shrink-0">
                    {matchedUser.displayName?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">
                      {matchedUser.displayName || 'Sutra User'}
                    </p>
                    <p className="text-xs text-gray-400 truncate">{matchedUser.email}</p>
                  </div>
                </div>

                {!isCreatingGroup ? (
                  <button
                    type="button"
                    onClick={() => startDirectChat(matchedUser)}
                    className="px-3.5 py-1.5 rounded-lg bg-[#00FF85] hover:bg-[#00e677] text-[#040B0A] text-xs font-bold transition shrink-0"
                  >
                    Message
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      if (!selectedUsers.some((s) => s.uid === matchedUser.uid)) {
                        setSelectedUsers((prev) => [...prev, matchedUser]);
                      }
                      setMatchedUser(null);
                      setUsernameQuery('');
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-[#00FF85] hover:bg-[#00e677] text-[#040B0A] text-xs font-bold transition shrink-0"
                  >
                    + Add
                  </button>
                )}
              </div>
            )}

            {isCreatingGroup && selectedUsers.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedUsers.map((u) => (
                  <span
                    key={u.uid}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00FF85]/15 border border-[#00FF85]/30 text-xs text-[#00FF85]"
                  >
                    {u.displayName || u.email}
                    <button
                      type="button"
                      onClick={() => setSelectedUsers((prev) => prev.filter((item) => item.uid !== u.uid))}
                      className="hover:text-white"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {isCreatingGroup && (
              <button
                type="button"
                onClick={createGroupChat}
                disabled={!groupName.trim() || selectedUsers.length === 0}
                className="w-full py-2.5 rounded-xl bg-[#00FF85] hover:bg-[#00e677] disabled:opacity-40 text-[#040B0A] text-sm font-bold transition"
              >
                Create Group ({selectedUsers.length} selected)
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}