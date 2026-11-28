import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { Search, X, Users, Check, Phone, AtSign, AlertCircle } from 'lucide-react';
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
  const [allUsers, setAllUsers] = useState<AppUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isGroupMode, setIsGroupMode] = useState(initialGroupMode);
  const [groupName, setGroupName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    setIsGroupMode(initialGroupMode);
  }, [initialGroupMode]);

  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
      setGroupName('');
      setSelectedUsers([]);
      setErrorMsg('');
      return;
    }

    setLoading(true);
    getDocs(collection(db, 'users'))
      .then((snap) => {
        const list: AppUser[] = snap.docs
          .map((d) => ({ uid: d.id, ...d.data() } as AppUser))
          .filter((u) => u.uid !== currentUserId);
        setAllUsers(list);
      })
      .finally(() => setLoading(false));
  }, [isOpen, currentUserId]);

  if (!isOpen) return null;

  const trimmed = searchQuery.trim().toLowerCase();
  const cleanHandle = trimmed.replace(/^@/, '');
  const rawDigits = trimmed.replace(/\D/g, '');
  const last10Digits = rawDigits.length >= 10 ? rawDigits.slice(-10) : rawDigits;

  const isPhoneSearch = rawDigits.length >= 5 && /^[+\d\s()-]+$/.test(trimmed);

  const filteredUsers = allUsers.filter((u) => {
    if (!trimmed) return true;

    const nameMatch = (u.displayName || '').toLowerCase().includes(trimmed);
    const usernameMatch = (u.username || '').toLowerCase().includes(cleanHandle);

    const userPhoneDigits = (
      u.phoneDigits ||
      (u.phoneNumber ? u.phoneNumber.replace(/\D/g, '') : '')
    );

    const phoneMatch =
      last10Digits.length >= 4 &&
      userPhoneDigits.length > 0 &&
      (userPhoneDigits.includes(last10Digits) ||
        (last10Digits.length === 10 && userPhoneDigits.endsWith(last10Digits)));

    return nameMatch || usernameMatch || phoneMatch;
  });

  const handleFindSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!trimmed) {
      setErrorMsg('Please enter a @username, name, or mobile number.');
      return;
    }

    if (filteredUsers.length === 0) {
      setErrorMsg(
        isPhoneSearch
          ? `No user found with phone number ${searchQuery.trim()}`
          : `No user found with @${cleanHandle}`
      );
      return;
    }

    // Direct mode mein agar exact 1 match mila hai toh seedha chat khol do
    if (!isGroupMode && filteredUsers.length === 1) {
      onStartDirectChat(filteredUsers[0]);
    }
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

        {/* Group Name Input */}
        {isGroupMode && (
          <div className="px-5 pt-3">
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter group name..."
              className="w-full bg-[#0C1B17] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00FF85]"
            />
          </div>
        )}

        {/* Search Input + Find Button */}
        <form onSubmit={handleFindSubmit} className="px-5 pt-3 pb-2">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              {isPhoneSearch ? (
                <Phone
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#00FF85]"
                />
              ) : (
                <Search
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#00FF85]"
                />
              )}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="Enter @username, name, or phone..."
                autoFocus
                className="w-full bg-[#0C1B17] border border-white/10 rounded-xl pl-10 pr-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00FF85]"
              />
            </div>

            {!isGroupMode && (
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-[#00FF85] hover:bg-[#00e677] text-[#040B0A] text-sm font-bold transition shrink-0"
              >
                Find
              </button>
            )}
          </div>

          {errorMsg && (
            <div className="mt-2.5 flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-red-500/12 border border-red-500/25 text-xs text-red-400">
              <AlertCircle size={14} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </form>

        {/* User Results List */}
        <div className={`flex-1 overflow-y-auto px-3 pb-3 space-y-1 ${slimScrollbar}`}>
          {loading ? (
            <p className="text-center text-xs text-gray-500 py-8">Loading users...</p>
          ) : filteredUsers.length === 0 ? (
            <p className="text-center text-xs text-gray-500 py-6">
              {trimmed
                ? `No registered user found for "${searchQuery.trim()}".`
                : 'No other users available yet.'}
            </p>
          ) : (
            filteredUsers.map((u) => {
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
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-gray-400">
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