import { useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { X, AtSign } from 'lucide-react';
import { db } from '../../lib/firebase';
import type { AppUser } from '../../types/chat';

interface NewChatModalProps {
  isOpen: boolean;
  currentUserId?: string;
  initialGroupMode?: boolean;
  onClose: () => void;
  onStartDirectChat: (targetUser: AppUser) => Promise<void>;
  onCreateGroup: (groupName: string, members: AppUser[]) => Promise<void>;
}

export default function NewChatModal({
  isOpen,
  currentUserId,
  initialGroupMode = false,
  onClose,
  onStartDirectChat,
  onCreateGroup,
}: NewChatModalProps) {
  const [usernameQuery, setUsernameQuery] = useState('');
  const [matchedUser, setMatchedUser] = useState<AppUser | null>(null);
  const [searchError, setSearchError] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isCreatingGroup, setIsCreatingGroup] = useState(initialGroupMode);
  const [groupName, setGroupName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<AppUser[]>([]);

  if (!isOpen) return null;

  const handleSearchUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const raw = usernameQuery.trim();
    if (!raw || !currentUserId) return;

    const cleanUsername = raw.replace(/^@/, '').toLowerCase();

    setIsSearching(true);
    setSearchError('');
    setMatchedUser(null);

    try {
      const usersRef = collection(db, 'users');

      // 1. Exact lowercase @username match
      let snap = await getDocs(query(usersRef, where('username', '==', cleanUsername)));

      // 2. Fallback: exact email match
      if (snap.empty) {
        snap = await getDocs(query(usersRef, where('email', '==', raw.toLowerCase())));
      }

      if (snap.empty) {
        setSearchError(`No user found with @${cleanUsername}`);
      } else {
        const found = snap.docs[0].data() as AppUser;
        if (found.uid === currentUserId) {
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

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0A1512] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-white">
            {isCreatingGroup ? 'Create New Group' : 'Start New Chat'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Mode Switch */}
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

        {/* Exact @username Search */}
        <form onSubmit={handleSearchUser} className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <AtSign size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#00FF85]" />
            <input
              type="text"
              value={usernameQuery}
              onChange={(e) => setUsernameQuery(e.target.value)}
              placeholder="Enter exact username..."
              className="w-full bg-[#050C0A] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00FF85]"
            />
          </div>
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
                <p className="text-xs text-[#00FF85]/80 truncate">
                  {matchedUser.username ? `@${matchedUser.username}` : matchedUser.email}
                </p>
              </div>
            </div>

            {!isCreatingGroup ? (
              <button
                type="button"
                onClick={() => onStartDirectChat(matchedUser)}
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
                {u.username ? `@${u.username}` : u.displayName}
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
            onClick={() => onCreateGroup(groupName, selectedUsers)}
            disabled={!groupName.trim() || selectedUsers.length === 0}
            className="w-full py-2.5 rounded-xl bg-[#00FF85] hover:bg-[#00e677] disabled:opacity-40 text-[#040B0A] text-sm font-bold transition"
          >
            Create Group ({selectedUsers.length} selected)
          </button>
        )}
      </div>
    </div>
  );
}