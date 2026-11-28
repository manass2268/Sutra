import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import { updateProfile, sendPasswordResetEmail, signOut } from 'firebase/auth';
import {
  AtSign,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Camera,
  Trash2,
  Shield,
  Bell,
  Volume2,
  Eye,
  CheckCheck,
  Copy,
  Check,
  KeyRound,
  LogOut,
  User,
} from 'lucide-react';
import { auth, db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { slimScrollbar } from '../../types/chat';

// Compress uploaded image to 200x200 JPEG Data URL so it stores cleanly in Firestore
function compressImageToDataUrl(file: File, maxSize = 200): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxSize) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          }
        } else if (height > maxSize) {
          width = Math.round((width * maxSize) / height);
          height = maxSize;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Canvas not supported'));

        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      };
      img.onerror = () => reject(new Error('Invalid image file'));
      img.src = event.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export default function SettingsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile fields
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('Hey there! I am using SUTRAA.');
  const [photoURL, setPhotoURL] = useState('');

  // Privacy toggles (synced with Firestore)
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [readReceipts, setReadReceipts] = useState(true);

  // App & Browser preferences (localStorage)
  const [soundEnabled, setSoundEnabled] = useState(() => {
    if (typeof window === 'undefined') return true;
    return localStorage.getItem('sutraa_sound_enabled') !== 'false';
  });
  const [notifPermission, setNotifPermission] = useState<NotificationPermission>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'denied';
  });

  // UI states
  const [copiedHandle, setCopiedHandle] = useState(false);
  const [saving, setSaving] = useState(false);
  const [resetSending, setResetSending] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  useEffect(() => {
    if (!user) return;
    setDisplayName(user.displayName || '');

    getDoc(doc(db, 'users', user.uid)).then((snap) => {
      if (snap.exists()) {
        const data = snap.data();
        if (data.displayName) setDisplayName(data.displayName);
        if (data.username) setUsername(data.username);
        if (typeof data.bio === 'string') setBio(data.bio);
        if (data.photoURL) setPhotoURL(data.photoURL);
        if (typeof data.showOnlineStatus === 'boolean') setShowOnlineStatus(data.showOnlineStatus);
        if (typeof data.readReceipts === 'boolean') setReadReceipts(data.readReceipts);
      }
    });
  }, [user]);

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setStatus({ type: 'error', msg: 'Please select a valid image file (JPG, PNG, WebP).' });
      return;
    }

    try {
      const compressed = await compressImageToDataUrl(file, 200);
      setPhotoURL(compressed);
      setStatus({ type: 'success', msg: 'Photo ready! Click "Save Profile" to apply.' });
    } catch {
      setStatus({ type: 'error', msg: 'Could not process image. Try a smaller photo.' });
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const cleanUsername = username.trim().replace(/^@/, '').toLowerCase();
    if (!/^[a-z0-9._]{3,20}$/.test(cleanUsername)) {
      setStatus({
        type: 'error',
        msg: 'Username must be 3-20 characters (lowercase letters, numbers, dot, underscore).',
      });
      return;
    }

    setSaving(true);
    setStatus(null);

    try {
      const existingSnap = await getDocs(
        query(collection(db, 'users'), where('username', '==', cleanUsername))
      );

      const takenBySomeoneElse = existingSnap.docs.some((d) => d.id !== user.uid);
      if (takenBySomeoneElse) {
        setStatus({ type: 'error', msg: `@${cleanUsername} is already taken. Try another one.` });
        setSaving(false);
        return;
      }

      const finalName = displayName.trim() || user.displayName || 'Sutra User';

      if (finalName !== user.displayName) {
        await updateProfile(user, { displayName: finalName });
      }

      await setDoc(
        doc(db, 'users', user.uid),
        {
          uid: user.uid,
          displayName: finalName,
          username: cleanUsername,
          bio: bio.trim(),
          photoURL: photoURL || '',
          email: user.email || '',
          showOnlineStatus,
          readReceipts,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      setUsername(cleanUsername);
      setStatus({ type: 'success', msg: 'Profile & settings saved successfully!' });
    } catch {
      setStatus({ type: 'error', msg: 'Failed to save changes. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePrivacy = async (
    field: 'showOnlineStatus' | 'readReceipts',
    nextVal: boolean
  ) => {
    if (!user) return;
    if (field === 'showOnlineStatus') setShowOnlineStatus(nextVal);
    if (field === 'readReceipts') setReadReceipts(nextVal);

    try {
      await setDoc(
        doc(db, 'users', user.uid),
        { [field]: nextVal },
        { merge: true }
      );
    } catch {
      setStatus({ type: 'error', msg: 'Could not update privacy setting.' });
    }
  };

  const handleToggleSound = (nextVal: boolean) => {
    setSoundEnabled(nextVal);
    localStorage.setItem('sutraa_sound_enabled', String(nextVal));
  };

  const handleEnableBrowserNotifications = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    const res = await Notification.requestPermission();
    setNotifPermission(res);
  };

  const handleCopyUsername = () => {
    if (!username) return;
    navigator.clipboard.writeText(`@${username}`);
    setCopiedHandle(true);
    setTimeout(() => setCopiedHandle(false), 2000);
  };

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    setResetSending(true);
    setStatus(null);
    try {
      await sendPasswordResetEmail(auth, user.email);
      setStatus({
        type: 'success',
        msg: `Password reset link sent to ${user.email}. Check your inbox.`,
      });
    } catch {
      setStatus({
        type: 'error',
        msg: 'Could not send reset email (if you signed in with Google, use Google Account settings).',
      });
    } finally {
      setResetSending(false);
    }
  };

  const handleLogout = async () => {
    if (user) {
      await setDoc(
        doc(db, 'users', user.uid),
        { isOnline: false, lastSeen: serverTimestamp() },
        { merge: true }
      ).catch(() => {});
    }
    await signOut(auth);
    navigate('/login');
  };

  return (
    <div className={`h-full overflow-y-auto p-4 sm:p-6 md:p-8 bg-[#040B0A] ${slimScrollbar}`}>
      <div className="max-w-3xl mx-auto space-y-6 pb-10">
        {/* Top Back Navigation */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-[#00FF85] transition"
          >
            <ArrowLeft size={15} /> Back to Chats
          </button>

          {username && (
            <button
              type="button"
              onClick={handleCopyUsername}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#07110E] border border-white/10 hover:border-[#00FF85]/40 text-xs text-gray-300 transition"
            >
              {copiedHandle ? (
                <>
                  <Check size={13} className="text-[#00FF85]" />
                  <span className="text-[#00FF85]">Copied @{username}</span>
                </>
              ) : (
                <>
                  <Copy size={13} className="text-[#00FF85]" />
                  <span>Copy @{username}</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Global Alert Banner */}
        {status && (
          <div
            className={`flex items-center gap-2.5 p-3.5 rounded-2xl text-xs font-medium ${
              status.type === 'success'
                ? 'bg-[#00FF85]/12 text-[#00FF85] border border-[#00FF85]/25'
                : 'bg-red-500/12 text-red-400 border border-red-500/25'
            }`}
          >
            {status.type === 'success' ? (
              <CheckCircle2 size={16} className="shrink-0" />
            ) : (
              <AlertCircle size={16} className="shrink-0" />
            )}
            <span>{status.msg}</span>
          </div>
        )}

        {/* SECTION 1: PROFILE CARD */}
        <form
          onSubmit={handleSaveProfile}
          className="p-6 rounded-2xl bg-[#07110E] border border-white/10 space-y-5"
        >
          <div className="flex items-center gap-2 text-white font-bold text-base border-b border-white/5 pb-3">
            <User size={18} className="text-[#00FF85]" />
            <h2>Public Profile</h2>
          </div>

          {/* Avatar Picker */}
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="relative group">
              {photoURL ? (
                <img
                  src={photoURL}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-2 border-[#00FF85]/40"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-[#0F2E22] border-2 border-[#00FF85]/35 flex items-center justify-center text-[#00FF85] text-3xl font-bold">
                  {(displayName || user?.email || 'U').charAt(0).toUpperCase()}
                </div>
              )}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title="Change Profile Photo"
                className="absolute bottom-0 right-0 p-2 rounded-full bg-[#00FF85] hover:bg-[#00e677] text-[#040B0A] shadow-lg transition"
              >
                <Camera size={15} />
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>

            <div className="text-center sm:text-left space-y-1.5">
              <h3 className="text-lg font-bold text-white">{displayName || 'Sutra User'}</h3>
              <p className="text-xs text-[#00FF85]">
                {username ? `@${username}` : 'Set your unique @username'}
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-lg bg-[#0C1B17] hover:bg-white/10 border border-white/10 text-xs text-gray-200 transition"
                >
                  Upload Photo
                </button>
                {photoURL && (
                  <button
                    type="button"
                    onClick={() => setPhotoURL('')}
                    className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-xs text-red-400 inline-flex items-center gap-1 transition"
                  >
                    <Trash2 size={12} /> Remove
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Form Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-1.5">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your full name"
                className="w-full bg-[#0C1B17] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00FF85]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-1.5">
                Unique @username
              </label>
              <div className="relative">
                <AtSign
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#00FF85]"
                />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase())}
                  placeholder="your_username"
                  className="w-full bg-[#0C1B17] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00FF85]"
                />
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-semibold text-gray-400 uppercase">
                About / Bio
              </label>
              <span className="text-[11px] text-gray-500">{bio.length}/120</span>
            </div>
            <input
              type="text"
              maxLength={120}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Write a short status or bio..."
              className="w-full bg-[#0C1B17] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00FF85]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-1.5">
              Account Email (Read-only)
            </label>
            <input
              type="text"
              value={user?.email || ''}
              disabled
              className="w-full bg-[#050C0A] border border-white/5 rounded-xl px-4 py-2.5 text-sm text-gray-500 cursor-not-allowed"
            />
          </div>

          <div className="pt-1 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-[#00FF85] hover:bg-[#00e677] disabled:opacity-40 text-[#040B0A] text-sm font-bold transition shadow-md shadow-[#00FF85]/15"
            >
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>

        {/* SECTION 2: PRIVACY SETTINGS */}
        <div className="p-6 rounded-2xl bg-[#07110E] border border-white/10 space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-base border-b border-white/5 pb-3">
            <Shield size={18} className="text-[#00FF85]" />
            <h2>Privacy & Visibility</h2>
          </div>

          <ToggleRow
            icon={<Eye size={17} className="text-[#00FF85]" />}
            title="Last Seen & Online Status"
            description="Allow contacts to see when you are online or your last active time."
            checked={showOnlineStatus}
            onChange={(val) => handleTogglePrivacy('showOnlineStatus', val)}
          />

          <ToggleRow
            icon={<CheckCheck size={17} className="text-[#38BDF8]" />}
            title="Read Receipts (Blue Ticks)"
            description="If turned off, others won't see blue ticks when you read their messages."
            checked={readReceipts}
            onChange={(val) => handleTogglePrivacy('readReceipts', val)}
          />
        </div>

        {/* SECTION 3: NOTIFICATIONS & SOUND */}
        <div className="p-6 rounded-2xl bg-[#07110E] border border-white/10 space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-base border-b border-white/5 pb-3">
            <Bell size={18} className="text-[#00FF85]" />
            <h2>Notifications & Sounds</h2>
          </div>

          <ToggleRow
            icon={<Volume2 size={17} className="text-[#00FF85]" />}
            title="Incoming Message Sound"
            description="Play a subtle notification chime when a new message arrives."
            checked={soundEnabled}
            onChange={handleToggleSound}
          />

          <div className="flex items-center justify-between gap-4 pt-2 border-t border-white/5">
            <div>
              <p className="text-sm font-semibold text-gray-100">Chrome Desktop Popups</p>
              <p className="text-xs text-gray-400">
                {notifPermission === 'granted'
                  ? 'Desktop notifications are active in Chrome.'
                  : notifPermission === 'denied'
                  ? 'Blocked in browser site settings (click lock icon in Chrome URL bar to allow).'
                  : 'Get desktop alerts even when SUTRAA is minimized.'}
              </p>
            </div>
            {notifPermission === 'granted' ? (
              <span className="px-3 py-1 rounded-full bg-[#00FF85]/15 text-[#00FF85] text-xs font-semibold shrink-0">
                Enabled
              </span>
            ) : notifPermission === 'default' ? (
              <button
                type="button"
                onClick={handleEnableBrowserNotifications}
                className="px-3.5 py-1.5 rounded-full bg-[#00FF85] hover:bg-[#00e677] text-[#040B0A] text-xs font-bold shrink-0 transition"
              >
                Enable Now
              </button>
            ) : (
              <span className="px-3 py-1 rounded-full bg-red-500/15 text-red-400 text-xs font-semibold shrink-0">
                Blocked
              </span>
            )}
          </div>
        </div>

        {/* SECTION 4: SECURITY & SESSION */}
        <div className="p-6 rounded-2xl bg-[#07110E] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-white">Account Security</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Send a password reset email or sign out from this browser.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handlePasswordReset}
              disabled={resetSending}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#0C1B17] hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-200 transition"
            >
              <KeyRound size={14} className="text-[#00FF85]" />
              {resetSending ? 'Sending...' : 'Reset Password'}
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-red-500/12 hover:bg-red-500/20 border border-red-500/25 text-xs font-semibold text-red-400 transition"
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ToggleRow({
  icon,
  title,
  description,
  checked,
  onChange,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  checked: boolean;
  onChange: (val: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-1">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-[#0C1B17] border border-white/5 shrink-0 mt-0.5">
          {icon}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-100">{title}</p>
          <p className="text-xs text-gray-400">{description}</p>
        </div>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
          checked ? 'bg-[#00FF85]' : 'bg-white/15'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-[#040B0A] shadow transition duration-200 ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}