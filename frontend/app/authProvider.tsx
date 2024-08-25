'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Cookies from 'js-cookie';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  accessToken: string | null;
  login: (
    accessToken: string,
    refreshToken: string,
    email: string,
    firstName: string,
    lastName: string
  ) => void;
  logout: () => void;
  verifyAdminStatus: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const publicRoutes = ['/', '/about-us', '/plans', '/features'];
const authRoutes = ['/signin', '/signup', '/resetPassword', '/verifiedEmail'];
const userProtectedRoutes = ['/chat', '/profile', '/admin'];
const adminProtectedRoutes = ['/admin', '/admin/users', '/admin/settings'];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [email, setEmail] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const refreshToken = async () => {
    try {
      const refreshTokenFromCookie = Cookies.get('refreshToken');
      if (!refreshTokenFromCookie) {
        throw new Error('No refresh token found');
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/refresh`,
        { refresh_token: refreshTokenFromCookie },
        { withCredentials: true }
      );

      const { access_token, refresh_token } = response.data;
      Cookies.set('accessToken', access_token, { expires: 7 });
      Cookies.set('refreshToken', refresh_token, { expires: 30 });
      setAccessToken(access_token);
      return access_token;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      logout();
      return null;
    }
  };

  const isTokenExpired = (token: string) => {
    try {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.exp * 1000 < Date.now();
    } catch (error) {
      return true;
    }
  };

  const verifyAdminStatus = async (): Promise<boolean> => {
    try {
      console.log('Access Token:', accessToken); // Log the token
      if (!accessToken) {
        console.error('No access token available');
        return false;
      }
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/verify-admin`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log('Verify admin response:', response.data);
      if (response.data.isAdmin == true) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Failed to verify admin status:', error);
      if (axios.isAxiosError(error)) {
        console.error('Error response:', error.response?.data);
      }
      return false;
    }
  };
  useEffect(() => {
    const checkAuthStatus = async () => {
      let currentAccessToken = Cookies.get('accessToken');
      const emailFromCookie = Cookies.get('email');
      const firstNameFromCookie = Cookies.get('firstName');
      const lastNameFromCookie = Cookies.get('lastName');

      if (currentAccessToken && emailFromCookie) {
        if (isTokenExpired(currentAccessToken)) {
          currentAccessToken = await refreshToken();
          if (!currentAccessToken) {
            logout();
            return;
          }
        }

        setIsAuthenticated(true);
        setAccessToken(currentAccessToken);
        setEmail(emailFromCookie);
        setFirstName(firstNameFromCookie || null);
        setLastName(lastNameFromCookie || null);

        // Verify admin status whenever the access token is set or changed
        const adminStatus = await verifyAdminStatus();
        setIsAdmin(adminStatus);

        if (authRoutes.includes(pathname)) {
          router.push('/chat');
        } else if (
          adminProtectedRoutes.includes(pathname) &&
          !(await verifyAdminStatus())
        ) {
          console.log('Chat redirect 2');
          router.push('/chat');
        }
      } else {
        setIsAuthenticated(false);
        setIsAdmin(false);
        if (
          userProtectedRoutes.includes(pathname) ||
          adminProtectedRoutes.includes(pathname)
        ) {
          router.push('/signin');
        }
      }
    };

    checkAuthStatus();
  }, [router, pathname, accessToken]);

  const login = (
    accessToken: string,
    refreshToken: string,
    email: string,
    firstName: string,
    lastName: string
  ) => {
    Cookies.set('accessToken', accessToken, { expires: 7 });
    Cookies.set('refreshToken', refreshToken, { expires: 30 });
    Cookies.set('email', email, { expires: 7 });
    Cookies.set('firstName', firstName, { expires: 7 });
    Cookies.set('lastName', lastName, { expires: 7 });

    setIsAuthenticated(true);
    setAccessToken(accessToken);
    setEmail(email);
    setFirstName(firstName);
    setLastName(lastName);
    console.log('Chat redirect 3');
    router.push('/chat');
  };

  const logout = () => {
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    Cookies.remove('email');
    Cookies.remove('firstName');
    Cookies.remove('lastName');

    setIsAuthenticated(false);
    setIsAdmin(false);
    setAccessToken(null);
    setEmail(null);
    setFirstName(null);
    setLastName(null);
    router.push('/signin');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isAdmin,
        email,
        firstName,
        lastName,
        accessToken,
        login,
        logout,
        verifyAdminStatus,
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

export const useRequireAuth = (adminRequired: boolean = false) => {
  const { isAuthenticated, isAdmin, accessToken, verifyAdminStatus } =
    useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      if (!isAuthenticated) {
        if (
          userProtectedRoutes.includes(pathname) ||
          adminProtectedRoutes.includes(pathname)
        ) {
          router.push('/signin');
        }
        setIsAuthorized(false);
      } else {
        if (authRoutes.includes(pathname)) {
          console.log('Chat redirect 4');
          router.push('/chat');
        } else if (adminRequired) {
          const adminStatus = await verifyAdminStatus();
          if (adminStatus) {
            setIsAuthorized(true);
          } else {
            setIsAuthorized(false);
            console.log('Chat redirect 5');
            router.push('/chat');
          }
        } else {
          setIsAuthorized(true);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [
    isAuthenticated,
    isAdmin,
    router,
    pathname,
    adminRequired,
    verifyAdminStatus,
  ]);

  return {
    isAuthorized,
    isLoading,
    accessToken,
  };
};
