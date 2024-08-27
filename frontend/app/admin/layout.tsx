'use client';

import React from 'react';
import { AdminAuthProvider } from './AdminAuthProvider';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthProvider>
      <ScrollArea className="w-full h-full">
        <main>{children}</main>
      </ScrollArea>
    </AdminAuthProvider>
  );
}
