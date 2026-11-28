import { useState, useEffect, useCallback } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import {
  Search,
  X,
  Users,
  Check,
  Phone,
  AtSign,
  Mail,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { db } from '../../lib/firebase';
import { type AppUser, slimScrollbar } from '../../types/chat';

interface NewChatModalProps {
  isOpen: boolean;
  currentUserId?: string;
  initialGroupMode?: boolean;
  onClose: () => void;
  onStartDirectChat: (user: AppUser) => void;
  onCreateGroup: (groupName: string, selectedUsers: AppUser[]) => void;
}

export default function NewChatModal({
  isOpen,
  currentUserId,
  initialGroupMode = false,
  onClose,
  onStartDirectChat,
  onCreateGroup,
}: NewChatModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<AppUser[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [searching, setSearching] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [isGroupMode, setIsGroupMode] = useState(initialGroupMode);
  const [groupName, setGroupName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<AppUser[]>([]);

  useEffect(() => {
    setIsGroupMode(initialGroupMode);
  }, [initialGroupMode]);

  // Modal band hone par saara state reset karo (koi list pre-load nahi hogi)
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
      setResults([]);
      setHasSearched(false);
      setSearching(false);
      setErrorMsg('');
      setGroupName('');
      setSelectedUsers([]);
    }
  }, [isOpen]);

  // Exact search by @username, email, or phone number directly from Firestore
  const performSearch = useCallback(
    async (rawInput: string, isExplicitSubmit = false) => {
      const trimmed = rawInput.trim();
      if (!trimmed) {
        setResults([]);
        setHasSearched(false);
        setErrorMsg('');
        return;
      }

      const lower = trimmed.toLowerCase();
      const cleanHandle = lower.replace(/^@/, '');
      const rawDigits = trimmed.replace(/\D/g, '');
      const last10Digits = rawDigits.length >= 10 ? rawDigits.slice(-10) : '';

      const isEmailSearch = lower.includes('@') && !trimmed.startsWith('@');
      const isPhoneSearch = last10Digits.length === 10 && /^[+\d\s()-]+$/.test(trimmed);

      setSearching(true);
      if (isExplicitSubmit) setErrorMsg('');

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
          allMatched.length > 0 && allMatched.every((u) => u.uid === currentUserId);
        const filtered = allMatched.filter((u) => u.uid !== currentUserId);

        setResults(filtered);
        setHasSearched(true);

        if (isExplicitSubmit) {
          if (isOnlySelf) {
            setErrorMsg('This is your own account. Search another user.');
          } else if (filtered.length === 0) {
            setErrorMsg('No user found with this @username, email, or phone number.');
          }
        }
      } catch (err) {
        console.error('User search failed:', err);
        if (isExplicitSubmit) {
          setErrorMsg('Search failed. Please check your connection and try again.');
        }
      } finally {
        setSearching(false);
      }
    },
    [currentUserId]
  );

  // Live debounced search jab user type kare
  useEffect(() => {
    if (!isOpen) return;
    const trimmed = searchQuery.trim();

    if (!trimmed) {
      setResults([]);
      setHasSearched(false);
      setErrorMsg('');
      return;
    }

    const timer = setTimeout(() => {
      performSearch(trimmed, false);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery, isOpen, performSearch]);

  if (!isOpen) return null;

  const handleFindSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setErrorMsg('Please enter an exact @username, email, or 10-digit phone number.');
      return;
    }
    await performSearch(searchQuery, true);
  };

  const toggleUserSelection = (target: AppUser) => {
    setSelectedUsers((prev) =>
      prev.some((u) => u.uid === target.uid)
        ? prev.filter((u) => u.uid !== target.uid)
        : [...prev, target]
    );
  };

  const handleGroupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim() || selectedUsers.length === 0) return;
    onCreateGroup(groupName, selectedUsers);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-[#07110E] border border-white/15 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-base font-bold text-white">Start New Chat</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:bg-white/10 hover:text-white transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Mode Switcher */}
        <div className="px-5 pt-3 flex gap-2">
          <button
            type="button"
            onClick={() => {
              setIsGroupMode(false);
              setSelectedUsers([]);
              setErrorMsg('');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold transition ${
              !isGroupMode
                ? 'bg-[#00FF85] text-[#040B0A]'
                : 'bg-[#0C1B17] text-gray-400 hover:text-white'
            }`}
          >
            Direct Message
          </button>
          <button
            type="button"
            onClick={() => {
              setIsGroupMode(true);
              setErrorMsg('');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5 ${
              isGroupMode
                ? 'bg-[#00FF85] text-[#040B0A]'
                : 'bg-[#0C1B17] text-gray-400 hover:text-white'
            }`}
          >
            <Users size={14} /> Create Group
          </button>
        </div>

        {/* Group Name & Selected Members Chips */}
        {isGroupMode && (
          <div className="px-5 pt-3 space-y-2">
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter group name..."
              className="w-full bg-[#0C1B17] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00FF85]"
            />

            {selectedUsers.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {selectedUsers.map((sel) => (
                  <span
                    key={sel.uid}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#00FF85]/15 border border-[#00FF85]/30 text-xs text-[#00FF85]"
                  >
                    <span>{sel.displayName || sel.username}</span>
                    <button
                      type="button"
                      onClick={() => toggleUserSelection(sel)}
                      className="hover:text-white"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Exact Search Form (@username, Email, or Phone Number) */}
        <form onSubmit={handleFindSubmit} className="px-5 pt-3 pb-2">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#00FF85]"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="Enter @username, email, or phone..."
                autoFocus
                className="w-full bg-[#0C1B17] border border-white/10 rounded-xl pl-10 pr-8 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00FF85]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setResults([]);
                    setHasSearched(false);
                    setErrorMsg('');
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={searching}
              className="px-4 py-2.5 rounded-xl bg-[#00FF85] hover:bg-[#00e677] disabled:opacity-50 text-[#040B0A] text-sm font-bold transition shrink-0 inline-flex items-center gap-1.5"
            >
              {searching ? <Loader2 size={15} className="animate-spin" /> : 'Find'}
            </button>
          </div>

          {errorMsg && (
            <div className="mt-2.5 flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-red-500/12 border border-red-500/25 text-xs text-red-400">
              <AlertCircle size={14} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </form>

        {/* Search Results Area (No automatic full directory list) */}
        <div className={`flex-1 overflow-y-auto px-3 pb-4 space-y-1 ${slimScrollbar}`}>
          {!searchQuery.trim() ? (
            <div className="text-center py-10 px-4">
              <div className="w-10 h-10 rounded-full bg-[#0C1B17] border border-white/10 flex items-center justify-center mx-auto mb-2.5 text-[#00FF85]">
                <Search size={18} />
              </div>
              <p className="text-xs text-gray-400">
                Enter an exact <span className="text-[#00FF85]">@username</span>,{' '}
                <span className="text-gray-200">email</span>, or{' '}
                <span className="text-gray-200">phone number</span> to find someone.
              </p>
            </div>
          ) : searching ? (
            <p className="text-center text-xs text-gray-500 py-8">Searching...</p>
          ) : hasSearched && results.length === 0 ? (
            <p className="text-center text-xs text-gray-500 py-8">
              No matching user found for "{searchQuery.trim()}".
            </p>
          ) : (
            results.map((u) => {
              const isSelected = selectedUsers.some((sel) => sel.uid === u.uid);

              return (
                <div
                  key={u.uid}
                  onClick={() => (isGroupMode ? toggleUserSelection(u) : onStartDirectChat(u))}
                  className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition ${
                    isSelected
                      ? 'bg-[#00FF85]/15 border border-[#00FF85]/30'
                      : 'hover:bg-white/5 border border-transparent'
                  }`}
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
                      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-xs text-gray-400">
                        {u.username && (
                          <span className="inline-flex items-center gap-0.5 text-[#00FF85]">
                            <AtSign size={11} />
                            {u.username}
                          </span>
                        )}
                        {u.phoneNumber && (
                          <span className="inline-flex items-center gap-1 text-gray-400">
                            <Phone size={10} />
                            {u.phoneNumber}
                          </span>
                        )}
                        {!u.username && !u.phoneNumber && u.email && (
                          <span className="inline-flex items-center gap-1 text-gray-400">
                            <Mail size={10} />
                            {u.email}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {isGroupMode && (
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center border shrink-0 ${
                        isSelected
                          ? 'bg-[#00FF85] border-[#00FF85] text-[#040B0A]'
                          : 'border-white/25'
                      }`}
                    >
                      {isSelected && <Check size={12} />}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Group Submit Footer */}
        {isGroupMode && (
          <form onSubmit={handleGroupSubmit} className="p-4 border-t border-white/10">
            <button
              type="submit"
              disabled={!groupName.trim() || selectedUsers.length === 0}
              className="w-full py-2.5 rounded-xl bg-[#00FF85] hover:bg-[#00e677] disabled:opacity-40 text-[#040B0A] text-sm font-bold transition"
            >
              Create Group ({selectedUsers.length} selected)
            </button>
          </form>
        )}
      </div>
    </div>
  );
}