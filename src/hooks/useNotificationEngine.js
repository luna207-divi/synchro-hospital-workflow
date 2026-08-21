import { useState, useEffect, useCallback } from 'react';
import { notificationEngine, NOTIFICATION_PRIORITIES } from '../services/notificationEngine';

/* ============================================================
   SYNCHRO — Notification Engine React Hook
   Connects UI components to live notifications, channel preferences,
   unread counts, browser push permissions, and action handlers.
   ============================================================ */

export const useNotificationEngine = (filters = {}) => {
  const [notifications, setNotifications] = useState([]);
  const [preferences, setPreferences] = useState(notificationEngine.preferences);
  const [browserPermission, setBrowserPermission] = useState(notificationEngine.browserPushPermissionState);

  // Subscribe to live notification engine state
  useEffect(() => {
    const unsubInApp = notificationEngine.subscribe((store) => {
      setNotifications(store);
      setPreferences({ ...notificationEngine.preferences });
    });

    return () => unsubInApp();
  }, []);

  // Filtered notifications
  const filteredHistory = notificationEngine.getHistory(filters);
  const unreadCount = notificationEngine.unreadCount;

  // Actions
  const markAsRead = useCallback((id) => notificationEngine.markAsRead(id), []);
  const markAllAsRead = useCallback(() => notificationEngine.markAllAsRead(), []);
  const acknowledge = useCallback((id, note) => notificationEngine.acknowledge(id, note), []);
  const dismiss = useCallback((id) => notificationEngine.dismiss(id), []);
  const updatePreferences = useCallback((newPrefs) => notificationEngine.savePreferences(newPrefs), []);

  const requestBrowserPermission = useCallback(async () => {
    const res = await notificationEngine.requestBrowserPushPermission();
    setBrowserPermission(res);
    return res;
  }, []);

  const sendTestNotification = useCallback(async () => {
    return notificationEngine.notify({
      title: '🔔 OT-405 Instruments Ready',
      message: 'TKR instrument pack verified and assigned.',
      priority: NOTIFICATION_PRIORITIES.HIGH,
      department: 'DOCTOR',
      relatedOT: 'OT-405',
      actionLabel: 'Go to OT-405',
      actionRoute: '/theatres?ot=OT-405',
      actionUrl: '/theatres?ot=OT-405'
    });
  }, []);

  return {
    notifications: filteredHistory,
    allNotifications: notifications,
    unreadCount,
    preferences,
    browserPermission,
    requestBrowserPermission,
    updatePreferences,
    markAsRead,
    markAllAsRead,
    acknowledge,
    dismiss,
    sendTestNotification,
    notify: notificationEngine.notify.bind(notificationEngine),
    NOTIFICATION_PRIORITIES
  };
};
