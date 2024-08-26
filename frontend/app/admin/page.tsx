'use client';

import { useEffect, useState } from 'react';
import { useAdminAuth } from './AdminAuthProvider';
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AvatarImage } from '@radix-ui/react-avatar';

export default function AdminPage() {
  const { isAdminAuthenticated, adminData } = useAdminAuth();
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', isAdmin: false },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', isAdmin: true },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', isAdmin: false },
  ]);
  const [file, setFile] = useState(null);
  const [systemPrompt, setSystemPrompt] = useState('');
  const [suggestedQuestions, setSuggestedQuestions] = useState([
    'What is RAG?',
    'How does chunking work?',
  ]);
  const [enableTools, setEnableTools] = useState(false);

  if (!isAdminAuthenticated) {
    return <Loading />;
  }

  const toggleAdminStatus = (userId: number) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, isAdmin: !user.isAdmin } : user
      )
    );
  };

  const deleteUser = (userId: number) => {
    setUsers(users.filter((user) => user.id !== userId));
  };

  const handleFileUpload = (event: { target: { files: any[] } }) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);
  };

  const handleDragOver = (event: { preventDefault: () => void }) => {
    event.preventDefault();
  };

  const handleDrop = (event: {
    preventDefault: () => void;
    dataTransfer: { files: any[] };
  }) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    setFile(droppedFile);
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>

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
              <CardTitle>Users Tracking</CardTitle>
              <CardDescription>
                Monitor and manage user activity.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Admin Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Button
                          variant={user.isAdmin ? 'default' : 'outline'}
                          onClick={() => toggleAdminStatus(user.id)}
                        >
                          {user.isAdmin ? 'Admin' : 'User'}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="destructive"
                          onClick={() => deleteUser(user.id)}
                        >
                          Delete
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
              {/* <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 mb-4 text-center cursor-pointer"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <p>Drag and drop your file here, or click to select a file</p>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="fileUpload"
                />
                <label htmlFor="fileUpload">
                  <Button className="mt-2">Upload File</Button>
                </label>
              </div> */}
              {/* {file && <p className="mb-4">Selected file: {file.name}</p>} */}
              <div className="space-y-4">
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
                <Label htmlFor="ragTechnique">RAG Technique</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a RAG technique" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic RAG</SelectItem>
                    <SelectItem value="advanced">Advanced RAG</SelectItem>
                    <SelectItem value="hybrid">Hybrid RAG</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="systemPrompt">System Prompt</Label>
                <Textarea
                  id="systemPrompt"
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  placeholder="Enter system prompt here..."
                />
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
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="enableTools"
                  checked={enableTools}
                  onCheckedChange={setEnableTools}
                />
                <Label htmlFor="enableTools">Enable Tools</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
