import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiRequest } from "../utils/api";
import { clearAuthSession, getStoredUser, getToken, saveAuthSession } from "../utils/auth";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(getStoredUser());
  const [token, setToken] = useState(getToken());
  const [isBootstrapping, setIsBootstrapping] = useState(Boolean(getToken()));
  const [cartCount, setCartCount] = useState(0);

  const applySession = (session) => {
    saveAuthSession(session);
    setUser(session.user);
    setToken(session.token);
  };

  const signOut = () => {
    clearAuthSession();
    setUser(null);
    setToken(null);
    setCartCount(0);
  };

  const refreshCurrentUser = async () => {
    try {
      const data = await apiRequest("/auth/me");
      setUser(data.user);
      return data.user;
    } catch {
      signOut();
      return null;
    } finally {
      setIsBootstrapping(false);
    }
  };

  const refreshCartCount = async () => {
    if (!getToken()) {
      setCartCount(0);
      return 0;
    }

    try {
      const data = await apiRequest("/cart");
      const totalItems = (data.cart?.items || []).reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(totalItems);
      return totalItems;
    } catch {
      setCartCount(0);
      return 0;
    }
  };

  useEffect(() => {
    if (token) {
      refreshCurrentUser();
      refreshCartCount();
    } else {
      setIsBootstrapping(false);
      setCartCount(0);
    }
  }, [token]);

  const value = useMemo(
    () => ({
      user,
      token,
      cartCount,
      isAuthenticated: Boolean(user && token),
      isBootstrapping,
      applySession,
      signOut,
      refreshCurrentUser,
      refreshCartCount,
    }),
    [user, token, cartCount, isBootstrapping]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useAppContext = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }

  return context;
};
