'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Github,
  LinkIcon,
  MessageCircle,
  MessageSquare,
  MoreHorizontal,
  Plus,
} from 'lucide-react';
import { useConversationContext } from '@/app/ConversationContext';
import { useAuth } from '@/app/authProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThemeToggle } from './theme-toggle';
import { toast } from 'sonner';
import axios from 'axios';
import { ScrollArea } from '@/components/ui/scroll-area';
import Loading from './loading';
import Link from 'next/link';

interface Conversation {
  _id: string;
  summary: string;
  created_at?: string;
  updated_at?: string;
}

const MAX_SUMMARY_LENGTH = 27;

function HistoryComponent() {
  const { isAuthenticated, firstName, lastName, email, logout, accessToken } =
    useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { conversationList, setConversationList } = useConversationContext();
  const [isEditing, setIsEditing] = useState<string | null>(null);

  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [shareableLink, setShareableLink] = useState<string>('');
  const [editedSummaries, setEditedSummaries] = useState<{
    [key: string]: string;
  }>({});

  const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const fetchConversations = async () => {
    if (!isAuthenticated) return;
    try {
      const response = await axiosInstance.get('/api/conversation/list');
      setConversationList(response.data.conversations);
    } catch (error: any) {
      toast(`Failed to fetch conversations: ${error.message}`);
    }
  };

  const handleEditClick = (conversationId: string, currentSummary: string) => {
    if (!isAuthenticated) return;
    setIsEditing(conversationId);
    setEditedSummaries((prev) => ({
      ...prev,
      [conversationId]: currentSummary,
    }));
  };

  const handleEditSubmit = async (conversationId: string) => {
    if (!isAuthenticated) return;
    try {
      await axiosInstance.patch(`/api/conversation/${conversationId}/summary`, {
        summary: editedSummaries[conversationId],
      });
      await fetchConversations();
      setIsEditing(null);
    } catch (error: any) {
      toast(`Failed to update summary: ${error.message}`);
    }
  };

  const handleShareClick = async (conversationId: string) => {
    try {
      const response = await axiosInstance.patch(
        `/api/conversation/${conversationId}/share`
      );

      if (response.status === 200) {
        const shareableLink = `${window.location.origin}/share?conversation_id=${conversationId}`;
        setShareableLink(shareableLink);
        setIsShareModalOpen(true);
      }
    } catch (error: any) {
      toast(`Failed to share conversation: ${error.message}`);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareableLink);
    toast('Link copied to clipboard!');
  };

  const handleDeleteClick = async (conversationId: string): Promise<void> => {
    if (!isAuthenticated) return;
    const confirmed = window.confirm(
      'Are you sure you want to delete this conversation?'
    );
    if (!confirmed) return;
    try {
      await axiosInstance.delete(`/api/conversation/${conversationId}`);

      const currentConversationId = searchParams.get('conversation_id');

      if (currentConversationId === conversationId) {
        router.push('/chat');
      } else {
        router.push(`/chat?conversation_id=${currentConversationId}`);
      }

      await fetchConversations();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast(`Failed to delete conversation: ${error.message}`);
      } else {
        toast('An unexpected error occurred while deleting the conversation');
      }
    }
  };

  const handleNewChat = async () => {
    if (!isAuthenticated) return;
    try {
      const response = await axiosInstance.get('/api/conversation');
      const newConversationId = response.data.conversation_id;
      fetchConversations();
      router.push(`/chat?conversation_id=${newConversationId}`);
    } catch (error: any) {
      toast(`Failed to create new chat: ${error.message}`);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchConversations();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col h-full bg-background text-foreground text-sm">
        <Button
          onClick={handleNewChat}
          className="m-3 py-2 rounded-md font-semibold bg-primary hover:bg-primary/90 text-primary-foreground text-base"
        >
          <Plus className="mr-2 h-5 w-5" /> New Chat
        </Button>
        <div className="flex-grow flex items-center justify-center">
          <p className="text-center text-muted-foreground">
            Sign in to see your chat history
          </p>
        </div>
        <div className="p-3 border-t flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button variant="secondary" asChild>
              <Link href="/signin">Sign In</Link>
            </Button>
          </div>
          <div className="flex items-center space-x-3">
            <ThemeToggle />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background text-foreground text-sm ">
      <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Conversation</DialogTitle>
            <DialogDescription>
              Copy the link below to share this conversation:
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <Input value={shareableLink} readOnly />
            <Button onClick={copyToClipboard}>
              <LinkIcon className="mr-2 h-4 w-4" />
              Copy
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Button
        variant="ghost"
        onClick={handleNewChat}
        className="m-3 py-2 rounded-md font-semibold text-base border-2"
      >
        <Plus className="mr-2 h-5 w-5" /> New Chat
      </Button>
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full px-2">
          {Object.entries(conversationList).map(
            ([dateCategory, conversations]) =>
              conversations.length > 0 ? (
                <div key={dateCategory} className="mb-3">
                  <h3 className="text-sm font-bold my-2 capitalize text-muted-foreground">
                    {dateCategory.replace(/_/g, ' ')}
                  </h3>
                  {conversations
                    .sort(
                      (a: { updated_at: any }, b: { updated_at: any }) =>
                        new Date(b.updated_at || '').getTime() -
                        new Date(a.updated_at || '').getTime()
                    )
                    .map((conversation: Conversation) => (
                      <div
                        key={conversation._id}
                        className="flex items-center justify-between px-2 py-1 hover:bg-accent rounded-md cursor-pointer"
                        onClick={() =>
                          router.push(
                            `/chat?conversation_id=${conversation._id}`
                          )
                        }
                      >
                        <div className="flex items-center space-x-3 overflow-hidden">
                          <MessageSquare className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                          {isEditing === conversation._id ? (
                            <Input
                              value={editedSummaries[conversation._id]}
                              onChange={(e) =>
                                setEditedSummaries((prev) => ({
                                  ...prev,
                                  [conversation._id]: e.target.value,
                                }))
                              }
                              onBlur={() => handleEditSubmit(conversation._id)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleEditSubmit(conversation._id);
                                }
                              }}
                              className="h-full text-md w-full focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                              placeholder="Edited Summary"
                              onClick={(e) => e.stopPropagation()}
                            />
                          ) : (
                            <span className="truncate text-base">
                              {conversation.summary.length > MAX_SUMMARY_LENGTH
                                ? `${conversation.summary.substring(
                                    0,
                                    MAX_SUMMARY_LENGTH
                                  )}...`
                                : conversation.summary}
                            </span>
                          )}
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            asChild
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-36">
                            <DropdownMenuItem
                              onClick={() => setIsEditing(conversation._id)}
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleShareClick(conversation._id)}
                            >
                              Share
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleDeleteClick(conversation._id)
                              }
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ))}
                </div>
              ) : null
          )}
        </ScrollArea>
      </div>
      <div className="p-3 border-t flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-sm">
              {firstName?.[0]}
              {lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="text-sm">
            <p className="font-medium">
              {firstName} {lastName}
            </p>
            <p className="text-muted-foreground">{email}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}

export default function History() {
  return (
    <Suspense fallback={<Loading />}>
      <HistoryComponent />
    </Suspense>
  );
}
