import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { AtSign, CheckCircle2, AlertCircle } from 'lucide-react';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { slimScrollbar } from '../../types/chat';

export default function SettingsPage() {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [status, setStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    setDisplayName(user.displayName || '');
    getDoc(doc(db, 'users', user.uid)).then((snap) => {
      if (snap.exists()) {
        setUsername(snap.data().username || '');
      }
    });
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const cleanUsername = username.trim().replace(/^@/, '').toLowerCase();
    if (!/^[a-z0-9._]{3,20}$/.test(cleanUsername)) {
      setStatus({
        type: 'error',
        msg: 'Username must be 3-20 characters (only lowercase letters, numbers, dot, underscore).',
      });
      return;
    }

    setSaving(true);
    setStatus(null);

    try {
      // Check uniqueness in Firestore
      const existingSnap = await getDocs(
        query(collection(db, 'users'), where('username', '==', cleanUsername))
      );

      const takenBySomeoneElse = existingSnap.docs.some((d) => d.id !== user.uid);
      if (takenBySomeoneElse) {
        setStatus({ type: 'error', msg: `@${cleanUsername} is already taken. Try another one.` });
        setSaving(false);
        return;
      }

      if (displayName.trim()) {
        await updateProfile(user, { displayName: displayName.trim() });
      }

      await updateDoc(doc(db, 'users', user.uid), {
        displayName: displayName.trim() || user.displayName || 'Sutra User',
        username: cleanUsername,
      });

      setUsername(cleanUsername);
      setStatus({ type: 'success', msg: `Profile updated! Your unique handle is @${cleanUsername}` });
    } catch {
      setStatus({ type: 'error', msg: 'Failed to update profile. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`h-full overflow-y-auto p-6 md:p-8 bg-[#040B0A] ${slimScrollbar}`}>
      <div className="max-w-xl mx-auto p-6 rounded-2xl bg-[#07110E] border border-white/10">
        <h1 className="text-xl font-bold text-white mb-1">Profile & Username Settings</h1>
        <p className="text-xs text-gray-400 mb-6">
          Share your unique @username so friends can find and message you privately.
        </p>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-1.5">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full bg-[#0C1B17] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00FF85]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-1.5">
              Unique @username
            </label>
            <div className="relative">
              <AtSign size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#00FF85]" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase())}
                placeholder="your_username"
                className="w-full bg-[#0C1B17] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00FF85]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-1.5">
              Email (Read-only)
            </label>
            <input
              type="text"
              value={user?.email || ''}
              disabled
              className="w-full bg-[#050C0A] border border-white/5 rounded-xl px-4 py-2.5 text-sm text-gray-500 cursor-not-allowed"
            />
          </div>

          {status && (
            <div
              className={`flex items-center gap-2 p-3 rounded-xl text-xs ${
                status.type === 'success'
                  ? 'bg-[#00FF85]/10 text-[#00FF85] border border-[#00FF85]/25'
                  : 'bg-red-500/10 text-red-400 border border-red-500/25'
              }`}
            >
              {status.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              <span>{status.msg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full py-2.5 rounded-xl bg-[#00FF85] hover:bg-[#00e677] disabled:opacity-40 text-[#040B0A] text-sm font-bold transition"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}