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
  const playNotificationSound = useCallback(() => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = 'sine';

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

    if (!window.Echo) {
      console.error('Echo is not initialized. Make sure echo.js is imported in your app.');
      return;
    }

    const channel = window.Echo.private(`user.${auth.user.id}`);

    channel.listen('.notification.sent', (data) => {
      console.log('New notification received:', data);

      setNotifications(prev => [data, ...prev]);
      setUnreadCount(prev => prev + 1);
      setNewNotification(data);

      playNotificationSound();
      showBrowserNotification(data);

      setTimeout(() => setNewNotification(null), 5000);
    });

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

  // ✅ FIXED: Use correct route and handle response properly
  const markAsRead = useCallback((notificationId) => {
    return new Promise((resolve, reject) => {
      console.log('🔧 [markAsRead] Starting for notification ID:', notificationId);
      console.log('📊 [markAsRead] Current notifications count:', notifications.length);
      console.log('📊 [markAsRead] Current unread count:', unreadCount);

      // Optimistically update the UI first
      setNotifications(prev => {
        const updated = prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n);
        console.log('✅ [markAsRead] Optimistically updated UI');
        return updated;
      });
      setUnreadCount(prev => {
        const newCount = Math.max(0, prev - 1);
        console.log('✅ [markAsRead] Optimistically updated unread count:', newCount);
        return newCount;
      });

      // Send request to server - using correct route name
      const routeUrl = route('notifications.read', notificationId);
      console.log('🌐 [markAsRead] Posting to route:', routeUrl);

      router.post(
        routeUrl,
        {},
        {
          preserveScroll: true,
          // ✅ Removed preserveState to allow shared props to refresh
          onSuccess: (page) => {
            console.log('✅ [markAsRead] Server response SUCCESS');
            console.log('📦 [markAsRead] Response page data:', page);
            console.log('📊 [markAsRead] New notifications from server:', page.props.notifications?.length);
            console.log('📊 [markAsRead] New unread count from server:', page.props.unreadCount);
            resolve();
          },
          onError: (errors) => {
            console.error('❌ [markAsRead] Server response ERROR:', errors);
            // Revert optimistic update on error
            setNotifications(prev =>
              prev.map(n => n.id === notificationId ? { ...n, is_read: false } : n)
            );
            setUnreadCount(prev => prev + 1);
            console.log('↩️ [markAsRead] Reverted optimistic updates');
            reject(errors);
          }
        }
      );
    });
  }, [notifications.length, unreadCount]);

  // ✅ FIXED: Use correct route name
  const markAllAsRead = useCallback(() => {
    return new Promise((resolve, reject) => {
      console.log('🔧 [markAllAsRead] Starting...');
      console.log('📊 [markAllAsRead] Current unread count:', unreadCount);
      console.log('📊 [markAllAsRead] Total notifications:', notifications.length);

      // Optimistically update UI
      setNotifications(prev => {
        const updated = prev.map(n => ({ ...n, is_read: true }));
        console.log('✅ [markAllAsRead] Optimistically marked all as read');
        return updated;
      });
      const previousUnreadCount = unreadCount;
      setUnreadCount(0);
      console.log('✅ [markAllAsRead] Optimistically set unread count to 0');

      const routeUrl = route('notifications.mark-all-read');
      console.log('🌐 [markAllAsRead] Posting to route:', routeUrl);

      router.post(
        routeUrl,
        {},
        {
          preserveScroll: true,
          // ✅ Removed preserveState to allow shared props to refresh
          onSuccess: (page) => {
            console.log('✅ [markAllAsRead] Server response SUCCESS');
            console.log('📦 [markAllAsRead] Response page data:', page);
            console.log('📊 [markAllAsRead] New notifications from server:', page.props.notifications?.length);
            console.log('📊 [markAllAsRead] New unread count from server:', page.props.unreadCount);
            resolve();
          },
          onError: (errors) => {
            console.error('❌ [markAllAsRead] Server response ERROR:', errors);
            // Revert on error
            setNotifications(prev =>
              prev.map(n => {
                const originalNotification = initialNotifications.find(orig => orig.id === n.id);
                return originalNotification ? { ...n, is_read: originalNotification.is_read } : n;
              })
            );
            setUnreadCount(previousUnreadCount);
            console.log('↩️ [markAllAsRead] Reverted optimistic updates');
            reject(errors);
          }
        }
      );
    });
  }, [unreadCount, initialNotifications, notifications.length]);

  // ✅ FIXED: Use correct route name
  const clearAll = useCallback(() => {
    return new Promise((resolve, reject) => {
      console.log('🔧 [clearAll] Starting...');
      console.log('📊 [clearAll] Total notifications to clear:', notifications.length);
      console.log('📊 [clearAll] Current unread count:', unreadCount);

      // Store previous state for rollback
      const previousNotifications = [...notifications];
      const previousUnreadCount = unreadCount;

      // Optimistically update UI
      setNotifications([]);
      setUnreadCount(0);
      console.log('✅ [clearAll] Optimistically cleared all notifications');

      const routeUrl = route('notifications.clear-all');
      console.log('🌐 [clearAll] Deleting via route:', routeUrl);

      router.delete(
        routeUrl,
        {
          preserveScroll: true,
          // ✅ Removed preserveState to allow shared props to refresh
          onSuccess: (page) => {
            console.log('✅ [clearAll] Server response SUCCESS');
            console.log('📦 [clearAll] Response page data:', page);
            console.log('📊 [clearAll] New notifications from server:', page.props.notifications?.length);
            console.log('📊 [clearAll] New unread count from server:', page.props.unreadCount);
            resolve();
          },
          onError: (errors) => {
            console.error('❌ [clearAll] Server response ERROR:', errors);
            // Revert on error
            setNotifications(previousNotifications);
            setUnreadCount(previousUnreadCount);
            console.log('↩️ [clearAll] Reverted optimistic updates');
            reject(errors);
          }
        }
      );
    });
  }, [notifications, unreadCount]);

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