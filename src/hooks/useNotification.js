import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "./use-auth";

const POLL_INTERVAL = 30_000; // 30 seconds
const API_URL = import.meta.env.VITE_API_URL;

export function useNotifications() {
  const { auth } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const intervalRef = useRef(null);

  const fetchUnreadCount = useCallback(async () => {
    if (!auth?.access) return;

    try {
      const response = await fetch(`${API_URL}/notifications/unread-count/`, {
        headers: { Authorization: `Bearer ${auth.access}` },
      });
      if (!response.ok) return;
      const data = await response.json();
      setUnreadCount(data.unread_count ?? 0);
    } catch {
      // Silently fail — polling should never crash the app
    }
  }, [auth?.access]);

  const fetchNotifications = useCallback(async () => {
    if (!auth?.access) return;

    try {
      const response = await fetch(`${API_URL}/notifications/`, {
        headers: { Authorization: `Bearer ${auth.access}` },
      });
      if (!response.ok) return;
      const data = await response.json();
      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.is_read).length);
    } catch {
      // Silently fail
    } finally {
      setIsLoading(false);
    }
  }, [auth?.access]);

  const markAsRead = useCallback(
    async (id) => {
      if (!auth?.access) return;

      // Optimistic update
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));

      try {
        await fetch(`${API_URL}/notifications/read/`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${auth.access}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        });
      } catch {
        // Revert optimistic update on failure
        await fetchNotifications();
      }
    },
    [auth?.access, fetchNotifications]
  );

  const markAllAsRead = useCallback(async () => {
    if (!auth?.access) return;

    // Optimistic update
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);

    try {
      await fetch(`${API_URL}/notifications/read/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${auth.access}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ all: true }),
      });
    } catch {
      await fetchNotifications();
    }
  }, [auth?.access, fetchNotifications]);

  // Initial fetch + start polling
  useEffect(() => {
    if (!auth?.access) return;

    fetchNotifications();

    // Poll unread count every 30s (lightweight)
    intervalRef.current = window.setInterval(fetchUnreadCount, POLL_INTERVAL);

    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [auth?.access, fetchNotifications, fetchUnreadCount]);

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    refresh: fetchNotifications,
  };
}