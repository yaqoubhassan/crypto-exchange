import { useState, useEffect, useCallback } from 'react';
import { usePage, router } from '@inertiajs/react';

export function useNotifications() {
  const { auth, notifications: initialNotifications = [], unreadCount: initialUnreadCount = 0 } = usePage().props;

  const [notifications, setNotifications] = useState(initialNotifications);
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount);
  const [newNotification, setNewNotification] = useState(null);

  // ✅ Check if user is admin
  const isAdmin = auth?.user?.is_admin ?? false;

  // ✅ Helper function to get the correct route name
  const getRouteName = useCallback((routeName) => {
    return isAdmin ? `admin.${routeName}` : routeName;
  }, [isAdmin]);

  const playNotificationSound = useCallback(() => {
    try {
      const audio = new Audio('/sounds/notification.mp3');
      audio.volume = 0.5;
      audio.play().catch(err => console.log('Could not play notification sound:', err));
    } catch (error) {
      console.log('Notification sound not available:', error);
    }
  }, []);

  const showBrowserNotification = useCallback((notification) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(notification.title, {
          body: notification.message,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
        });
      } catch (error) {
        console.log('Could not show browser notification:', error);
      }
    }
  }, []);

  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      return await Notification.requestPermission();
    }
    return Notification.permission;
  }, []);

  useEffect(() => {
    if (!auth?.user?.id || !window.Echo) {
      console.warn('Echo not available. Make sure echo.js is imported in your app.');
      return;
    }

    const channel = window.Echo.private(`user.${auth.user.id}`);

    channel.listen('.notification.sent', (data) => {

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

  // ✅ UPDATED: Use admin-aware route names
  const markAsRead = useCallback((notificationId) => {
    return new Promise((resolve, reject) => {

      // Optimistically update the UI first
      setNotifications(prev => {
        const updated = prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n);
        return updated;
      });
      setUnreadCount(prev => {
        const newCount = Math.max(0, prev - 1);
        return newCount;
      });

      // ✅ Use admin-aware route
      const routeName = getRouteName('notifications.read');
      const routeUrl = route(routeName, notificationId);

      router.post(
        routeUrl,
        {},
        {
          preserveScroll: true,
          preserveState: false,
          onSuccess: (page) => {
            resolve();
          },
          onError: (errors) => {
            // Revert optimistic update on error
            setNotifications(prev =>
              prev.map(n => n.id === notificationId ? { ...n, is_read: false } : n)
            );
            setUnreadCount(prev => prev + 1);
            reject(errors);
          }
        }
      );
    });
  }, [isAdmin, getRouteName]);

  // ✅ UPDATED: Use admin-aware route names
  const markAllAsRead = useCallback(() => {
    return new Promise((resolve, reject) => {
      // Optimistically update UI
      setNotifications(prev => {
        const updated = prev.map(n => ({ ...n, is_read: true }));
        return updated;
      });
      const previousUnreadCount = unreadCount;
      setUnreadCount(0);

      // ✅ Use admin-aware route
      const routeName = getRouteName('notifications.mark-all-read');
      const routeUrl = route(routeName);

      router.post(
        routeUrl,
        {},
        {
          preserveScroll: true,
          preserveState: false,
          onSuccess: (page) => {
            resolve();
          },
          onError: (errors) => {
            // Revert on error
            setNotifications(prev =>
              prev.map(n => {
                const originalNotification = initialNotifications.find(orig => orig.id === n.id);
                return originalNotification ? { ...n, is_read: originalNotification.is_read } : n;
              })
            );
            setUnreadCount(previousUnreadCount);
            reject(errors);
          }
        }
      );
    });
  }, [isAdmin, getRouteName, unreadCount, initialNotifications]);

  // ✅ UPDATED: Use admin-aware route names
  const clearAll = useCallback(() => {
    return new Promise((resolve, reject) => {
      // Store previous state for rollback
      const previousNotifications = [...notifications];
      const previousUnreadCount = unreadCount;

      // Optimistically update UI
      setNotifications([]);
      setUnreadCount(0);

      // ✅ Use admin-aware route
      const routeName = getRouteName('notifications.clear-all');
      const routeUrl = route(routeName);

      router.delete(
        routeUrl,
        {
          preserveScroll: true,
          preserveState: false,
          onSuccess: (page) => {
            resolve();
          },
          onError: (errors) => {
            console.error('❌ [clearAll] Server response ERROR:', errors);
            // Revert on error
            setNotifications(previousNotifications);
            setUnreadCount(previousUnreadCount);
            reject(errors);
          }
        }
      );
    });
  }, [isAdmin, getRouteName, notifications, unreadCount]);

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