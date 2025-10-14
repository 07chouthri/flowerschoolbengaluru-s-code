import { createContext, useContext, useEffect, useState } from 'react';
import { UserData, authStorage, SESSION_STORAGE_KEY } from '../lib/auth';
 
interface AuthContextType {
  user: UserData | null;
  login: (userData: UserData) => void;
  logout: () => void;
  isAuthenticated: boolean;
}
 
const AuthContext = createContext<AuthContextType | undefined>(undefined);
 
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null>(() => authStorage.getUser());
  const [isAuthenticated, setIsAuthenticated] = useState(() => authStorage.isAuthenticated());
 
  const login = (userData: UserData) => {
    authStorage.saveUser(userData);
    setUser(userData);
    setIsAuthenticated(true);
  };
 
  const logout = () => {
    authStorage.clearUser();
    setUser(null);
    setIsAuthenticated(false);
  };
 
  // Handle storage events for cross-tab synchronization
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === SESSION_STORAGE_KEY) {
        const currentUser = authStorage.getUser();
        setUser(currentUser);
        setIsAuthenticated(!!currentUser);
      }
    };
 
    const handleAuthUpdate = (event: CustomEvent) => {
      const currentUser = authStorage.getUser();
      setUser(currentUser);
      setIsAuthenticated(!!currentUser);
    };
 
    // Handle storage changes
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('auth-update', handleAuthUpdate as EventListener);
   
    // Check auth state on focus/visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const currentUser = authStorage.getUser();
        setUser(currentUser);
        setIsAuthenticated(!!currentUser);
      }
    };
   
    document.addEventListener('visibilitychange', handleVisibilityChange);
 
    // Initial auth check
    const currentUser = authStorage.getUser();
    if (currentUser) {
      setUser(currentUser);
      setIsAuthenticated(true);
    }
 
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth-update', handleAuthUpdate as EventListener);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
 
  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}
 
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
 