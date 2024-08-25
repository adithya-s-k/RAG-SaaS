'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Github,
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
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThemeToggle } from './theme-toggle';
import { toast } from 'sonner';
import axios from 'axios';
import { ScrollArea } from '@/components/ui/scroll-area';
import Loading from './loading';

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
  const [editedSummary, setEditedSummary] = useState('');
  const [currentConversationId, setCurrentConversationId] = useState<
    string | null
  >(null);

  useEffect(() => {
    const urlConversationId = searchParams.get('conversation_id');
    setCurrentConversationId(urlConversationId);
  }, [searchParams]);

  const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const fetchConversations = async () => {
    try {
      const response = await axiosInstance.get('/api/conversation/list');
      setConversationList(response.data.conversations);
    } catch (error: any) {
      toast(`Failed to fetch conversations: ${error.message}`);
    }
  };

  const handleEditClick = (conversationId: string, currentSummary: string) => {
    setIsEditing(conversationId);
    setEditedSummary(currentSummary);
  };

  const handleEditSubmit = async (conversationId: string) => {
    try {
      await axiosInstance.patch(`/api/conversation/${conversationId}/summary`, {
        summary: editedSummary,
      });
      await fetchConversations();
      setIsEditing(null);
    } catch (error: any) {
      toast(`Failed to update summary: ${error.message}`);
    }
  };

  const handleDeleteClick = async (conversationId: string) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this conversation?'
    );
    if (!confirmed) return;

    try {
      await axiosInstance.delete(`/api/conversation/${conversationId}`);
      await fetchConversations();
      if (conversationId === currentConversationId) {
        handleNewChat();
      } else {
        router.refresh();
      }
    } catch (error: any) {
      toast(`Failed to delete conversation: ${error.message}`);
    }
  };

  const handleShareClick = (conversationId: string) => {
    // Implement share functionality here
    toast('Share functionality not implemented yet');
  };

  const handleNewChat = async () => {
    try {
      const response = await axiosInstance.get('/api/conversation');
      const newConversationId = response.data.conversation_id;
      router.push(`/chat?conversation_id=${newConversationId}`);
    } catch (error: any) {
      toast(`Failed to create new chat: ${error.message}`);
    }
  };

  const handleConversationClick = (conversationId: string) => {
    router.push(`/chat?conversation_id=${conversationId}`);
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  return (
    <div className="flex flex-col h-full bg-background text-foreground text-sm">
      <Button
        onClick={handleNewChat}
        className="m-3 py-2 rounded-md font-semibold bg-primary hover:bg-primary/90 text-primary-foreground text-base"
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
                              value={editedSummary}
                              onChange={(e) => setEditedSummary(e.target.value)}
                              onBlur={() => handleEditSubmit(conversation._id)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleEditSubmit(conversation._id);
                                }
                              }}
                              className="h-full text-sm w-full focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
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
                              onClick={() =>
                                toast('Share functionality not implemented yet')
                              }
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
