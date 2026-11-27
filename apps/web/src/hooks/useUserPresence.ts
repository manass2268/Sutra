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

// Helper: Timestamp ko WhatsApp style "last seen ..." format mein convert karne ke liye
function formatLastSeen(lastSeen: any): string {
  if (!lastSeen) return 'last seen recently';

  const millis =
    typeof lastSeen.toMillis === 'function'
      ? lastSeen.toMillis()
      : lastSeen.seconds
      ? lastSeen.seconds * 1000
      : typeof lastSeen === 'number'
      ? lastSeen
      : null;

  if (!millis) return 'last seen recently';

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

// 2. Baaki users ka real-time online / lastSeen status sunne ke liye (with fallback timestamp)
export function useUsersPresence(
  userIds: string[],
  fallbackTimestamps?: Record<string, any>
): Record<string, UserPresenceInfo> {
  const [rawUsers, setRawUsers] = useState<
    Record<string, { isOnline?: boolean; lastSeen?: any; createdAt?: any }>
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
              createdAt: data.createdAt,
            },
          }));
        }
      })
    );

    return () => unsubs.forEach((unsub) => unsub());
  }, [idsKey]);

  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 15000);
    return () => clearInterval(timer);
  }, []);

  void tick;

  const presenceMap: Record<string, UserPresenceInfo> = {};
  const now = Date.now();
  const uniqueIds = idsKey ? idsKey.split(',') : [];

  uniqueIds.forEach((uid) => {
    const info = rawUsers[uid];

    const lastSeenMillis =
      typeof info?.lastSeen?.toMillis === 'function'
        ? info.lastSeen.toMillis()
        : info?.lastSeen?.seconds
        ? info.lastSeen.seconds * 1000
        : 0;

    const genuinelyOnline =
      Boolean(info?.isOnline) && (lastSeenMillis === 0 || now - lastSeenMillis < 50000);

    // Agar user ka lastSeen abhi tak set nahi hai toh chat activity ya createdAt se last seen dikhao
    const effectiveLastSeen =
      info?.lastSeen || fallbackTimestamps?.[uid] || info?.createdAt;

    presenceMap[uid] = {
      isOnline: genuinelyOnline,
      statusText: genuinelyOnline ? 'online' : formatLastSeen(effectiveLastSeen),
    };
  });

  return presenceMap;
}