'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Cookies from 'js-cookie';
import axios, { AxiosInstance } from 'axios';
import { jwtDecode, JwtPayload } from 'jwt-decode';

interface AuthContextType {
  isAuthenticated: boolean;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  login: (
    accessToken: string,
    refreshToken: string,
    email: string,
    firstName: string,
    lastName: string
  ) => void;
  logout: () => void;
  axiosInstance: AxiosInstance;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const authRoutes = ['/signin', '/signup', '/resetPassword', '/verifiedEmail'];
const protectedRoutes = ['/chat', '/profile'];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [email, setEmail] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const refreshAccessToken = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/refresh`,
        { refresh_token: refreshToken }
      );
      const { access_token, refresh_token } = response.data.tokens;
      setAccessToken(access_token);
      setRefreshToken(refresh_token);
      Cookies.set('accessToken', access_token, { expires: 7 });
      Cookies.set('refreshToken', refresh_token, { expires: 7 });
      return access_token;
    } catch (error) {
      console.error('Error refreshing token:', error);
      logout();
      return null;
    }
  };

  const axiosInstance: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  axiosInstance.interceptors.request.use(
    async (config) => {
      if (accessToken) {
        try {
          const decodedToken = jwtDecode<JwtPayload>(accessToken);
          const currentTime = Date.now() / 1000;

          if (decodedToken.exp && decodedToken.exp < currentTime) {
            const newAccessToken = await refreshAccessToken();
            if (newAccessToken) {
              config.headers['Authorization'] = `Bearer ${newAccessToken}`;
            } else {
              // If we couldn't refresh the token, we should probably log out the user
              logout();
              throw new axios.Cancel('Session expired. Please log in again.');
            }
          } else {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
          }
        } catch (error) {
          console.error('Error processing token:', error);
          logout();
          throw new axios.Cancel('Invalid token. Please log in again.');
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  useEffect(() => {
    const checkAuthStatus = async () => {
      const currentAccessToken = Cookies.get('accessToken');
      const currentRefreshToken = Cookies.get('refreshToken');
      const emailFromCookie = Cookies.get('email');

      if (currentAccessToken && currentRefreshToken && emailFromCookie) {
        setIsAuthenticated(true);
        setAccessToken(currentAccessToken);
        setRefreshToken(currentRefreshToken);
        setEmail(emailFromCookie);
        setFirstName(Cookies.get('firstName') || null);
        setLastName(Cookies.get('lastName') || null);

        if (authRoutes.includes(pathname)) {
          router.push('/chat');
        }
      } else {
        setIsAuthenticated(false);
        if (protectedRoutes.includes(pathname)) {
          router.push('/signin');
        }
      }
    };

    checkAuthStatus();
  }, [router, pathname]);

  const login = (
    accessToken: string,
    refreshToken: string,
    email: string,
    firstName: string,
    lastName: string
  ) => {
    Cookies.set('accessToken', accessToken, { expires: 7 });
    Cookies.set('refreshToken', refreshToken, { expires: 7 });
    Cookies.set('email', email, { expires: 7 });
    Cookies.set('firstName', firstName, { expires: 7 });
    Cookies.set('lastName', lastName, { expires: 7 });

    setIsAuthenticated(true);
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    setEmail(email);
    setFirstName(firstName);
    setLastName(lastName);
    router.push('/chat');
  };

  const logout = () => {
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    Cookies.remove('email');
    Cookies.remove('firstName');
    Cookies.remove('lastName');

    setIsAuthenticated(false);
    setAccessToken(null);
    setRefreshToken(null);
    setEmail(null);
    setFirstName(null);
    setLastName(null);
    router.push('/signin');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        email,
        firstName,
        lastName,
        accessToken,
        refreshToken,
        login,
        logout,
        axiosInstance,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
