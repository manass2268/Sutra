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
  writeBatch,
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
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [showRightPanel, setShowRightPanel] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 1280 : false
  );

  // Live activeChat object so tick status updates in real time
  const activeChat = chats.find((c) => c.id === activeChatId) || null;

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

  // 1. Real-time Chats Listener + Auto Mark 'delivered' when receiver comes online
  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', currentUser.uid)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const chatList: ChatRoom[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data() as Omit<ChatRoom, 'id'>;

        
        if (
          data.lastSenderId &&
          data.lastSenderId !== currentUser.uid &&
          data.lastMessageStatus === 'sent'
        ) {
          updateDoc(doc(db, 'chats', docSnap.id), {
            lastMessageStatus: 'delivered',
          }).catch(() => {});
        }

        return {
          id: docSnap.id,
          ...data,
        };
      });

      chatList.sort((a, b) => (b.updatedAt?.seconds || 0) - (a.updatedAt?.seconds || 0));
      setChats(chatList);

      const stateChatId = (location.state as any)?.openChatId;
      if (stateChatId && chatList.some((c) => c.id === stateChatId)) {
        setActiveChatId(stateChatId);
      }
    });

    return () => unsub();
  }, [currentUser, location.state]);

  // 2. Real-time Messages Listener + Auto Mark 'read' (Double Blue Tick) when chat is open
  useEffect(() => {
    if (!activeChatId || !currentUser) {
      setMessages([]);
      return;
    }

    const q = query(
      collection(db, 'chats', activeChatId, 'messages'),
      orderBy('createdAt', 'asc')
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const msgList: Message[] = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as Message[];
      setMessages(msgList);

      // Samne wale ke unread messages ko 'read' mark karo
      const unreadDocs = snapshot.docs.filter((docSnap) => {
        const m = docSnap.data() as Message;
        return m.senderId !== currentUser.uid && m.status !== 'read';
      });

      if (unreadDocs.length > 0) {
        const batch = writeBatch(db);
        unreadDocs.forEach((docSnap) => {
          batch.update(docSnap.ref, { status: 'read' });
        });
        batch.update(doc(db, 'chats', activeChatId), {
          lastMessageStatus: 'read',
          [`unreadCounts.${currentUser.uid}`]: 0,
        });
        batch.commit().catch(() => {});
      } else {
        markChatAsRead(activeChatId);
      }
    });

    return () => unsub();
  }, [activeChatId, currentUser?.uid]);

  // Start 1-on-1 Chat
  const handleStartDirectChat = async (targetUser: AppUser) => {
    if (!currentUser) return;

    const existing = chats.find((c) => !c.isGroup && c.participants.includes(targetUser.uid));
    if (existing) {
      setActiveChatId(existing.id);
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
      lastMessageStatus: 'sent',
      unreadCounts: { [currentUser.uid]: 0, [targetUser.uid]: 0 },
      updatedAt: serverTimestamp(),
      createdBy: currentUser.uid,
    });

    setActiveChatId(newChatRef.id);
    setShowNewChatModal(false);
  };

  // Create Group Chat
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
      lastMessageStatus: 'sent',
      unreadCounts,
      updatedAt: serverTimestamp(),
      createdBy: currentUser.uid,
    });

    setActiveChatId(newGroupRef.id);
    setShowNewChatModal(false);
  };

  // Send Message with initial 'sent' status (Single Tick)
  const handleSendMessage = async (textToSend: string) => {
    if (!activeChatId || !activeChat || !currentUser) return;

    await addDoc(collection(db, 'chats', activeChatId, 'messages'), {
      text: textToSend,
      senderId: currentUser.uid,
      senderName: currentUser.displayName || 'User',
      senderPhoto: currentUser.photoURL || '',
      status: 'sent',
      createdAt: serverTimestamp(),
    });

    const updatePayload: Record<string, any> = {
      lastMessage: textToSend,
      lastSenderId: currentUser.uid,
      lastMessageStatus: 'sent',
      updatedAt: serverTimestamp(),
      [`unreadCounts.${currentUser.uid}`]: 0,
    };

    activeChat.participants.forEach((uid) => {
      if (uid !== currentUser.uid) {
        updatePayload[`unreadCounts.${uid}`] = increment(1);
      }
    });

    await updateDoc(doc(db, 'chats', activeChatId), updatePayload);
  };

  return (
    <div className="h-full w-full bg-[#040B0A] text-gray-100 flex overflow-hidden font-sans relative">
      <ChatListSidebar
        chats={chats}
        activeChat={activeChat}
        currentUserId={currentUser?.uid}
        defaultFilter={defaultFilter}
        onSelectChat={(chat) => {
          setActiveChatId(chat.id);
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
        onBack={() => setActiveChatId(null)}
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