import { useAuth } from "./useAuth";

export function useAuthFetch() {
  const { token, refresh, logout } = useAuth();

  const authFetch = async (url, options = {}) => {
    // Original fetch
    let res = await fetch(url, {
      ...options,
      credentials: "include",
      headers: {
        ...(options.headers || {}),
        token,
      },
    });

    if (res.status === 401) {
      // If the token is not found or not valid
      try {
        // Refresh the token
        const newToken = await refresh();

        // Retry original fetch with new token
        res = await fetch(url, {
          ...options,
          credentials: "include",
          headers: {
            ...(options.headers || {}),
            token: newToken,
          },
        });
      } catch {
        await logout();
        throw new Error("Session expired");
      }
    }

    return res;
  };

  return authFetch;
}
