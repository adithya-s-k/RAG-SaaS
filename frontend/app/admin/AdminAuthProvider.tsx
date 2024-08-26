'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Cookies from 'js-cookie';

interface AdminAuthContextType {
  isAdminAuthenticated: boolean;
  adminData: {
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  } | null;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(
  undefined
);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAdminAuthenticated, setIsAdminAuthenticated] =
    useState<boolean>(false);
  const [adminData, setAdminData] =
    useState<AdminAuthContextType['adminData']>(null);
  const router = useRouter();

  const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${Cookies.get('accessToken')}`,
    },
  });

  useEffect(() => {
    const verifyAdminStatus = async () => {
      const accessToken = Cookies.get('accessToken');
      if (!accessToken) {
        setIsAdminAuthenticated(false);
        router.push('/');
        return;
      }

      try {
        const response = await axiosInstance.get('/api/auth/verify-admin');
        if (response.data.isAdmin) {
          setIsAdminAuthenticated(true);
          fetchAdminData();
        } else {
          setIsAdminAuthenticated(false);
          router.push('/');
        }
      } catch (error) {
        console.error('Error verifying admin status:', error);
        setIsAdminAuthenticated(false);
        router.push('/');
      }
    };

    verifyAdminStatus();
  }, [router]);

  const fetchAdminData = async () => {
    try {
      const response = await axiosInstance.get('/api/auth/me');
      setAdminData(response.data);
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        isAdminAuthenticated,
        adminData,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
