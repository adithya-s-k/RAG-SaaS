'use client';

import { useEffect } from 'react';
import { useAdminAuth } from './AdminAuthProvider';
import Loading from '@/components/loading';

export default function AdminPage() {
  const { isAdminAuthenticated, adminData } = useAdminAuth();

  if (!isAdminAuthenticated) {
    return <Loading />;
  }

  return (
    <div className="flex justify-center items-center min-h-full text-foreground">
      <div className="p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Admin Dashboard</h1>
        {adminData && (
          <div className="space-y-4">
            <div className="border p-4 rounded">
              <h2 className="text-xl font-semibold">
                {adminData.firstName} {adminData.lastName}
              </h2>
              <p>Email: {adminData.email}</p>
              <p>Role: {adminData.role || 'N/A'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
