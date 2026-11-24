import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
} from 'firebase/firestore';
import { AtSign, MessageSquare, UserCheck } from 'lucide-react';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { type AppUser, type ChatRoom, slimScrollbar } from '../../types/chat';

export default function ContactsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [chats, setChats] = useState<ChatRoom[]>([]);
  const [usernameInput, setUsernameInput] = useState('');
  const [foundUser, setFoundUser] = useState<AppUser | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'chats'), where('participants', 'array-contains', user.uid));
    return onSnapshot(q, (snap) => {
      setChats(snap.docs.map((d) => ({ id: d.id, ...d.data() })) as ChatRoom[]);
    });
  }, [user]);

  const handleFindByUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = usernameInput.trim().replace(/^@/, '').toLowerCase();
    if (!clean || !user) return;

    setLoading(true);
    setError('');
    setFoundUser(null);

    try {
      const snap = await getDocs(query(collection(db, 'users'), where('username', '==', clean)));
      if (snap.empty) {
        setError(`No user found with @${clean}`);
      } else {
        const data = snap.docs[0].data() as AppUser;
        if (data.uid === user.uid) {
          setError('This is your own username.');
        } else {
          setFoundUser(data);
        }
      }
    } catch {
      setError('Search failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const openChatWithUser = async (target: AppUser) => {
    if (!user) return;
    const existing = chats.find((c) => !c.isGroup && c.participants.includes(target.uid));
    if (existing) {
      navigate('/dashboard/chats', { state: { openChatId: existing.id } });
      return;
    }

    const mySnap = await getDoc(doc(db, 'users', user.uid));
    const myUsername = mySnap.exists() ? mySnap.data().username : '';

    const ref = await addDoc(collection(db, 'chats'), {
      isGroup: false,
      participants: [user.uid, target.uid],
      participantDetails: {
        [user.uid]: {
          displayName: user.displayName || 'Sutra User',
          username: myUsername || '',
          email: user.email || '',
        },
        [target.uid]: {
          displayName: target.displayName || 'Sutra User',
          username: target.username || '',
          email: target.email || '',
        },
      },
      lastMessage: 'Started a conversation',
      lastSenderId: user.uid,
      unreadCounts: { [user.uid]: 0, [target.uid]: 0 },
      updatedAt: serverTimestamp(),
      createdBy: user.uid,
    });

    navigate('/dashboard/chats', { state: { openChatId: ref.id } });
  };

  // Extract connected direct contacts
  const connectedContacts = chats
    .filter((c) => !c.isGroup)
    .map((c) => {
      const otherUid = c.participants.find((id) => id !== user?.uid) || '';
      const details = c.participantDetails?.[otherUid];
      return {
        chatId: c.id,
        uid: otherUid,
        displayName: details?.displayName || 'User',
        username: details?.username || '',
        email: details?.email || '',
      };
    });

  return (
    <div className={`h-full overflow-y-auto p-6 md:p-8 bg-[#040B0A] ${slimScrollbar}`}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Search by @username */}
        <div className="p-6 rounded-2xl bg-[#07110E] border border-white/10">
          <h1 className="text-xl font-bold text-white mb-1">Find Contact by @username</h1>
          <p className="text-xs text-gray-400 mb-4">
            Privacy protected: enter exact username to connect and start chatting.
          </p>

          <form onSubmit={handleFindByUsername} className="flex gap-2">
            <div className="relative flex-1">
              <AtSign size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#00FF85]" />
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="e.g. sanskarsingh"
                className="w-full bg-[#0C1B17] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00FF85]"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !usernameInput.trim()}
              className="px-5 py-2.5 rounded-xl bg-[#00FF85] hover:bg-[#00e677] disabled:opacity-40 text-[#040B0A] text-sm font-bold transition"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>

          {error && <p className="text-xs text-red-400 mt-3">{error}</p>}

          {foundUser && (
            <div className="mt-4 p-4 rounded-xl bg-[#0E241C] border border-[#00FF85]/35 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-white">{foundUser.displayName}</p>
                <p className="text-xs text-[#00FF85]">@{foundUser.username}</p>
              </div>
              <button
                onClick={() => openChatWithUser(foundUser)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#00FF85] text-[#040B0A] text-xs font-bold"
              >
                <MessageSquare size={14} /> Message
              </button>
            </div>
          )}
        </div>

        {/* Connected Contacts List */}
        <div className="p-6 rounded-2xl bg-[#07110E] border border-white/10">
          <div className="flex items-center gap-2 mb-4">
            <UserCheck size={18} className="text-[#00FF85]" />
            <h2 className="text-base font-bold text-white">Your Contacts ({connectedContacts.length})</h2>
          </div>

          {connectedContacts.length === 0 ? (
            <p className="text-sm text-gray-500 py-6 text-center">
              No contacts added yet. Search a @username above to connect!
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {connectedContacts.map((contact) => (
                <div
                  key={contact.uid}
                  className="p-4 rounded-xl bg-[#0C1B17] border border-white/5 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-[#0F2E22] text-[#00FF85] flex items-center justify-center font-bold shrink-0">
                      {contact.displayName.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{contact.displayName}</p>
                      <p className="text-xs text-[#00FF85]/80 truncate">
                        {contact.username ? `@${contact.username}` : contact.email}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('/dashboard/chats', { state: { openChatId: contact.chatId } })}
                    className="p-2 rounded-lg bg-[#00FF85]/15 text-[#00FF85] hover:bg-[#00FF85] hover:text-[#040B0A] transition"
                  >
                    <MessageSquare size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}