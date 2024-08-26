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
      <main className="container mx-auto px-4 py-8">{children}</main>
    </AdminAuthProvider>
  );
}
