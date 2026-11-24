import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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
  increment,
  getDoc,
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import type { AppUser, ChatRoom, Message } from '../../types/chat';
import ChatListSidebar from '../../components/chat/ChatListSidebar';
import ChatWindow from '../../components/chat/ChatWindow';
import ChatInfoPanel from '../../components/chat/ChatInfoPanel';
import NewChatModal from '../../components/chat/NewChatModal';

export default function ChatsPage({ defaultFilter = 'All' }: { defaultFilter?: 'All' | 'Groups' }) {
  const { user: currentUser } = useAuth();
  const location = useLocation();

  const [chats, setChats] = useState<ChatRoom[]>([]);
  const [activeChat, setActiveChat] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [showRightPanel, setShowRightPanel] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 1280 : false
  );

  const markChatAsRead = async (chatId: string) => {
    if (!currentUser) return;
    try {
      await updateDoc(doc(db, 'chats', chatId), {
        [`unreadCounts.${currentUser.uid}`]: 0,
      });
    } catch (err) {
      console.error('Failed to mark read:', err);
    }
  };

  // Real-time Chats Listener
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

      chatList.sort((a, b) => (b.updatedAt?.seconds || 0) - (a.updatedAt?.seconds || 0));
      setChats(chatList);

      // Handle navigation state from Overview / Contacts
      const stateChatId = (location.state as any)?.openChatId;
      if (stateChatId) {
        const found = chatList.find((c) => c.id === stateChatId);
        if (found) setActiveChat(found);
      }
    });

    return () => unsub();
  }, [currentUser, location.state]);

  // Real-time Messages Listener
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
    });

    return () => unsub();
  }, [activeChat?.id, currentUser?.uid]);

  const handleStartDirectChat = async (targetUser: AppUser) => {
    if (!currentUser) return;

    const existing = chats.find((c) => !c.isGroup && c.participants.includes(targetUser.uid));
    if (existing) {
      setActiveChat(existing);
      setShowNewChatModal(false);
      return;
    }

    const mySnap = await getDoc(doc(db, 'users', currentUser.uid));
    const myUsername = mySnap.exists() ? mySnap.data().username : '';

    const newChatRef = await addDoc(collection(db, 'chats'), {
      isGroup: false,
      participants: [currentUser.uid, targetUser.uid],
      participantDetails: {
        [currentUser.uid]: {
          displayName: currentUser.displayName || 'Sutra User',
          username: myUsername || '',
          photoURL: currentUser.photoURL || '',
          email: currentUser.email || '',
        },
        [targetUser.uid]: {
          displayName: targetUser.displayName || 'Sutra User',
          username: targetUser.username || '',
          photoURL: targetUser.photoURL || '',
          email: targetUser.email || '',
        },
      },
      lastMessage: 'Started a conversation',
      lastSenderId: currentUser.uid,
      unreadCounts: { [currentUser.uid]: 0, [targetUser.uid]: 0 },
      updatedAt: serverTimestamp(),
      createdBy: currentUser.uid,
    });

    setActiveChat({
      id: newChatRef.id,
      isGroup: false,
      participants: [currentUser.uid, targetUser.uid],
      participantDetails: {
        [currentUser.uid]: { displayName: currentUser.displayName || 'You', username: myUsername },
        [targetUser.uid]: { displayName: targetUser.displayName, username: targetUser.username },
      },
    });
    setShowNewChatModal(false);
  };

  const handleCreateGroup = async (groupName: string, selectedUsers: AppUser[]) => {
    if (!currentUser || !groupName.trim() || selectedUsers.length === 0) return;

    const mySnap = await getDoc(doc(db, 'users', currentUser.uid));
    const myUsername = mySnap.exists() ? mySnap.data().username : '';

    const participantIds = [currentUser.uid, ...selectedUsers.map((u) => u.uid)];
    const participantDetails: Record<string, any> = {
      [currentUser.uid]: {
        displayName: currentUser.displayName || 'You',
        username: myUsername || '',
        photoURL: currentUser.photoURL || '',
        email: currentUser.email || '',
      },
    };
    const unreadCounts: Record<string, number> = { [currentUser.uid]: 0 };

    selectedUsers.forEach((u) => {
      participantDetails[u.uid] = {
        displayName: u.displayName || 'User',
        username: u.username || '',
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

  const handleSendMessage = async (textToSend: string) => {
    if (!activeChat || !currentUser) return;

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

  return (
    <div className="h-full w-full bg-[#040B0A] text-gray-100 flex overflow-hidden font-sans relative">
      <ChatListSidebar
        chats={chats}
        activeChat={activeChat}
        currentUserId={currentUser?.uid}
        defaultFilter={defaultFilter}
        onSelectChat={(chat) => {
          setActiveChat(chat);
          markChatAsRead(chat.id);
        }}
        onOpenNewChat={() => setShowNewChatModal(true)}
      />

      <ChatWindow
        activeChat={activeChat}
        messages={messages}
        currentUserId={currentUser?.uid}
        showRightPanel={showRightPanel}
        onToggleRightPanel={() => setShowRightPanel((prev) => !prev)}
        onBack={() => setActiveChat(null)}
        onSendMessage={handleSendMessage}
        onOpenNewChat={() => setShowNewChatModal(true)}
      />

      {activeChat && showRightPanel && (
        <ChatInfoPanel
          activeChat={activeChat}
          currentUserId={currentUser?.uid}
          onClose={() => setShowRightPanel(false)}
        />
      )}

      <NewChatModal
        isOpen={showNewChatModal}
        currentUserId={currentUser?.uid}
        initialGroupMode={defaultFilter === 'Groups'}
        onClose={() => setShowNewChatModal(false)}
        onStartDirectChat={handleStartDirectChat}
        onCreateGroup={handleCreateGroup}
      />
    </div>
  );
}