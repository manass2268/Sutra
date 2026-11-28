import { useState, useEffect, useCallback } from 'react';

export function useBrowserAlerts(totalUnreadCount: number) {
  const [permission, setPermission] = useState<NotificationPermission>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'denied';
  });

  useEffect(() => {
    if (totalUnreadCount > 0) {
      document.title = `(${totalUnreadCount}) SUTRAA`;
    } else {
      document.title = 'SUTRAA';
    }
    return () => {
      document.title = 'SUTRAA';
    };
  }, [totalUnreadCount]);

  const requestPermission = useCallback(async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    if (Notification.permission === 'default') {
      const result = await Notification.requestPermission();
      setPermission(result);
    } else {
      setPermission(Notification.permission);
    }
  }, []);

  const playNotificationSound = useCallback(() => {
    if (
      typeof window !== 'undefined' &&
      localStorage.getItem('sutraa_sound_enabled') === 'false'
    ) {
      return;
    }

    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.09);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.22);
    } catch {
      // Ignore autoplay restriction errors before first user click
    }
  }, []);

  const triggerIncomingAlert = useCallback(
    (senderName: string, messageText: string, onClick?: () => void) => {
      playNotificationSound();

      if (
        typeof window !== 'undefined' &&
        'Notification' in window &&
        Notification.permission === 'granted' &&
        document.visibilityState !== 'visible'
      ) {
        const notif = new Notification(senderName, {
          body: messageText,
          tag: `sutraa-${senderName}`,
        });

        notif.onclick = () => {
          window.focus();
          notif.close();
          onClick?.();
        };
      }
    },
    [playNotificationSound]
  );

  return {
    permission,
    requestPermission,
    triggerIncomingAlert,
  };
}