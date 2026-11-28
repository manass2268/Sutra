import { useState, useEffect, useMemo, useRef } from 'react';
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
  setDoc,
  updateDoc,
  increment,
  getDoc,
  writeBatch,
  arrayUnion,
  arrayRemove,
  deleteField,
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useUsersPresence } from '../../hooks/useUserPresence';
import { useBrowserAlerts } from '../../hooks/useBrowserAlerts';
import type { AppUser, ChatRoom, Message, ReplyPreview } from '../../types/chat';
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
  const [myReadReceipts, setMyReadReceipts] = useState(true);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [showRightPanel, setShowRightPanel] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 1280 : false
  );

  const prevUnreadTotalRef = useRef<number | null>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeChat = chats.find((c) => c.id === activeChatId) || null;

  // Listen to current user's Read Receipts privacy preference
  useEffect(() => {
    if (!currentUser) return;
    const unsub = onSnapshot(doc(db, 'users', currentUser.uid), (snap) => {
      if (snap.exists() && typeof snap.data().readReceipts === 'boolean') {
        setMyReadReceipts(snap.data().readReceipts);
      } else {
        setMyReadReceipts(true);
      }
    });
    return () => unsub();
  }, [currentUser]);

  // Total unread count across all chats (for Chrome Tab Badge)
  const totalUnreadMessages = useMemo(() => {
    if (!currentUser) return 0;
    return chats.reduce((sum, chat) => {
      if (chat.id === activeChatId && document.visibilityState === 'visible') return sum;
      return sum + (chat.unreadCounts?.[currentUser.uid] || 0);
    }, 0);
  }, [chats, currentUser, activeChatId]);

  const { permission, requestPermission, triggerIncomingAlert } =
    useBrowserAlerts(totalUnreadMessages);

  const { allOtherUserIds, fallbackTimestamps } = useMemo(() => {
    const ids = new Set<string>();
    const fallbacks: Record<string, any> = {};

    chats.forEach((c) => {
      c.participants.forEach((uid) => {
        if (uid !== currentUser?.uid) {
          ids.add(uid);
          if (!c.isGroup && c.updatedAt) {
            if (!fallbacks[uid] || c.lastSenderId === uid) {
              fallbacks[uid] = c.updatedAt;
            }
          }
        }
      });
    });

    return {
      allOtherUserIds: Array.from(ids),
      fallbackTimestamps: fallbacks,
    };
  }, [chats, currentUser?.uid]);

  const presenceMap = useUsersPresence(allOtherUserIds, fallbackTimestamps);

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

  // Real-time Chats Listener + Chrome Desktop Notification Trigger
  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', currentUser.uid)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      let latestIncomingChat: ChatRoom | null = null;
      let latestIncomingTime = 0;

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

        const chatObj: ChatRoom = { id: docSnap.id, ...data };

        // Detect newest incoming message for notification
        const updatedSec = data.updatedAt?.seconds || 0;
        if (
          data.lastSenderId &&
          data.lastSenderId !== currentUser.uid &&
          updatedSec > latestIncomingTime
        ) {
          latestIncomingTime = updatedSec;
          latestIncomingChat = chatObj;
        }

        return chatObj;
      });

      chatList.sort((a, b) => (b.updatedAt?.seconds || 0) - (a.updatedAt?.seconds || 0));
      setChats(chatList);

      // Fire Chrome alert if unread count increased after initial load
      const currentUnreadSum = chatList.reduce(
        (acc, c) => acc + (c.unreadCounts?.[currentUser.uid] || 0),
        0
      );

      if (
        prevUnreadTotalRef.current !== null &&
        currentUnreadSum > prevUnreadTotalRef.current &&
        latestIncomingChat
      ) {
        const targetChat = latestIncomingChat as ChatRoom;
        const senderDetail = targetChat.lastSenderId
          ? targetChat.participantDetails?.[targetChat.lastSenderId]
          : undefined;
        const title = targetChat.isGroup
          ? `${targetChat.name || 'Group'} • ${senderDetail?.displayName || 'Member'}`
          : senderDetail?.displayName || 'New Message';

        triggerIncomingAlert(title, targetChat.lastMessage || 'Sent a message', () => {
          setActiveChatId(targetChat.id);
        });
      }
      prevUnreadTotalRef.current = currentUnreadSum;

      const stateChatId = (location.state as any)?.openChatId;
      if (stateChatId && chatList.some((c) => c.id === stateChatId)) {
        setActiveChatId(stateChatId);
      }
    });

    return () => unsub();
  }, [currentUser, location.state, triggerIncomingAlert]);

  // Real-time Messages Listener (Respects Read Receipts Privacy Setting)
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

      const unreadDocs = snapshot.docs.filter((docSnap) => {
        const m = docSnap.data() as Message;
        return m.senderId !== currentUser.uid && m.status !== 'read';
      });

      if (unreadDocs.length > 0 && document.visibilityState === 'visible') {
        if (myReadReceipts) {
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
          // Clear local unread badge without sending blue ticks
          markChatAsRead(activeChatId);
        }
      } else if (document.visibilityState === 'visible') {
        markChatAsRead(activeChatId);
      }
    });

    return () => unsub();
  }, [activeChatId, currentUser?.uid, myReadReceipts]);

  // Real-time Typing Status Handler
  const handleTypingActivity = (isTyping: boolean) => {
    if (!activeChatId || !currentUser) return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    updateDoc(doc(db, 'chats', activeChatId), {
      [`typingUsers.${currentUser.uid}`]: isTyping,
    }).catch(() => {});

    if (isTyping) {
      typingTimeoutRef.current = setTimeout(() => {
        updateDoc(doc(db, 'chats', activeChatId), {
          [`typingUsers.${currentUser.uid}`]: false,
        }).catch(() => {});
      }, 2500);
    }
  };

  const handleStartDirectChat = async (targetUser: AppUser) => {
    if (!currentUser) return;

    // Automatically add user to savedContacts so they appear in My Contacts
    await setDoc(
      doc(db, 'users', currentUser.uid),
      {
        savedContacts: arrayUnion(targetUser.uid),
        removedContacts: arrayRemove(targetUser.uid),
      },
      { merge: true }
    ).catch(() => {});

    const existing = chats.find((c) => !c.isGroup && c.participants.includes(targetUser.uid));
    if (existing) {
      setActiveChatId(existing.id);
      setShowNewChatModal(false);
      return;
    }

    const mySnap = await getDoc(doc(db, 'users', currentUser.uid));
    const myData = mySnap.exists() ? mySnap.data() : {};
    const myUsername = myData.username || '';
    const myPhotoURL = myData.photoURL || currentUser.photoURL || '';
    const myDisplayName = myData.displayName || currentUser.displayName || 'Sutra User';

    const newChatRef = await addDoc(collection(db, 'chats'), {
      isGroup: false,
      participants: [currentUser.uid, targetUser.uid],
      participantDetails: {
        [currentUser.uid]: {
          displayName: myDisplayName,
          username: myUsername,
          photoURL: myPhotoURL,
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
      lastMessageDeleted: false,
      unreadCounts: { [currentUser.uid]: 0, [targetUser.uid]: 0 },
      typingUsers: {},
      updatedAt: serverTimestamp(),
      createdBy: currentUser.uid,
    });

    setActiveChatId(newChatRef.id);
    setShowNewChatModal(false);
  };

  const handleCreateGroup = async (groupName: string, selectedUsers: AppUser[]) => {
    if (!currentUser || !groupName.trim() || selectedUsers.length === 0) return;

    const mySnap = await getDoc(doc(db, 'users', currentUser.uid));
    const myData = mySnap.exists() ? mySnap.data() : {};
    const myUsername = myData.username || '';
    const myPhotoURL = myData.photoURL || currentUser.photoURL || '';
    const myDisplayName = myData.displayName || currentUser.displayName || 'You';

    const participantIds = [currentUser.uid, ...selectedUsers.map((u) => u.uid)];
    const participantDetails: Record<string, any> = {
      [currentUser.uid]: {
        displayName: myDisplayName,
        username: myUsername,
        photoURL: myPhotoURL,
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
      lastMessage: `${myDisplayName} created group`,
      lastSenderId: currentUser.uid,
      lastMessageStatus: 'sent',
      lastMessageDeleted: false,
      unreadCounts,
      typingUsers: {},
      updatedAt: serverTimestamp(),
      createdBy: currentUser.uid,
    });

    setActiveChatId(newGroupRef.id);
    setShowNewChatModal(false);
  };

  // Send Message (with optional Quote Reply)
  const handleSendMessage = async (textToSend: string, replyTo?: ReplyPreview | null) => {
    if (!activeChatId || !activeChat || !currentUser) return;

    handleTypingActivity(false);

    await addDoc(collection(db, 'chats', activeChatId, 'messages'), {
      text: textToSend,
      senderId: currentUser.uid,
      senderName: currentUser.displayName || 'User',
      senderPhoto: currentUser.photoURL || '',
      status: 'sent',
      isDeleted: false,
      deletedFor: [],
      reactions: {},
      replyTo: replyTo || null,
      createdAt: serverTimestamp(),
    });

    const updatePayload: Record<string, any> = {
      lastMessage: textToSend,
      lastSenderId: currentUser.uid,
      lastMessageStatus: 'sent',
      lastMessageDeleted: false,
      [`typingUsers.${currentUser.uid}`]: false,
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

  // Instagram / WhatsApp Style Toggle Reaction
  const handleToggleReaction = async (messageId: string, emoji: string) => {
    if (!activeChatId || !currentUser) return;
    const targetMsg = messages.find((m) => m.id === messageId);
    const currentEmoji = targetMsg?.reactions?.[currentUser.uid];

    try {
      await updateDoc(doc(db, 'chats', activeChatId, 'messages', messageId), {
        [`reactions.${currentUser.uid}`]: currentEmoji === emoji ? deleteField() : emoji,
      });
    } catch (err) {
      console.error('Failed to react:', err);
    }
  };

  const handleDeleteForMe = async (messageId: string) => {
    if (!activeChatId || !currentUser) return;
    try {
      await updateDoc(doc(db, 'chats', activeChatId, 'messages', messageId), {
        deletedFor: arrayUnion(currentUser.uid),
      });
    } catch (err) {
      console.error('Failed to delete message for me:', err);
    }
  };

  const handleDeleteForEveryone = async (messageId: string) => {
    if (!activeChatId || !currentUser) return;
    try {
      await updateDoc(doc(db, 'chats', activeChatId, 'messages', messageId), {
        isDeleted: true,
        text: 'This message was deleted',
        reactions: {},
        replyTo: null,
      });

      const isLastMsg = messages[messages.length - 1]?.id === messageId;
      if (isLastMsg) {
        await updateDoc(doc(db, 'chats', activeChatId), {
          lastMessage: 'This message was deleted',
          lastMessageDeleted: true,
        });
      }
    } catch (err) {
      console.error('Failed to delete message for everyone:', err);
    }
  };

  const visibleMessages = useMemo(() => {
    if (!currentUser) return messages;
    return messages.filter((m) => !m.deletedFor?.includes(currentUser.uid));
  }, [messages, currentUser]);

  return (
    <div className="h-full w-full bg-[#040B0A] text-gray-100 flex overflow-hidden font-sans relative">
      <ChatListSidebar
        chats={chats}
        activeChat={activeChat}
        currentUserId={currentUser?.uid}
        presenceMap={presenceMap}
        defaultFilter={defaultFilter}
        onSelectChat={(chat) => {
          setActiveChatId(chat.id);
          markChatAsRead(chat.id);
        }}
        onOpenNewChat={() => setShowNewChatModal(true)}
      />

      <ChatWindow
        activeChat={activeChat}
        messages={visibleMessages}
        currentUserId={currentUser?.uid}
        presenceMap={presenceMap}
        showRightPanel={showRightPanel}
        notificationPermission={permission}
        onRequestNotificationPermission={requestPermission}
        onToggleRightPanel={() => setShowRightPanel((prev) => !prev)}
        onBack={() => setActiveChatId(null)}
        onTyping={handleTypingActivity}
        onSendMessage={handleSendMessage}
        onToggleReaction={handleToggleReaction}
        onDeleteForMe={handleDeleteForMe}
        onDeleteForEveryone={handleDeleteForEveryone}
        onOpenNewChat={() => setShowNewChatModal(true)}
      />

      {activeChat && showRightPanel && (
        <ChatInfoPanel
          activeChat={activeChat}
          currentUserId={currentUser?.uid}
          presenceMap={presenceMap}
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