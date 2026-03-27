import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useAuth } from "../hooks/use-auth";

const NotificationsContext = createContext(null);

const POLL_INTERVAL = 30_000;
const API_URL = import.meta.env.VITE_API_URL;

export function NotificationsProvider({ children }) {
  const { auth } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const intervalRef = useRef(null);
  const unreadCountRef = useRef(0);

  useEffect(() => {
    unreadCountRef.current = unreadCount;
  }, [unreadCount]);

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
    } finally {
      setIsLoading(false);
    }
  }, [auth?.access]);

  const fetchUnreadCount = useCallback(async () => {
    if (!auth?.access) return;

    try {
      const response = await fetch(`${API_URL}/notifications/unread-count/`, {
        headers: { Authorization: `Bearer ${auth.access}` },
      });

      if (!response.ok) return;

      const data = await response.json();
      const nextUnreadCount = data.unread_count ?? 0;
      const prevUnreadCount = unreadCountRef.current;

      if (nextUnreadCount > prevUnreadCount) {
        await fetchNotifications();
      } else {
        setUnreadCount(nextUnreadCount);
      }
    } catch {}
  }, [auth?.access, fetchNotifications]);

  const markAsRead = useCallback(
    async (id) => {
      if (!auth?.access) return;

      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
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
        await fetchNotifications();
      }
    },
    [auth?.access, fetchNotifications],
  );

  const markAllAsRead = useCallback(async () => {
    if (!auth?.access) return;

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

  const dismiss = useCallback(
    async (id) => {
      if (!auth?.access) return;

      setNotifications((prev) => {
        const target = prev.find((n) => n.id === id);
        if (target && !target.is_read) {
          setUnreadCount((c) => Math.max(0, c - 1));
        }
        return prev.filter((n) => n.id !== id);
      });

      try {
        await fetch(`${API_URL}/notifications/read/`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${auth.access}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id, dismiss: true }),
        });
      } catch {
        await fetchNotifications();
      }
    },
    [auth?.access, fetchNotifications],
  );

  const dismissAll = useCallback(async () => {
    if (!auth?.access) return;

    setNotifications([]);
    setUnreadCount(0);

    try {
      await fetch(`${API_URL}/notifications/read/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${auth.access}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ all: true, dismiss: true }),
      });
    } catch {
      await fetchNotifications();
    }
  }, [auth?.access, fetchNotifications]);

  useEffect(() => {
    if (!auth?.access) {
      setNotifications([]);
      setUnreadCount(0);
      setIsLoading(false);

      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      return;
    }

    setIsLoading(true);
    fetchNotifications();

    intervalRef.current = window.setInterval(fetchUnreadCount, POLL_INTERVAL);

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [auth?.access, fetchNotifications, fetchUnreadCount]);

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        isLoading,
        markAsRead,
        markAllAsRead,
        dismiss,
        dismissAll,
        refresh: fetchNotifications,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationsProvider",
    );
  }
  return context;
}