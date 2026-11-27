import { useState, useEffect } from 'react';
import { doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { UserPresenceInfo } from '../types/chat';

// 1. Current user ka live online/offline status Firestore mein sync karne ke liye
export function useTrackMyPresence(uid?: string) {
  useEffect(() => {
    if (!uid) return;

    const userRef = doc(db, 'users', uid);

    const markOnline = () => {
      if (document.visibilityState === 'visible') {
        setDoc(
          userRef,
          { isOnline: true, lastSeen: serverTimestamp() },
          { merge: true }
        ).catch(() => {});
      }
    };

    const markOffline = () => {
      setDoc(
        userRef,
        { isOnline: false, lastSeen: serverTimestamp() },
        { merge: true }
      ).catch(() => {});
    };

    // Initial online mark
    markOnline();

    const interval = setInterval(markOnline, 25000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        markOnline();
      } else {
        markOffline();
      }
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', markOffline);

    return () => {
      clearInterval(interval);
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', markOffline);
      markOffline();
    };
  }, [uid]);
}

function formatLastSeen(lastSeen: any): string {
  if (!lastSeen) return 'offline';

  const millis =
    typeof lastSeen.toMillis === 'function'
      ? lastSeen.toMillis()
      : lastSeen.seconds
      ? lastSeen.seconds * 1000
      : null;

  if (!millis) return 'offline';

  const date = new Date(millis);
  const now = new Date();

  const timeStr = date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const isToday = date.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isToday) return `last seen today at ${timeStr}`;
  if (isYesterday) return `last seen yesterday at ${timeStr}`;

  const dateStr = date.toLocaleDateString([], {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  return `last seen ${dateStr} at ${timeStr}`;
}

// 2. Baaki users ka real-time online/lastSeen status show hone ke liye
export function useUsersPresence(userIds: string[]): Record<string, UserPresenceInfo> {
  const [rawUsers, setRawUsers] = useState<
    Record<string, { isOnline?: boolean; lastSeen?: any }>
  >({});
  const [tick, setTick] = useState(0);

  const idsKey = [...new Set(userIds)].sort().join(',');

  useEffect(() => {
    const uniqueIds = idsKey ? idsKey.split(',') : [];
    if (uniqueIds.length === 0) return;

    const unsubs = uniqueIds.map((uid) =>
      onSnapshot(doc(db, 'users', uid), (snap) => {
        if (snap.exists()) {
          const data = snap.data({ serverTimestamps: 'estimate' });
          setRawUsers((prev) => ({
            ...prev,
            [uid]: {
              isOnline: data.isOnline,
              lastSeen: data.lastSeen,
            },
          }));
        }
      })
    );

    return () => unsubs.forEach((unsub) => unsub());
  }, [idsKey]);

  // Har 15 second mein check karo ki kisi ka heartbeat 50s se purana toh nahi ho gaya
  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 15000);
    return () => clearInterval(timer);
  }, []);

  void tick;

  const presenceMap: Record<string, UserPresenceInfo> = {};
  const now = Date.now();

  Object.entries(rawUsers).forEach(([uid, info]) => {
    const lastSeenMillis =
      typeof info.lastSeen?.toMillis === 'function'
        ? info.lastSeen.toMillis()
        : info.lastSeen?.seconds
        ? info.lastSeen.seconds * 1000
        : 0;

    // 50 seconds ke andar heartbeat aayi hai aur isOnline true hai toh genuinely online hai
    const genuinelyOnline =
      Boolean(info.isOnline) && (lastSeenMillis === 0 || now - lastSeenMillis < 50000);

    presenceMap[uid] = {
      isOnline: genuinelyOnline,
      statusText: genuinelyOnline ? 'online' : formatLastSeen(info.lastSeen),
    };
  });

  return presenceMap;
}