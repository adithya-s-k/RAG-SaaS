'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  isAuthenticated: boolean;
  accessToken: string | null;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  login: (
    token: string,
    email: string,
    firstName: string,
    lastName: string
  ) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const publicRoutes = [
  '/',
  '/resetPassword',
  '/about-us',
  '/plans',
  '/signup',
  '/features',
  '/verifiedEmail',
];
// '/contact-us',

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const storedEmail = localStorage.getItem('email');
    const storedFirstName = localStorage.getItem('firstName');
    const storedLastName = localStorage.getItem('lastName');

    if (token && storedEmail) {
      setIsAuthenticated(true);
      setAccessToken(token);
      setEmail(storedEmail);
      setFirstName(storedFirstName);
      setLastName(storedLastName);
    } else {
      setIsAuthenticated(false);
      if (!publicRoutes.includes(pathname)) {
        router.push('/signin');
      }
    }
  }, [router, pathname]);

  const login = (
    token: string,
    email: string,
    firstName: string,
    lastName: string
  ) => {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('email', email);
    localStorage.setItem('firstName', firstName);
    localStorage.setItem('lastName', lastName);
    setIsAuthenticated(true);
    setAccessToken(token);
    setEmail(email);
    setFirstName(firstName);
    setLastName(lastName);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('email');
    localStorage.removeItem('firstName');
    localStorage.removeItem('lastName');
    setIsAuthenticated(false);
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
        accessToken,
        email,
        firstName,
        lastName,
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

export const useRequireAuth = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  console.log(pathname);

  useEffect(() => {
    if (!isAuthenticated && !publicRoutes.includes(pathname)) {
      router.push('/signin');
    }
  }, [isAuthenticated, router, pathname]);

  return isAuthenticated;
};
