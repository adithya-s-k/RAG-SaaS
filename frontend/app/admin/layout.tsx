'use client';

import React from 'react';
import { AdminAuthProvider } from './AdminAuthProvider';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthProvider>
      <main>{children}</main>
    </AdminAuthProvider>
  );
}
