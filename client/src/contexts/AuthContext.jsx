import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loggedIn = !!token;

  const register = async (username, password, firstName, lastName, email) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        password,
        first_name: firstName,
        last_name: lastName,
        email,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Error creating user");
    }

    setToken(data.accessToken);
    setUser(data.user);
  };

  const login = async (username, password) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Error signing in");
    }

    setToken(data.accessToken);
    setUser(data.user);
  };

  const refresh = async () => {
    const res = await fetch("/api/auth/refresh", {
      method: "GET",
      credentials: "include",
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to refresh token");
    }

    setToken(data.accessToken);
    setUser(data.user);

    return data.accessToken;
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } finally {
      setToken("");
      setUser(null);
    }
  };

  // Refresh tokens on app load
  useEffect(() => {
    const initAuth = async () => {
      try {
        await refresh();
      } catch {
        setToken("");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const values = {
    token,
    user,
    setUser,
    loading,
    loggedIn,
    register,
    login,
    refresh,
    logout,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
}

// Exporting the hook beside the provider costs a full reload instead of a hot update
// when this file is edited. Split it out if that ever gets annoying.
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error(
      "Context Error: useAuth must be used within the Auth Provider",
    );
  }
  return context;
};
