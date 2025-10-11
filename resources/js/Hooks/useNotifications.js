import { useEffect, useState, useCallback } from 'react';
import { usePage, router } from '@inertiajs/react';

/**
 * Custom hook for handling real-time notifications
 */
export function useNotifications() {
  const { auth, notifications: initialNotifications = [], unreadCount: initialUnreadCount = 0 } = usePage().props;
  const [notifications, setNotifications] = useState(initialNotifications);
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount);
  const [newNotification, setNewNotification] = useState(null);

  // Play notification sound
  // Play notification sound
  const playNotificationSound = useCallback(() => {
    try {
      // Create a simple beep using Web Audio API
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800; // Frequency in Hz
      oscillator.type = 'sine'; // Sine wave

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.log('Could not play notification sound:', error);
    }
  }, []);

  // Show browser notification
  const showBrowserNotification = useCallback((notification) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const browserNotification = new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: `notification-${notification.id}`,
      });

      browserNotification.onclick = () => {
        window.focus();
        if (notification.link) {
          router.visit(notification.link);
        }
        browserNotification.close();
      };

      setTimeout(() => browserNotification.close(), 5000);
    }
  }, []);

  // Request browser notification permission
  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return Notification.permission === 'granted';
  }, []);

  useEffect(() => {
    if (!auth?.user?.id) return;

    // Check if Echo is available
    if (!window.Echo) {
      console.error('Echo is not initialized. Make sure echo.js is imported in your app.');
      return;
    }

    // Listen to private user channel for notifications
    const channel = window.Echo.private(`user.${auth.user.id}`);

    channel.listen('.notification.sent', (data) => {
      console.log('New notification received:', data);

      // Update notifications list
      setNotifications(prev => [data, ...prev]);
      setUnreadCount(prev => prev + 1);
      setNewNotification(data);

      // Play sound and show browser notification
      playNotificationSound();
      showBrowserNotification(data);

      // Clear the new notification indicator after 5 seconds
      setTimeout(() => setNewNotification(null), 5000);
    });

    // Cleanup on unmount
    return () => {
      channel.stopListening('.notification.sent');
      window.Echo.leave(`user.${auth.user.id}`);
    };
  }, [auth?.user?.id, playNotificationSound, showBrowserNotification]);

  // Sync with server data when page props change
  useEffect(() => {
    setNotifications(initialNotifications);
    setUnreadCount(initialUnreadCount);
  }, [initialNotifications, initialUnreadCount]);

  const markAsRead = useCallback((notificationId) => {
    router.post(`/notifications/${notificationId}/read`, {}, {
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => {
        setNotifications(prev =>
          prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    });
  }, []);

  const markAllAsRead = useCallback(() => {
    router.post('/notifications/mark-all-read', {}, {
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => {
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        setUnreadCount(0);
      }
    });
  }, []);

  const clearAll = useCallback(() => {
    router.delete('/notifications/clear-all', {
      preserveScroll: true,
      onSuccess: () => {
        setNotifications([]);
        setUnreadCount(0);
      }
    });
  }, []);

  return {
    notifications,
    unreadCount,
    newNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
    requestNotificationPermission,
  };
}