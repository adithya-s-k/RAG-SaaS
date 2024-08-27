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
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { PlusCircle, Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AxiosError } from 'axios';
import { FileUpload } from '@/components/ui/file-upload';

interface User {
  user_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: string;
  disabled?: boolean;
}

interface UsersResponse {
  users: User[];
}

interface UserUpdateData {
  first_name?: string;
  last_name?: string;
  role?: string;
  disabled?: boolean;
}
interface AdminData {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
}

export default function AdminPage() {
  const { isAdminAuthenticated, adminData } = useAdminAuth();
  const { isAuthenticated, axiosInstance } = useAuth();

  const [enableTools, setEnableTools] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const handleFileUpload = (files: File[]) => {
    setFiles(files);
    console.log(files);
  };

  const [systemPrompt, setSystemPrompt] = useState<string>('');
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const [configLoading, setConfigLoading] = useState<boolean>(true);
  const [configError, setConfigError] = useState<string | null>(null);
  const [systemPromptLoading, setSystemPromptLoading] = useState(false);
  const [startersLoading, setStartersLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUsers();
      fetchConfig();
    }
  }, [isAuthenticated, axiosInstance]);

  const fetchConfig = async () => {
    setConfigLoading(true);
    setConfigError(null);
    try {
      const [configResponse, systemPromptResponse] = await Promise.all([
        axiosInstance.get('/api/chat/config'),
        axiosInstance.get('/api/admin/system-prompt'),
      ]);

      const config = configResponse.data;
      const systemPromptData = systemPromptResponse.data;

      setSystemPrompt(systemPromptData.system_prompt || '');
      setSuggestedQuestions(config.starterQuestions || []);
      setConfigLoading(false);
    } catch (err) {
      const axiosError = err as AxiosError;
      setConfigError(axiosError.message || 'Failed to fetch configuration');
      setConfigLoading(false);
    }
  };
  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get<UsersResponse>(
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

  const updateUser = async (userId: string, updatedData: UserUpdateData) => {
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

  const updateSystemPrompt = async () => {
    setSystemPromptLoading(true);
    try {
      const response = await axiosInstance.put('/api/admin/system-prompt', {
        new_prompt: systemPrompt,
      });
      if (response.status === 200) {
        console.log('System prompt updated successfully');
      }
    } catch (error) {
      console.error('Failed to update system prompt:', error);
      // Optionally, you can show an error message to the user
    } finally {
      setSystemPromptLoading(false);
    }
  };

  const updateConversationStarters = async () => {
    setStartersLoading(true);
    try {
      const response = await axiosInstance.put(
        '/api/admin/conversation-starters',
        { new_starters: suggestedQuestions.filter((q) => q.trim() !== '') }
      );
      if (response.status === 200) {
        console.log('Conversation starters updated successfully');
      }
    } catch (error) {
      console.error('Failed to update conversation starters:', error);
      // Optionally, you can show an error message to the user
    } finally {
      setStartersLoading(false);
    }
  };

  const addSuggestedQuestion = () => {
    setSuggestedQuestions([...suggestedQuestions, '']);
  };

  const updateSuggestedQuestion = (index: number, value: string) => {
    const updatedQuestions = [...suggestedQuestions];
    updatedQuestions[index] = value;
    setSuggestedQuestions(updatedQuestions);
  };

  const deleteSuggestedQuestion = (index: number) => {
    const updatedQuestions = suggestedQuestions.filter((_, i) => i !== index);
    setSuggestedQuestions(updatedQuestions);
  };

  if (!isAdminAuthenticated) {
    return <Loading />;
  }

  if (loading) return <Loading />;
  if (error) return <div>Error: {error}</div>;
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
                    .filter((user) => user.email !== adminData?.email)
                    .map((user) => (
                      <TableRow key={user.user_id}>
                        <TableCell>
                          {`${user.first_name || ''} ${
                            user.last_name || ''
                          }`.trim()}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Select
                            onValueChange={(value) =>
                              updateUser(user.user_id, {
                                role: value as string,
                              })
                            }
                            defaultValue={user.role}
                            disabled={
                              user.role === 'admin' &&
                              users.filter((u) => u.role === 'admin').length ===
                                1
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
        </TabsContent>
        <TabsContent value="ingestion">
          <Card>
            <CardHeader>
              <CardTitle>Data Ingestion</CardTitle>
              <CardDescription>
                Manage data ingestion processes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="w-full  mx-auto min-h-96 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg">
                  <FileUpload onChange={handleFileUpload} />
                </div>
                <div>
                  <Label htmlFor="ingestionStrategy">Ingestion Strategy</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a strategy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">Fixed Size Chunking</SelectItem>
                      <SelectItem value="semantic">
                        Semantic Chunking
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="parser">Parser</Label>
                  <Select disabled>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a parser" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="llama">Llama Parse</SelectItem>
                      <SelectItem value="omni">Omniparse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="rag">
          <Card>
            <CardHeader>
              <CardTitle>RAG Configuration</CardTitle>
              <CardDescription>
                Configure Retrieval-Augmented Generation settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="systemPrompt">System Prompt</Label>
                <Textarea
                  id="systemPrompt"
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  placeholder="Enter system prompt here..."
                />
                <Button
                  onClick={updateSystemPrompt}
                  className="mt-2"
                  disabled={systemPromptLoading}
                >
                  {systemPromptLoading ? 'Updating...' : 'Update System Prompt'}
                </Button>
              </div>
              <div>
                <Label>Suggested Questions</Label>
                {suggestedQuestions.map((question, index) => (
                  <div key={index} className="flex items-center space-x-2 mt-2">
                    <Input
                      value={question}
                      onChange={(e) =>
                        updateSuggestedQuestion(index, e.target.value)
                      }
                      placeholder="Enter a suggested question..."
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => deleteSuggestedQuestion(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  className="mt-2"
                  onClick={addSuggestedQuestion}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Question
                </Button>
                <Button
                  onClick={updateConversationStarters}
                  className="mt-2 ml-2"
                  disabled={startersLoading}
                >
                  {startersLoading
                    ? 'Updating...'
                    : 'Update Conversation Starters'}
                </Button>
              </div>
              {/* ... (other inputs remain the same) */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
