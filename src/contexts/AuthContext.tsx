import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType, RegisterData } from '../types';
import { authAPI } from '../services/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 檢查本地儲存的認證資訊
    const storedToken = localStorage.getItem('wanderlust_token');
    const storedUser = localStorage.getItem('wanderlust_user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      
      // 驗證 token 是否有效
      authAPI.getProfile()
        .then((response) => {
          if (response.success && response.data) {
            setUser(response.data);
            localStorage.setItem('wanderlust_user', JSON.stringify(response.data));
          } else {
            // Token 無效，清除本地儲存
            localStorage.removeItem('wanderlust_token');
            localStorage.removeItem('wanderlust_user');
            setToken(null);
            setUser(null);
          }
        })
        .catch(() => {
          // 清除無效的認證資訊
          localStorage.removeItem('wanderlust_token');
          localStorage.removeItem('wanderlust_user');
          setToken(null);
          setUser(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password });
      
      if (response.success && response.data) {
        const { user: userData, token: tokenData } = response.data;
        
        setUser(userData);
        setToken(tokenData);
        
        localStorage.setItem('wanderlust_token', tokenData);
        localStorage.setItem('wanderlust_user', JSON.stringify(userData));
      } else {
        throw new Error(response.message || '登入失敗');
      }
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      const response = await authAPI.register(userData);
      
      if (response.success && response.data) {
        const { user: userData, token: tokenData } = response.data;
        
        setUser(userData);
        setToken(tokenData);
        
        localStorage.setItem('wanderlust_token', tokenData);
        localStorage.setItem('wanderlust_user', JSON.stringify(userData));
      } else {
        throw new Error(response.message || '註冊失敗');
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('wanderlust_token');
    localStorage.removeItem('wanderlust_user');
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 