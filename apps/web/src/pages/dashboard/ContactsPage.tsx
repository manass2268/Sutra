import { useState, useEffect, useCallback } from 'react';
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
  setDoc,
  onSnapshot,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import {
  Search,
  MessageSquare,
  Phone,
  AtSign,
  Users,
  UserPlus,
  UserMinus,
  X,
  Mail,
  AlertCircle,
  Loader2,
  Check,
} from 'lucide-react';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { type AppUser, slimScrollbar } from '../../types/chat';

export default function ContactsPage() {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  const [savedUids, setSavedUids] = useState<string[]>([]);
  const [removedUids, setRemovedUids] = useState<string[]>([]);
  const [chatPartnerUids, setChatPartnerUids] = useState<string[]>([]);

  const [contacts, setContacts] = useState<AppUser[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [openingUid, setOpeningUid] = useState<string | null>(null);

  // Add Contact Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [addQuery, setAddQuery] = useState('');
  const [addResults, setAddResults] = useState<AppUser[]>([]);
  const [addSearching, setAddSearching] = useState(false);
  const [addError, setAddError] = useState('');
  const [addingUid, setAddingUid] = useState<string | null>(null);

  // 1. Listen to current user's saved & removed contacts list
  useEffect(() => {
    if (!currentUser) return;
    const unsub = onSnapshot(doc(db, 'users', currentUser.uid), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setSavedUids(Array.isArray(data.savedContacts) ? data.savedContacts : []);
        setRemovedUids(Array.isArray(data.removedContacts) ? data.removedContacts : []);
      } else {
        setSavedUids([]);
        setRemovedUids([]);
      }
    });
    return () => unsub();
  }, [currentUser]);

  // 2. Listen to existing direct chat partners so previously added chats also appear
  useEffect(() => {
    if (!currentUser) return;
    const q = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', currentUser.uid)
    );
    const unsub = onSnapshot(q, (snap) => {
      const uids = new Set<string>();
      snap.docs.forEach((d) => {
        const data = d.data();
        if (!data.isGroup && Array.isArray(data.participants)) {
          data.participants.forEach((uid: string) => {
            if (uid !== currentUser.uid) uids.add(uid);
          });
        }
      });
      setChatPartnerUids(Array.from(uids));
    });
    return () => unsub();
  }, [currentUser]);

  // 3. Fetch profile details ONLY for the user's added contacts
  useEffect(() => {
    if (!currentUser) return;

    const removedSet = new Set(removedUids);
    const targetUids = Array.from(new Set([...savedUids, ...chatPartnerUids])).filter(
      (uid) => uid !== currentUser.uid && !removedSet.has(uid)
    );

    if (targetUids.length === 0) {
      setContacts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    Promise.all(
      targetUids.map(async (uid) => {
        const snap = await getDoc(doc(db, 'users', uid));
        if (!snap.exists()) return null;
        return { uid: snap.id, ...snap.data() } as AppUser;
      })
    )
      .then((list) => {
        setContacts(list.filter((item): item is AppUser => item !== null));
      })
      .finally(() => setLoading(false));
  }, [currentUser, savedUids, chatPartnerUids, removedUids]);

  // Exact search inside "Add Contact" modal (no full directory load)
  const searchUserToAdd = useCallback(
    async (rawInput: string, explicitSubmit = false) => {
      const trimmed = rawInput.trim();
      if (!trimmed) {
        setAddResults([]);
        setAddError('');
        return;
      }

      const lower = trimmed.toLowerCase();
      const cleanHandle = lower.replace(/^@/, '');
      const rawDigits = trimmed.replace(/\D/g, '');
      const last10Digits = rawDigits.length >= 10 ? rawDigits.slice(-10) : '';

      const isEmailSearch = lower.includes('@') && !trimmed.startsWith('@');
      const isPhoneSearch = last10Digits.length === 10 && /^[+\d\s()-]+$/.test(trimmed);

      setAddSearching(true);
      if (explicitSubmit) setAddError('');

      try {
        const usersRef = collection(db, 'users');
        const queries = [];

        if (isEmailSearch) {
          queries.push(getDocs(query(usersRef, where('email', '==', lower))));
          if (trimmed !== lower) {
            queries.push(getDocs(query(usersRef, where('email', '==', trimmed))));
          }
        } else if (isPhoneSearch) {
          queries.push(getDocs(query(usersRef, where('phoneDigits', '==', last10Digits))));
          queries.push(getDocs(query(usersRef, where('phoneNumber', '==', `+91${last10Digits}`))));
          queries.push(getDocs(query(usersRef, where('phoneNumber', '==', trimmed))));
        } else {
          queries.push(getDocs(query(usersRef, where('username', '==', cleanHandle))));
        }

        const snapshots = await Promise.all(queries);
        const matchedMap = new Map<string, AppUser>();

        snapshots.forEach((snap) => {
          snap.docs.forEach((docSnap) => {
            matchedMap.set(docSnap.id, {
              uid: docSnap.id,
              ...docSnap.data(),
            } as AppUser);
          });
        });

        const allMatched = Array.from(matchedMap.values());
        const isOnlySelf =
          allMatched.length > 0 && allMatched.every((u) => u.uid === currentUser?.uid);
        const filtered = allMatched.filter((u) => u.uid !== currentUser?.uid);

        setAddResults(filtered);

        if (explicitSubmit) {
          if (isOnlySelf) {
            setAddError('This is your own account.');
          } else if (filtered.length === 0) {
            setAddError('No user found with this @username, email, or phone number.');
          }
        }
      } catch (err) {
        console.error('Add contact search failed:', err);
        if (explicitSubmit) setAddError('Search failed. Please try again.');
      } finally {
        setAddSearching(false);
      }
    },
    [currentUser?.uid]
  );

  useEffect(() => {
    if (!showAddModal) {
      setAddQuery('');
      setAddResults([]);
      setAddError('');
      return;
    }

    const trimmed = addQuery.trim();
    if (!trimmed) {
      setAddResults([]);
      setAddError('');
      return;
    }

    const timer = setTimeout(() => {
      searchUserToAdd(trimmed, false);
    }, 400);

    return () => clearTimeout(timer);
  }, [addQuery, showAddModal, searchUserToAdd]);

  const handleSaveContact = async (targetUser: AppUser) => {
    if (!currentUser || addingUid) return;
    setAddingUid(targetUser.uid);
    try {
      await setDoc(
        doc(db, 'users', currentUser.uid),
        {
          savedContacts: arrayUnion(targetUser.uid),
          removedContacts: arrayRemove(targetUser.uid),
        },
        { merge: true }
      );
      setShowAddModal(false);
    } finally {
      setAddingUid(null);
    }
  };

  const handleRemoveContact = async (targetUid: string) => {
    if (!currentUser) return;
    await setDoc(
      doc(db, 'users', currentUser.uid),
      {
        savedContacts: arrayRemove(targetUid),
        removedContacts: arrayUnion(targetUid),
      },
      { merge: true }
    );
  };

  const handleOpenChatWithUser = async (targetUser: AppUser) => {
    if (!currentUser || openingUid) return;
    setOpeningUid(targetUser.uid);

    try {
      // Ensure user stays in savedContacts
      await setDoc(
        doc(db, 'users', currentUser.uid),
        {
          savedContacts: arrayUnion(targetUser.uid),
          removedContacts: arrayRemove(targetUser.uid),
        },
        { merge: true }
      );

      const chatsSnap = await getDocs(
        query(collection(db, 'chats'), where('participants', 'array-contains', currentUser.uid))
      );

      const existingDirect = chatsSnap.docs.find((d) => {
        const data = d.data();
        return (
          !data.isGroup &&
          Array.isArray(data.participants) &&
          data.participants.includes(targetUser.uid)
        );
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

  // Filter ONLY within your saved contacts
  const trimmed = search.trim().toLowerCase();
  const cleanHandle = trimmed.replace(/^@/, '');
  const cleanDigits = trimmed.replace(/\D/g, '');

  const filteredContacts = contacts.filter((u) => {
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
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <Users size={20} className="text-[#00FF85]" />
              My Contacts ({contacts.length})
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Only people you have added appear here.
            </p>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {contacts.length > 0 && (
              <div className="relative flex-1 sm:w-64">
                <Search
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Filter my contacts..."
                  className="w-full bg-[#07110E] border border-white/10 rounded-full pl-9 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00FF85]"
                />
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 rounded-full bg-[#00FF85] hover:bg-[#00e677] text-[#040B0A] text-xs font-bold inline-flex items-center gap-1.5 shrink-0 transition shadow-md shadow-[#00FF85]/15"
            >
              <UserPlus size={15} />
              <span>Add Contact</span>
            </button>
          </div>
        </div>

        {/* Saved Contacts Grid */}
        {loading ? (
          <p className="text-sm text-gray-500 text-center py-12">Loading your contacts...</p>
        ) : contacts.length === 0 ? (
          <div className="p-12 rounded-2xl bg-[#07110E] border border-white/10 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#00FF85]/10 border border-[#00FF85]/20 flex items-center justify-center mx-auto text-[#00FF85]">
              <UserPlus size={22} />
            </div>
            <h3 className="text-base font-bold text-white">No contacts added yet</h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              Search and add friends using their exact @username, email, or phone number.
            </p>
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="px-5 py-2.5 rounded-full bg-[#00FF85] hover:bg-[#00e677] text-[#040B0A] text-xs font-bold inline-flex items-center gap-1.5 transition"
              >
                <UserPlus size={15} />
                <span>Add Your First Contact</span>
              </button>
            </div>
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="p-10 rounded-2xl bg-[#07110E] border border-white/10 text-center">
            <p className="text-sm text-gray-400">No saved contacts matched "{search}".</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredContacts.map((u) => (
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
                    {u.bio && <p className="text-[11px] text-gray-500 truncate mt-1">{u.bio}</p>}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleOpenChatWithUser(u)}
                    disabled={openingUid === u.uid}
                    className="px-3.5 py-2 rounded-xl bg-[#00FF85] hover:bg-[#00e677] disabled:opacity-50 text-[#040B0A] text-xs font-bold inline-flex items-center gap-1.5 transition"
                  >
                    <MessageSquare size={14} />
                    <span>{openingUid === u.uid ? 'Opening...' : 'Message'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRemoveContact(u.uid)}
                    title="Remove from Contacts"
                    className="p-2 rounded-xl bg-[#0C1B17] hover:bg-red-500/15 text-gray-400 hover:text-red-400 border border-white/5 transition"
                  >
                    <UserMinus size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ADD CONTACT MODAL (Exact Search Only) */}
      {showAddModal && (
        <div
          onClick={() => setShowAddModal(false)}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-[#07110E] border border-white/15 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-base font-bold text-white">Add New Contact</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-full text-gray-400 hover:bg-white/10 hover:text-white transition"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                searchUserToAdd(addQuery, true);
              }}
              className="p-5 space-y-3"
            >
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#00FF85]"
                  />
                  <input
                    type="text"
                    value={addQuery}
                    onChange={(e) => {
                      setAddQuery(e.target.value);
                      if (addError) setAddError('');
                    }}
                    placeholder="Enter exact @username, email, or phone..."
                    autoFocus
                    className="w-full bg-[#0C1B17] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00FF85]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={addSearching}
                  className="px-4 py-2.5 rounded-xl bg-[#00FF85] hover:bg-[#00e677] disabled:opacity-50 text-[#040B0A] text-sm font-bold transition shrink-0"
                >
                  {addSearching ? <Loader2 size={15} className="animate-spin" /> : 'Find'}
                </button>
              </div>

              {addError && (
                <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-red-500/12 border border-red-500/25 text-xs text-red-400">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{addError}</span>
                </div>
              )}

              <div className="pt-1 space-y-2 max-h-64 overflow-y-auto">
                {!addQuery.trim() ? (
                  <p className="text-center text-xs text-gray-500 py-6">
                    Type an exact @username, email, or 10-digit phone number to add them.
                  </p>
                ) : addSearching ? (
                  <p className="text-center text-xs text-gray-500 py-6">Searching...</p>
                ) : (
                  addResults.map((u) => {
                    const alreadyAdded = contacts.some((c) => c.uid === u.uid);
                    return (
                      <div
                        key={u.uid}
                        className="flex items-center justify-between p-3 rounded-xl bg-[#0C1B17] border border-white/10"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {u.photoURL ? (
                            <img
                              src={u.photoURL}
                              alt={u.displayName}
                              className="w-10 h-10 rounded-full object-cover shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-[#0F2E22] text-[#00FF85] flex items-center justify-center font-bold text-sm shrink-0">
                              {(u.displayName || 'U').charAt(0).toUpperCase()}
                            </div>
                          )}

                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-white truncate">
                              {u.displayName || 'Sutra User'}
                            </p>
                            <div className="flex flex-wrap items-center gap-x-2 text-xs text-gray-400">
                              {u.username && (
                                <span className="inline-flex items-center gap-0.5 text-[#00FF85]">
                                  <AtSign size={11} />
                                  {u.username}
                                </span>
                              )}
                              {u.phoneNumber && (
                                <span className="inline-flex items-center gap-1">
                                  <Phone size={10} />
                                  {u.phoneNumber}
                                </span>
                              )}
                              {!u.username && !u.phoneNumber && u.email && (
                                <span className="inline-flex items-center gap-1">
                                  <Mail size={10} />
                                  {u.email}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {alreadyAdded ? (
                          <span className="px-3 py-1.5 rounded-xl bg-[#00FF85]/15 text-[#00FF85] text-xs font-semibold inline-flex items-center gap-1 shrink-0">
                            <Check size={13} /> Added
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSaveContact(u)}
                            disabled={addingUid === u.uid}
                            className="px-3.5 py-2 rounded-xl bg-[#00FF85] hover:bg-[#00e677] text-[#040B0A] text-xs font-bold inline-flex items-center gap-1 shrink-0 transition"
                          >
                            <UserPlus size={13} />
                            <span>{addingUid === u.uid ? 'Adding...' : 'Add'}</span>
                          </button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}