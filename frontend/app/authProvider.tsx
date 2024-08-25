'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Cookies from 'js-cookie';

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
    lastName: string,
    isAdmin: boolean
  ) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const publicRoutes = ['/', '/about-us', '/plans', '/features'];
const authRoutes = ['/signin', '/signup', '/resetPassword', '/verifiedEmail'];
const userProtectedRoutes = ['/chat', '/profile'];
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

  useEffect(() => {
    const accessTokenFromCookie = Cookies.get('accessToken');
    const emailFromCookie = Cookies.get('email');
    const firstNameFromCookie = Cookies.get('firstName');
    const lastNameFromCookie = Cookies.get('lastName');
    const isAdminFromCookie = Cookies.get('isAdmin');

    if (accessTokenFromCookie && emailFromCookie) {
      setIsAuthenticated(true);
      setAccessToken(accessTokenFromCookie);
      setEmail(emailFromCookie);
      setFirstName(firstNameFromCookie || null);
      setLastName(lastNameFromCookie || null);
      setIsAdmin(isAdminFromCookie === 'true');

      if (authRoutes.includes(pathname)) {
        router.push('/chat');
      } else if (
        adminProtectedRoutes.includes(pathname) &&
        !isAdminFromCookie
      ) {
        router.push('/chat');
      }
    } else {
      setIsAuthenticated(false);
      if (
        userProtectedRoutes.includes(pathname) ||
        adminProtectedRoutes.includes(pathname)
      ) {
        router.push('/signin');
      }
    }
  }, [router, pathname]);

  const login = (
    accessToken: string,
    refreshToken: string,
    email: string,
    firstName: string,
    lastName: string,
    isAdmin: boolean
  ) => {
    Cookies.set('accessToken', accessToken, { expires: 7 });
    Cookies.set('refreshToken', refreshToken, { expires: 30 });
    Cookies.set('email', email, { expires: 7 });
    Cookies.set('firstName', firstName, { expires: 7 });
    Cookies.set('lastName', lastName, { expires: 7 });
    Cookies.set('isAdmin', isAdmin.toString(), { expires: 7 });

    setIsAuthenticated(true);
    setAccessToken(accessToken);
    setEmail(email);
    setFirstName(firstName);
    setLastName(lastName);
    setIsAdmin(isAdmin);

    router.push('/chat');
  };

  const logout = () => {
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    Cookies.remove('email');
    Cookies.remove('firstName');
    Cookies.remove('lastName');
    Cookies.remove('isAdmin');

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
  const { isAuthenticated, isAdmin, accessToken } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthenticated) {
      if (
        userProtectedRoutes.includes(pathname) ||
        adminProtectedRoutes.includes(pathname)
      ) {
        router.push('/signin');
      }
    } else {
      if (authRoutes.includes(pathname)) {
        router.push('/chat');
      } else if (
        adminRequired &&
        !isAdmin &&
        adminProtectedRoutes.includes(pathname)
      ) {
        router.push('/chat');
      }
    }
  }, [isAuthenticated, isAdmin, router, pathname, adminRequired]);

  return {
    isAuthorized: isAuthenticated && (!adminRequired || isAdmin),
    accessToken,
  };
};
