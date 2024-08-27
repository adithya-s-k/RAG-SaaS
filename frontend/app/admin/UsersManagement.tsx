'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/app/authProvider';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Trash2 } from 'lucide-react';
import { AxiosError } from 'axios';

interface User {
  user_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: string;
  disabled?: boolean;
}

interface UsersManagementProps {
  adminEmail: string | undefined;
}

export default function UsersManagement({ adminEmail }: UsersManagementProps) {
  const { axiosInstance } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [axiosInstance]);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get<{ users: User[] }>(
        '/api/admin/users'
      );
      setUsers(response.data.users);
      setLoading(false);
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(axiosError.message || 'Failed to fetch users');
      setLoading(false);
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      await axiosInstance.delete(`/api/admin/users/${userId}`);
      setUsers(users.filter((user) => user.user_id !== userId));
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(axiosError.message || 'Failed to delete user');
    }
  };

  const updateUser = async (userId: string, updatedData: Partial<User>) => {
    try {
      await axiosInstance.put(`/api/admin/users/${userId}`, updatedData);
      setUsers(
        users.map((user) =>
          user.user_id === userId ? { ...user, ...updatedData } : user
        )
      );
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(axiosError.message || 'Failed to update user');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users Management</CardTitle>
        <CardDescription>Manage user accounts</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users
              .filter((user) => user.email !== adminEmail)
              .map((user) => (
                <TableRow key={user.user_id}>
                  <TableCell>
                    {`${user.first_name || ''} ${user.last_name || ''}`.trim()}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Select
                      onValueChange={(value) =>
                        updateUser(user.user_id, { role: value })
                      }
                      defaultValue={user.role}
                      disabled={
                        user.role === 'admin' &&
                        users.filter((u) => u.role === 'admin').length === 1
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={!user.disabled}
                      onCheckedChange={(checked) =>
                        updateUser(user.user_id, { disabled: !checked })
                      }
                      disabled={user.role === 'admin'}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      onClick={() => deleteUser(user.user_id)}
                      disabled={user.role === 'admin'}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
