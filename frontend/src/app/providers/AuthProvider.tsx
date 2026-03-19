import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { CmsPermission, CmsModuleKey, CmsRole, CmsUser, ForgotPasswordResponse } from '../../types';
import {
  changePassword as changePasswordRequest,
  forgotPassword as forgotPasswordRequest,
  getCurrentUser,
  login as loginRequest,
  logout as logoutRequest,
  resetPassword as resetPasswordRequest,
} from '../../services/auth';
import { ApiError } from '../../services/api';
import {
  canAccessModule,
  getAllowedModules,
  getPermissionsForRole,
  hasPermission,
  normalizeCmsRole,
} from '../../services/permissions';

interface AuthContextValue {
  user: CmsUser | null;
  role: CmsRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  permissions: CmsPermission[];
  allowedModules: CmsModuleKey[];
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<ForgotPasswordResponse>;
  resetPassword: (token: string, password: string) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  refreshSession: () => Promise<void>;
  hasPermission: (permission: CmsPermission) => boolean;
  canAccessModule: (moduleKey: CmsModuleKey) => boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CmsUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    try {
      const response = await getCurrentUser();
      setUser(response.user);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        setUser(null);
        return;
      }
      throw error;
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const response = await getCurrentUser();
        if (mounted) {
          setUser(response.user);
        }
      } catch (error) {
        if (mounted) {
          if (error instanceof ApiError && error.status === 401) {
            setUser(null);
          } else {
            console.error('Failed to validate session', error);
            setUser(null);
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

  const login = useCallback(async (email: string, password: string) => {
    const response = await loginRequest({ email, password });
    setUser(response.user);
  }, []);

  const logout = useCallback(async () => {
    await logoutRequest();
    setUser(null);
  }, []);

  const forgotPassword = useCallback(async (email: string) => {
    return forgotPasswordRequest(email);
  }, []);

  const resetPassword = useCallback(async (token: string, password: string) => {
    await resetPasswordRequest({ token, password });
  }, []);

  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    await changePasswordRequest({ current_password: currentPassword, new_password: newPassword });
  }, []);

  const role = user ? normalizeCmsRole(user.role) : null;
  const permissions = user?.permissions && user.permissions.length > 0 ? user.permissions : role ? getPermissionsForRole(role) : [];
  const allowedModules = role ? getAllowedModules(role) : [];

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      role,
      isAuthenticated: Boolean(user),
      isLoading,
      permissions,
      allowedModules,
      login,
      logout,
      forgotPassword,
      resetPassword,
      changePassword,
      refreshSession,
      hasPermission: (permission) => hasPermission(role, permission),
      canAccessModule: (moduleKey) => canAccessModule(role, moduleKey),
    }),
    [
      user,
      role,
      isLoading,
      permissions,
      allowedModules,
      login,
      logout,
      forgotPassword,
      resetPassword,
      changePassword,
      refreshSession,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
