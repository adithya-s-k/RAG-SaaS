'use client';

import React, { useEffect, useState } from 'react';
import { useAdminAuth } from './AdminAuthProvider';
import { useAuth } from '@/app/authProvider';
import Loading from '@/components/loading';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import UsersManagement from '@/app/admin/UsersManagement';
import DataIngestion from '@/app/admin/DataIngestion';
import RAGConfiguration from '@/app/admin/RAGConfiguration';

export default function AdminPage() {
  const { isAdminAuthenticated, adminData } = useAdminAuth();
  const { isAuthenticated } = useAuth();

  if (!isAdminAuthenticated) {
    return <Loading />;
  }

  if (!isAuthenticated) return <div>Unauthorized</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex-col md:flex md:flex-row justify-between items-center mb-6 ">
        <h1 className="text-2xl font-bold py-2">Dashboard</h1>

        {adminData && Object.keys(adminData).length > 0 && (
          <Card className="flex items-center space-x-4 p-4">
            <Avatar className="h-10 w-10">
              <AvatarFallback>
                {adminData.firstName?.[0]}
                {adminData.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              {(adminData.firstName || adminData.lastName) && (
                <p className="font-medium">
                  {`${adminData.firstName || ''} ${
                    adminData.lastName || ''
                  }`.trim()}
                </p>
              )}
              {adminData.email && (
                <CardDescription>{adminData.email}</CardDescription>
              )}
              {adminData.role && (
                <p className="text-sm text-muted-foreground">
                  Role: {adminData.role}
                </p>
              )}
            </div>
          </Card>
        )}
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users">Users Tracking</TabsTrigger>
          <TabsTrigger value="ingestion">Data Ingestion</TabsTrigger>
          <TabsTrigger value="rag">RAG Configuration</TabsTrigger>
        </TabsList>
        <TabsContent value="users">
          <UsersManagement adminEmail={adminData?.email} />
        </TabsContent>
        <TabsContent value="ingestion">
          <DataIngestion />
        </TabsContent>
        <TabsContent value="rag">
          <RAGConfiguration />
        </TabsContent>
      </Tabs>
    </div>
  );
}
