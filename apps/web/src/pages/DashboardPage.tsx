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
  photoURL?: string;
}

interface ChatRoom {
  id: string;
  name?: string;
  isGroup: boolean;
  participants: string[];
  participantDetails?: Record<string, { displayName: string; photoURL?: string; email?: string }>;
  lastMessage?: string;
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

  // New Chat / Group Modal State
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [allUsers, setAllUsers] = useState<AppUser[]>([]);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<AppUser[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

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

  // 3. Real-time Messages Listener
  useEffect(() => {
    if (!activeChat) {
      setMessages([]);
      return;
    }

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
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    });

    return () => unsub();
  }, [activeChat?.id]);

  // Fetch registered users for Modal
  const openNewChatModal = async () => {
    setShowNewChatModal(true);
    setSelectedUsers([]);
    setGroupName('');
    setIsCreatingGroup(false);

    const snap = await getDocs(collection(db, 'users'));
    const usersList = snap.docs
      .map((d) => d.data() as AppUser)
      .filter((u) => u.uid !== currentUser?.uid);
    setAllUsers(usersList);
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
    selectedUsers.forEach((u) => {
      participantDetails[u.uid] = {
        displayName: u.displayName || 'User',
        photoURL: u.photoURL || '',
        email: u.email || '',
      };
    });

    const newGroupRef = await addDoc(collection(db, 'chats'), {
      name: groupName.trim(),
      isGroup: true,
      participants: participantIds,
      participantDetails,
      lastMessage: `${currentUser.displayName || 'Admin'} created group`,
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

  // Send Real-time Message
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

    await updateDoc(doc(db, 'chats', activeChat.id), {
      lastMessage: textToSend,
      updatedAt: serverTimestamp(),
    });
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
    return nameMatch;
  });

  return (
    <div className="h-full w-full bg-[#040B0A] text-gray-100 flex overflow-hidden font-sans relative">
      {/* 1. CHATS LIST SIDEBAR (Full width on mobile when no chat active, fixed width on md+) */}
      <section
        className={`w-full md:w-[320px] lg:w-[340px] bg-[#07110E] border-r border-white/10 flex-col shrink-0 ${
          activeChat ? 'hidden md:flex' : 'flex'
        }`}
      >
        {/* Header */}
        <div className="px-5 pt-5 pb-3 flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight text-white">Chats</h1>
          <div className="flex items-center gap-1.5">
            <button
              onClick={openNewChatModal}
              title="New Chat / Group"
              className="p-2 rounded-xl bg-white/5 hover:bg-[#00FF85]/15 hover:text-[#00FF85] text-gray-300 transition border border-white/5"
            >
              <Plus size={18} />
            </button>
            <button className="p-2 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition">
              <MoreVertical size={18} />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="px-4 pb-3">
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chats, groups..."
              className="w-full bg-[#0B1915] text-sm text-gray-200 placeholder-gray-500 pl-10 pr-4 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-[#00FF85]/50 transition"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="px-4 pb-3 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {(['All', 'Unread', 'Groups', 'Pinned'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition shrink-0 ${
                activeFilter === tab
                  ? 'bg-[#00FF85] text-[#040B0A] shadow-md shadow-[#00FF85]/20'
                  : 'bg-[#0B1915] text-gray-400 hover:text-white border border-white/5'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Chat Items */}
        <div className="flex-1 overflow-y-auto px-2.5 pb-4 space-y-1">
          {filteredChats.length === 0 ? (
            <div className="text-center py-14 px-4">
              <p className="text-sm text-gray-500 mb-4">No chats yet.</p>
              <button
                onClick={openNewChatModal}
                className="text-xs bg-[#00FF85] hover:bg-[#00e677] text-[#040B0A] px-4 py-2.5 rounded-xl font-bold transition shadow-lg shadow-[#00FF85]/15"
              >
                + Start a New Chat
              </button>
            </div>
          ) : (
            filteredChats.map((chat) => {
              const isSelected = activeChat?.id === chat.id;
              const name = getChatName(chat);
              const avatar = getChatAvatar(chat);

              return (
                <div
                  key={chat.id}
                  onClick={() => setActiveChat(chat)}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition ${
                    isSelected
                      ? 'bg-[#0E241C] border border-[#00FF85]/30'
                      : 'hover:bg-white/[0.04] border border-transparent'
                  }`}
                >
                  <div className="relative shrink-0">
                    {chat.isGroup ? (
                      <div className="w-11 h-11 rounded-full bg-[#00FF85]/15 border border-[#00FF85]/30 flex items-center justify-center text-[#00FF85]">
                        <Users size={20} />
                      </div>
                    ) : avatar ? (
                      <img src={avatar} alt={name} className="w-11 h-11 rounded-full object-cover border border-white/10" />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-[#0F2E22] border border-[#00FF85]/20 text-[#00FF85] flex items-center justify-center font-bold">
                        {name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#00FF85] border-2 border-[#07110E] rounded-full" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <h3 className="text-sm font-semibold text-white truncate">{name}</h3>
                      <span className="text-[11px] text-gray-500 shrink-0">{formatTime(chat.updatedAt)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-gray-400 truncate pr-2">{chat.lastMessage || 'Say hi!'}</p>
                      <CheckCheck size={14} className="text-[#00FF85] shrink-0" />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* 2. MAIN CHAT WINDOW */}
      <main
        className={`flex-1 flex-col bg-[#040B0A] relative min-w-0 ${
          activeChat ? 'flex' : 'hidden md:flex'
        }`}
      >
        {activeChat ? (
          <>
            {/* Chat Header */}
            <header className="h-[68px] px-4 sm:px-6 border-b border-white/10 bg-[#07110E]/90 backdrop-blur-md flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                {/* Mobile Back Button */}
                <button
                  onClick={() => setActiveChat(null)}
                  className="md:hidden p-2 -ml-1 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition"
                >
                  <ArrowLeft size={20} />
                </button>

                {activeChat.isGroup ? (
                  <div className="w-10 h-10 rounded-full bg-[#00FF85]/15 border border-[#00FF85]/30 flex items-center justify-center text-[#00FF85] shrink-0">
                    <Users size={18} />
                  </div>
                ) : getChatAvatar(activeChat) ? (
                  <img src={getChatAvatar(activeChat)!} alt="" className="w-10 h-10 rounded-full object-cover shrink-0" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#0F2E22] border border-[#00FF85]/20 text-[#00FF85] flex items-center justify-center font-bold shrink-0">
                    {getChatName(activeChat).charAt(0).toUpperCase()}
                  </div>
                )}

                <div className="min-w-0">
                  <h2 className="text-sm sm:text-base font-bold text-white leading-tight truncate">
                    {getChatName(activeChat)}
                  </h2>
                  <p className="text-xs text-[#00FF85]/80">
                    {activeChat.isGroup ? `${activeChat.participants.length} members` : 'Online'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 sm:gap-2 text-gray-400">
                <button className="hidden sm:flex p-2.5 rounded-xl hover:bg-white/5 hover:text-white transition">
                  <Video size={18} />
                </button>
                <button className="hidden sm:flex p-2.5 rounded-xl hover:bg-white/5 hover:text-white transition">
                  <Phone size={18} />
                </button>
                <button className="p-2.5 rounded-xl hover:bg-white/5 hover:text-white transition">
                  <Search size={18} />
                </button>
                <button
                  onClick={() => setShowRightPanel(!showRightPanel)}
                  title="Chat Info"
                  className={`p-2.5 rounded-xl transition ${
                    showRightPanel ? 'bg-[#00FF85]/15 text-[#00FF85]' : 'hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Info size={18} />
                </button>
              </div>
            </header>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-4">
              <div className="flex justify-center">
                <span className="px-3.5 py-1 rounded-full bg-[#0B1915] text-[11px] text-gray-400 border border-white/10">
                  Today
                </span>
              </div>

              {messages.map((msg) => {
                const isMe = msg.senderId === currentUser?.uid;
                return (
                  <div key={msg.id} className={`flex items-end gap-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}>
                    {!isMe && (
                      <div className="w-8 h-8 rounded-full bg-[#0F2E22] border border-[#00FF85]/20 text-[#00FF85] flex items-center justify-center text-xs font-bold shrink-0">
                        {msg.senderName?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    )}

                    <div
                      className={`max-w-[80%] sm:max-w-[68%] rounded-2xl px-4 py-2.5 shadow-md ${
                        isMe
                          ? 'bg-[#0E2E21] border border-[#00FF85]/35 text-white rounded-br-sm'
                          : 'bg-[#0B1613] border border-white/10 text-gray-100 rounded-bl-sm'
                      }`}
                    >
                      {!isMe && activeChat.isGroup && (
                        <p className="text-xs font-semibold text-[#00FF85] mb-1">{msg.senderName}</p>
                      )}
                      <p className="text-sm leading-relaxed break-words">{msg.text}</p>
                      <div className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${isMe ? 'text-[#00FF85]/70' : 'text-gray-500'}`}>
                        <span>{formatTime(msg.createdAt)}</span>
                        {isMe && <CheckCheck size={13} className="text-[#00FF85]" />}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input Bar */}
            <form onSubmit={handleSendMessage} className="p-3 sm:p-4 bg-[#07110E] border-t border-white/10">
              <div className="flex items-center gap-2 sm:gap-3 bg-[#0B1915] rounded-2xl px-3 sm:px-4 py-2 border border-white/10 focus-within:border-[#00FF85]/50 transition">
                <button type="button" className="text-gray-400 hover:text-[#00FF85] transition">
                  <Paperclip size={18} />
                </button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none py-1.5 min-w-0"
                />
                <button type="button" className="hidden sm:block text-gray-400 hover:text-[#00FF85] transition">
                  <Smile size={18} />
                </button>
                <button
                  type="submit"
                  className="w-9 h-9 rounded-xl bg-[#00FF85] hover:bg-[#00e677] text-[#040B0A] flex items-center justify-center transition shadow-lg shadow-[#00FF85]/20 shrink-0"
                >
                  <Send size={16} />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
            <div className="absolute w-72 h-72 bg-[#00FF85]/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="w-16 h-16 rounded-2xl bg-[#00FF85]/10 border border-[#00FF85]/25 flex items-center justify-center mb-4">
              <MessageSquare size={30} className="text-[#00FF85]" />
            </div>
            <h2 className="text-xl font-bold text-white mb-1.5">Welcome to Sutraa</h2>
            <p className="text-sm text-gray-400 max-w-sm mb-6">
              Select a conversation from the left or start a new real-time chat with your team.
            </p>
            <button
              onClick={openNewChatModal}
              className="px-5 py-2.5 rounded-xl bg-[#00FF85] hover:bg-[#00e677] text-[#040B0A] text-sm font-bold transition shadow-lg shadow-[#00FF85]/20"
            >
              + New Conversation
            </button>
          </div>
        )}
      </main>

      {/* 3. RIGHT INFO PANEL (Inline on xl+, slide-over drawer on smaller screens) */}
      {activeChat && showRightPanel && (
        <>
          {/* Backdrop for smaller screens */}
          <div
            onClick={() => setShowRightPanel(false)}
            className="fixed inset-0 bg-black/60 z-30 xl:hidden"
          />
          <aside className="fixed xl:static inset-y-0 right-0 z-40 w-[290px] bg-[#07110E] border-l border-white/10 flex flex-col overflow-y-auto shrink-0 shadow-2xl xl:shadow-none">
            {/* Close button on mobile/tablet */}
            <div className="flex justify-end p-3 xl:hidden">
              <button
                onClick={() => setShowRightPanel(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Profile Summary */}
            <div className="px-6 pb-6 xl:pt-6 flex flex-col items-center text-center border-b border-white/10">
              {activeChat.isGroup ? (
                <div className="w-18 h-18 p-5 rounded-full bg-[#00FF85]/15 border border-[#00FF85]/30 flex items-center justify-center text-[#00FF85] mb-3">
                  <Users size={30} />
                </div>
              ) : getChatAvatar(activeChat) ? (
                <img src={getChatAvatar(activeChat)!} alt="" className="w-20 h-20 rounded-full object-cover mb-3 border border-white/10" />
              ) : (
                <div className="w-20 h-20 rounded-full bg-[#0F2E22] border border-[#00FF85]/30 text-[#00FF85] flex items-center justify-center text-2xl font-bold mb-3">
                  {getChatName(activeChat).charAt(0).toUpperCase()}
                </div>
              )}
              <h3 className="text-base font-bold text-white">{getChatName(activeChat)}</h3>
              <p className="text-xs text-[#00FF85]/80 mt-0.5">
                {activeChat.isGroup ? `${activeChat.participants.length} members` : 'Active now'}
              </p>

              {/* Quick Actions */}
              <div className="grid grid-cols-4 gap-2 w-full mt-5">
                {[
                  { icon: UserPlus, label: 'Add' },
                  { icon: Phone, label: 'Call' },
                  { icon: Video, label: 'Video' },
                  { icon: MoreVertical, label: 'More' },
                ].map((item) => (
                  <button
                    key={item.label}
                    className="flex flex-col items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#0B1915] hover:bg-[#00FF85]/10 hover:text-[#00FF85] border border-white/5 transition text-gray-300"
                  >
                    <item.icon size={16} />
                    <span className="text-[10px] text-gray-400">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Info Links */}
            <div className="p-4 space-y-1 border-b border-white/10">
              {[
                { icon: ImageIcon, label: 'Media, files & links', count: '0' },
                { icon: Pin, label: 'Pinned messages', count: '0' },
                { icon: FileText, label: 'Shared documents', count: '0' },
                { icon: Settings, label: activeChat.isGroup ? 'Group settings' : 'Chat settings', count: '' },
              ].map((row) => (
                <button
                  key={row.label}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 transition text-sm text-gray-300"
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
                        <div className="w-8 h-8 rounded-full bg-[#0F2E22] border border-[#00FF85]/20 text-[#00FF85] flex items-center justify-center text-xs font-bold shrink-0">
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

      {/* NEW CHAT / GROUP MODAL */}
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
                onClick={() => setIsCreatingGroup(false)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
                  !isCreatingGroup ? 'bg-[#00FF85] text-[#040B0A]' : 'bg-white/5 text-gray-400 hover:text-white'
                }`}
              >
                Direct Message
              </button>
              <button
                onClick={() => setIsCreatingGroup(true)}
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
                className="w-full mb-4 bg-[#050C0A] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00FF85]"
              />
            )}

            <div className="max-h-60 overflow-y-auto space-y-2 mb-4">
              {allUsers.length === 0 ? (
                <p className="text-xs text-gray-500 text-center py-6">No other registered users found yet.</p>
              ) : (
                allUsers.map((u) => {
                  const isSelected = selectedUsers.some((s) => s.uid === u.uid);
                  return (
                    <div
                      key={u.uid}
                      onClick={() => {
                        if (!isCreatingGroup) {
                          startDirectChat(u);
                        } else {
                          setSelectedUsers((prev) =>
                            isSelected ? prev.filter((item) => item.uid !== u.uid) : [...prev, u]
                          );
                        }
                      }}
                      className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition ${
                        isSelected
                          ? 'bg-[#00FF85]/15 border border-[#00FF85]/40'
                          : 'bg-white/[0.03] hover:bg-white/[0.07] border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-full bg-[#0F2E22] border border-[#00FF85]/25 text-[#00FF85] flex items-center justify-center font-bold text-sm shrink-0">
                          {u.displayName?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-white truncate">{u.displayName || 'Sutra User'}</p>
                          <p className="text-xs text-gray-400 truncate">{u.email}</p>
                        </div>
                      </div>
                      {isCreatingGroup && (
                        <div
                          className={`w-5 h-5 rounded-full border shrink-0 ${
                            isSelected ? 'bg-[#00FF85] border-[#00FF85]' : 'border-gray-500'
                          }`}
                        />
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {isCreatingGroup && (
              <button
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