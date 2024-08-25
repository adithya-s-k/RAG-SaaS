'use client';

import { Suspense, useEffect, useState } from 'react';
import { useAuth, useRequireAuth } from '@/app/authProvider';
import axios from 'axios';
import Loading from '@/components/loading';

interface UserOut {
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: string | null;
}

function AdminPageContent() {
  const [user, setUser] = useState<UserOut | null>(null);
  const { accessToken } = useAuth();
  const { isAuthorized, isLoading } = useRequireAuth(true); // Require admin access

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!isAuthorized || isLoading) return;

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/me`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setUser(response.data);
      } catch (error) {
        console.error('Failed to fetch user details:', error);
      }
    };

    fetchUserDetails();
  }, [accessToken, isAuthorized, isLoading]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Access Denied</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-full text-foreground">
      <div className="p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Admin Dashboard</h1>
        <div className="space-y-4">
          <div className="border p-4 rounded">
            <h2 className="text-xl font-semibold">
              {user.first_name} {user.last_name}
            </h2>
            <p>Email: {user.email}</p>
            <p>Role: {user.role || 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default function AdminPage() {
  const { isLoading } = useRequireAuth(true);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Suspense fallback={<Loading />}>
      <AdminPageContent />
    </Suspense>
  );
}
