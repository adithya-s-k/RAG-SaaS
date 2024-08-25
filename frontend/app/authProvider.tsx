'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import axios from 'axios';

interface AuthContextType {
  isAuthenticated: boolean;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  login: (email: string, firstName: string, lastName: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const publicRoutes = [
  '/',
  '/resetPassword',
  '/about-us',
  '/plans',
  '/signup',
  '/signin',
  '/features',
  '/verifiedEmail',
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [email, setEmail] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  // useEffect(() => {
  //   const checkAuth = async () => {
  //     try {
  //       const response = await axios.get(
  //         `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/check-auth`,
  //         { withCredentials: true }
  //       );
  //       if (response.data.authenticated) {
  //         setIsAuthenticated(true);
  //         const userResponse = await axios.get(
  //           `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/user`,
  //           { withCredentials: true }
  //         );
  //         setEmail(userResponse.data.email);
  //         setFirstName(userResponse.data.first_name);
  //         setLastName(userResponse.data.last_name);
  //       } else {
  //         setIsAuthenticated(false);
  //         if (!publicRoutes.includes(pathname)) {
  //           router.push('/signin');
  //         }
  //       }
  //     } catch (error) {
  //       setIsAuthenticated(false);
  //       if (!publicRoutes.includes(pathname)) {
  //         router.push('/signin');
  //       }
  //     }
  //   };

  //   checkAuth();
  // }, [router, pathname]);

  const login = (email: string, firstName: string, lastName: string) => {
    setIsAuthenticated(true);
    setEmail(email);
    setFirstName(firstName);
    setLastName(lastName);
  };

  const logout = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
      setIsAuthenticated(false);
      setEmail(null);
      setFirstName(null);
      setLastName(null);
      router.push('/signin');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
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

  useEffect(() => {
    if (!isAuthenticated && !publicRoutes.includes(pathname)) {
      router.push('/signin');
    }
  }, [isAuthenticated, router, pathname]);

  return isAuthenticated;
};
