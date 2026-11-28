import { useState, useEffect } from 'react';
import { doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { UserPresenceInfo } from '../types/chat';

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

export function useUsersPresence(
  userIds: string[],
  fallbackTimestamps?: Record<string, any>
): Record<string, UserPresenceInfo> {
  const [rawUsers, setRawUsers] = useState<
    Record<
      string,
      { isOnline?: boolean; lastSeen?: any; createdAt?: any; showOnlineStatus?: boolean }
    >
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
              showOnlineStatus: data.showOnlineStatus,
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

    // Respect user's privacy setting
    if (info?.showOnlineStatus === false) {
      presenceMap[uid] = {
        isOnline: false,
        statusText: 'last seen hidden',
      };
      return;
    }

    const lastSeenMillis =
      typeof info?.lastSeen?.toMillis === 'function'
        ? info.lastSeen.toMillis()
        : info?.lastSeen?.seconds
        ? info.lastSeen.seconds * 1000
        : 0;

    const genuinelyOnline =
      Boolean(info?.isOnline) && (lastSeenMillis === 0 || now - lastSeenMillis < 50000);

    const effectiveLastSeen =
      info?.lastSeen || fallbackTimestamps?.[uid] || info?.createdAt;

    presenceMap[uid] = {
      isOnline: genuinelyOnline,
      statusText: genuinelyOnline ? 'online' : formatLastSeen(effectiveLastSeen),
    };
  });

  return presenceMap;
}