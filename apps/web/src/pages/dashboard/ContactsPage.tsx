import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
} from 'firebase/firestore';
import { Search, MessageSquare, Phone, AtSign, Users } from 'lucide-react';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { type AppUser, slimScrollbar } from '../../types/chat';

export default function ContactsPage() {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState<AppUser[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [openingUid, setOpeningUid] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser) return;
    getDocs(collection(db, 'users'))
      .then((snap) => {
        const list = snap.docs
          .map((d) => ({ uid: d.id, ...d.data() } as AppUser))
          .filter((u) => u.uid !== currentUser.uid);
        setUsers(list);
      })
      .finally(() => setLoading(false));
  }, [currentUser]);

  const handleOpenChatWithUser = async (targetUser: AppUser) => {
    if (!currentUser || openingUid) return;
    setOpeningUid(targetUser.uid);

    try {
      const chatsSnap = await getDocs(
        query(collection(db, 'chats'), where('participants', 'array-contains', currentUser.uid))
      );

      const existingDirect = chatsSnap.docs.find((d) => {
        const data = d.data();
        return !data.isGroup && Array.isArray(data.participants) && data.participants.includes(targetUser.uid);
      });

      if (existingDirect) {
        navigate('/dashboard', { state: { openChatId: existingDirect.id } });
        return;
      }

      const mySnap = await getDoc(doc(db, 'users', currentUser.uid));
      const myData = mySnap.exists() ? mySnap.data() : {};

      const newChatRef = await addDoc(collection(db, 'chats'), {
        isGroup: false,
        participants: [currentUser.uid, targetUser.uid],
        participantDetails: {
          [currentUser.uid]: {
            displayName: myData.displayName || currentUser.displayName || 'Sutra User',
            username: myData.username || '',
            photoURL: myData.photoURL || currentUser.photoURL || '',
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

      navigate('/dashboard', { state: { openChatId: newChatRef.id } });
    } finally {
      setOpeningUid(null);
    }
  };

  const trimmed = search.trim().toLowerCase();
  const cleanHandle = trimmed.replace(/^@/, '');
  const cleanDigits = trimmed.replace(/\D/g, '');

  const filteredUsers = users.filter((u) => {
    if (!trimmed) return true;
    const nameMatch = (u.displayName || '').toLowerCase().includes(trimmed);
    const usernameMatch = (u.username || '').toLowerCase().includes(cleanHandle);
    const phoneMatch =
      cleanDigits.length >= 4 &&
      ((u.phoneDigits && u.phoneDigits.includes(cleanDigits)) ||
        (u.phoneNumber && u.phoneNumber.replace(/\D/g, '').includes(cleanDigits)));
    return nameMatch || usernameMatch || Boolean(phoneMatch);
  });

  return (
    <div className={`h-full overflow-y-auto p-4 sm:p-6 md:p-8 bg-[#040B0A] ${slimScrollbar}`}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <Users size={20} className="text-[#00FF85]" />
              People & Contacts
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Find friends on SUTRAA by name, @username, or phone number.
            </p>
          </div>

          <div className="relative w-full sm:w-80">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, @username, or phone..."
              className="w-full bg-[#07110E] border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00FF85]"
            />
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-gray-500 text-center py-12">Loading contacts...</p>
        ) : filteredUsers.length === 0 ? (
          <div className="p-10 rounded-2xl bg-[#07110E] border border-white/10 text-center">
            <p className="text-sm text-gray-400">No contacts matched "{search}".</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredUsers.map((u) => (
              <div
                key={u.uid}
                className="p-4 rounded-2xl bg-[#07110E] border border-white/10 hover:border-[#00FF85]/30 flex items-center justify-between gap-3 transition"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {u.photoURL ? (
                    <img
                      src={u.photoURL}
                      alt={u.displayName}
                      className="w-12 h-12 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-[#0F2E22] text-[#00FF85] flex items-center justify-center font-bold text-base shrink-0">
                      {(u.displayName || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-white truncate">
                      {u.displayName || 'Sutra User'}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-xs mt-0.5">
                      {u.username && (
                        <span className="inline-flex items-center gap-0.5 text-[#00FF85]">
                          <AtSign size={11} />
                          {u.username}
                        </span>
                      )}
                      {u.phoneNumber && (
                        <span className="inline-flex items-center gap-1 text-gray-400">
                          <Phone size={11} />
                          {u.phoneNumber}
                        </span>
                      )}
                    </div>
                    {u.bio && (
                      <p className="text-[11px] text-gray-500 truncate mt-1">{u.bio}</p>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenChatWithUser(u)}
                  disabled={openingUid === u.uid}
                  className="px-3.5 py-2 rounded-xl bg-[#00FF85] hover:bg-[#00e677] disabled:opacity-50 text-[#040B0A] text-xs font-bold inline-flex items-center gap-1.5 shrink-0 transition"
                >
                  <MessageSquare size={14} />
                  <span>{openingUid === u.uid ? 'Opening...' : 'Message'}</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}