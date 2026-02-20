import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { authAPI } from '../api';

interface Staff {
  staff_id: string;  // VARCHAR
  staff_name: string;
  email: string;
  designation?: string;
  roles: string[];
}

interface AuthContextType {
  staff: Staff | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (staff_id: string, pin: string) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (role: string | string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [staff, setStaff] = useState<Staff | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('accessToken');
      const storedStaff = localStorage.getItem('staff');
      
      if (token && storedStaff) {
        try {
          const parsedStaff = JSON.parse(storedStaff);
          setStaff(parsedStaff);
          
          // Verify token is still valid
          try {
            await authAPI.verify();
          } catch (error) {
            console.warn('Token expired, attempting refresh...');
            
            // Try to refresh
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
              try {
                const response = await authAPI.refresh(refreshToken);
                localStorage.setItem('accessToken', response.data.accessToken);
              } catch (refreshError) {
                console.warn('Refresh failed, clearing auth');
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('staff');
                setStaff(null);
              }
            }
          }
        } catch (err) {
          console.error('Failed to parse stored staff:', err);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('staff');
          setStaff(null);
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (staff_id: string, pin: string) => {
    try {
      const response = await authAPI.login(staff_id, pin);
      
      // Store tokens and staff info
      localStorage.setItem('accessToken', response.data.tokens.accessToken);
      localStorage.setItem('refreshToken', response.data.tokens.refreshToken);
      localStorage.setItem('staff', JSON.stringify(response.data.staff));
      
      setStaff(response.data.staff);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      throw new Error(err.response?.data?.error || 'Login failed');
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        await authAPI.logout();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('staff');
      setStaff(null);
    }
  };

  const hasRole = (roles: string | string[]): boolean => {
    if (!staff) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.some(role => staff.roles.includes(role));
  };

  return (
    <AuthContext.Provider 
      value={{
        staff,
        isAuthenticated: !!staff,
        isLoading,
        login,
        logout,
        hasRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
