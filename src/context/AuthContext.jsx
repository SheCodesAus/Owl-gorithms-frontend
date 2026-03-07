import { createContext, useContext, useState, useCallback } from 'react';
// Update to match backend URL, or set VITE_API_URL in .env
const API_BASE = import.meta.env.VITE_API_URL || '';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('kickitToken') || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  /** POST /api-token-auth/ */
  const login = useCallback(async (username, password) => {
    const res = await fetch(`${API_BASE}/api-token-auth/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) throw new Error('Invalid username or password.');
    const data = await res.json();
    localStorage.setItem('kickitToken', data.token);
    setToken(data.token);
    return data.token;
  }, []);

  /** POST /users/ */
  const register = useCallback(async (username, password) => {
    const res = await fetch(`${API_BASE}/users/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const msg =
        err.username?.[0] ||
        err.password?.[0] ||
        err.detail ||
        'Registration failed. Please try again.';
      throw new Error(msg);
    }
  }, []);

  /** Clears token + user */
  const logout = useCallback(() => {
    localStorage.removeItem('kickitToken');
    setToken(null);
    setUser(null);
  }, []);

  /** GET /users/me */
  const fetchCurrentUser = useCallback(async () => {
    if (!token) return null;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/users/me`, {
        headers: { Authorization: `Token ${token}` },
      });
      if (!res.ok) throw new Error('Session expired');
      const data = await res.json();
      setUser(data);
      return data;
    } catch {
      logout();
      return null;
    } finally {
      setLoading(false);
    }
  }, [token, logout]);

  /** PUT /users/<pk>/ */
  const updateUser = useCallback(
    async (pk, updates) => {
      const res = await fetch(`${API_BASE}/users/${pk}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error('Could not update profile.');
      const data = await res.json();
      setUser(data);
      return data;
    },
    [token]
  );

  /** DELETE /users/<pk>/ */
  const deleteUser = useCallback(
    async (pk) => {
      const res = await fetch(`${API_BASE}/users/${pk}/`, {
        method: 'DELETE',
        headers: { Authorization: `Token ${token}` },
      });
      if (!res.ok) throw new Error('Could not delete account.');
      logout();
    },
    [token, logout]
  );

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        isAuthenticated: !!token,
        login,
        register,
        logout,
        fetchCurrentUser,
        updateUser,
        deleteUser,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
