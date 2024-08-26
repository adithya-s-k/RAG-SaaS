/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useCallback, useEffect, useState } from 'react';
import { useChat } from 'ai/react';
import { ChatInput, ChatMessages } from '@/components/ui/chat';
import { useClientConfig } from '@/components/ui/chat/hooks/use-config';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useConversationContext } from '@/app/ConversationContext';
import { useAuth } from '@/app/authProvider';
import Loading from '@/components/loading';
import { toast } from 'sonner';
import axios from 'axios';

function ChatContent() {
  const { backend } = useClientConfig();
  const { isAuthenticated, accessToken } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [conversationId, setConversationId] = useState<string | null>(null);
  const { conversationList, setConversationList } = useConversationContext();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const axiosInstance = axios.create({
    baseURL: backend,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const {
    messages,
    input,
    isLoading,
    handleSubmit,
    handleInputChange,
    reload,
    stop,
    append,
    setInput,
    setMessages,
  } = useChat({});

  const fetchSharableMessages = useCallback(async () => {
    if (!conversationId) return;
    try {
      const response = await axiosInstance.get(
        `/api/conversation/sharable/${conversationId}`
      );
      setMessages(response.data.messages || []);
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        toast('This conversation is not available or not sharable.');
        // Optionally, redirect to a 404 page or clear the conversation
        // router.push('/404');
      } else {
        toast(`Failed to fetch conversation: ${error.message}`);
      }
    }
  }, [conversationId, axiosInstance, setMessages]);

  const fetchConversations = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const response = await axiosInstance.get('/api/conversation/list');
      setConversationList(response.data.conversations);
    } catch (error: any) {
      console.error('Error fetching conversations:', error.message);
    }
  }, [isAuthenticated, axiosInstance, setConversationList]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchConversations();
    }
  }, [isAuthenticated, fetchConversations, isLoading]);

  useEffect(() => {
    if (conversationId) {
      fetchSharableMessages();
    }
  }, [conversationId, fetchSharableMessages]);

  useEffect(() => {
    const urlConversationId = searchParams.get('conversation_id');
    setConversationId(urlConversationId);
  }, [searchParams]);

  return (
    <div className="w-full h-full flex justify-center items-center bg-primary-foreground">
      <div className="space-y-2 w-full  md:w-[90%] lg:w-[70%] h-full flex flex-col p-4">
        <Suspense fallback={<Loading />}>
          <ChatMessages messages={messages} isLoading={false} />
        </Suspense>
      </div>
    </div>
  );
}

export default function Chat() {
  return (
    <Suspense fallback={<Loading />}>
      <ChatContent />
    </Suspense>
  );
}
