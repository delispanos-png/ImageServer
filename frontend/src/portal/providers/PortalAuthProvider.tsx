import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { PortalClient } from '../../types';
import { ApiError } from '../../services/api';
import { getCurrentPortalClient, portalLogin, portalLogout } from '../../services/portal-auth';

interface PortalAuthContextValue {
  client: PortalClient | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (login: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const PortalAuthContext = createContext<PortalAuthContextValue | undefined>(undefined);

export function PortalAuthProvider({ children }: { children: ReactNode }) {
  const [client, setClient] = useState<PortalClient | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    try {
      const response = await getCurrentPortalClient();
      setClient(response.client);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        setClient(null);
        return;
      }
      throw error;
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const response = await getCurrentPortalClient();
        if (mounted) {
          setClient(response.client);
        }
      } catch (error) {
        if (mounted) {
          if (error instanceof ApiError && error.status === 401) {
            setClient(null);
          } else {
            console.error('Failed to validate portal session', error);
            setClient(null);
          }
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const login = useCallback(async (loginValue: string, password: string) => {
    const response = await portalLogin({ login: loginValue, password });
    setClient(response.client);
  }, []);

  const logout = useCallback(async () => {
    await portalLogout();
    setClient(null);
  }, []);

  const value = useMemo<PortalAuthContextValue>(
    () => ({
      client,
      isAuthenticated: Boolean(client),
      isLoading,
      login,
      logout,
      refreshSession,
    }),
    [client, isLoading, login, logout, refreshSession],
  );

  return <PortalAuthContext.Provider value={value}>{children}</PortalAuthContext.Provider>;
}

export function usePortalAuth() {
  const context = useContext(PortalAuthContext);
  if (!context) {
    throw new Error('usePortalAuth must be used within PortalAuthProvider');
  }
  return context;
}
