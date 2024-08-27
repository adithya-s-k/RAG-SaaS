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
  const { accessToken, axiosInstance } = useAuth();
  const { backend } = useClientConfig();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [conversationId, setConversationId] = useState<string | null>(null);
  const { conversationList, setConversationList } = useConversationContext();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const fetchMessages = async () => {
    if (!conversationId) return;
    try {
      const response = await axiosInstance.get(
        `/api/conversation/${conversationId}`
      );
      setMessages(response.data.messages || []);
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        return;
      }
      toast(`Failed to fetch conversation: ${error.message}`);
    }
  };

  const fetchConversations = async () => {
    try {
      const response = await axiosInstance.get('/api/conversation/list');
      setConversationList(response.data.conversations);
    } catch (error: any) {
      console.error('Error fetching conversations:', error.message);
    }
  };

  const updateMessageContent = (
    id: string,
    oldContent: string,
    newContent: string
  ) => {
    const messageIndex = messages.findIndex(
      (m) => m.role === 'user' && m.content === oldContent
    );
    if (messageIndex !== -1) {
      const updatedMessages = [...messages.slice(0, messageIndex)];
      setMessages(updatedMessages);

      append!({
        role: 'user',
        content: newContent,
      });
    }
  };

  const handleNewChat = async () => {
    try {
      const response = await axiosInstance.get('/api/conversation');
      const newConversationId = response.data.conversation_id;
      router.push(`/chat?conversation_id=${newConversationId}`);
    } catch (error: any) {
      console.error('Error creating new conversation:', error.message);
    }
  };

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
  } = useChat({
    api: `${backend}/api/chat?conversation_id=${conversationId}`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: { conversation_id: conversationId },
    onError: (error: unknown) => {
      if (!(error instanceof Error)) throw error;
      let errorMessage = 'An unexpected error occurred.';

      try {
        const errorResponse = JSON.parse(error.message);

        if (errorResponse.detail === 'Not authenticated') {
          alert('Session has expired. Please login again.');
          router.push('/signin');
          return;
        }

        if (errorResponse.detail) {
          errorMessage = `Error: ${errorResponse.detail}`;
        } else if (errorResponse.errors) {
          errorMessage = `Validation Errors: ${errorResponse.errors.join(
            ', '
          )}`;
        } else if (errorResponse.message) {
          errorMessage = `Message: ${errorResponse.message}`;
        } else if (errorResponse.error) {
          errorMessage = `Error: ${errorResponse.error}`;
        } else {
          errorMessage = `Unknown error format: ${error.message}`;
        }
      } catch (parseError) {
        errorMessage = `Error parsing response: ${error.message}`;
      }

      toast(errorMessage);
    },
  });

  useEffect(() => {
    if (isClient) {
      fetchConversations();
    }
  }, [isClient, isLoading]);

  useEffect(() => {
    if (isClient && conversationId) {
      fetchMessages();
    }
  }, [isClient, conversationId]);

  useEffect(() => {
    if (isClient) {
      const urlConversationId = searchParams.get('conversation_id');
      const query = searchParams.get('query');

      setConversationId(urlConversationId);
      if (query) {
        setInput(query);
      }

      if (!urlConversationId) {
        const timer = setTimeout(() => {
          handleNewChat();
        }, 1000);

        return () => clearTimeout(timer);
      }
    }
  }, [isClient, searchParams, setInput]);

  if (!isClient) {
    <Loading />;
  }

  return (
    <div className="w-full h-full flex justify-center items-center bg-primary-foreground">
      <div className="space-y-2 w-full  md:w-[90%] lg:w-[70%] h-full flex flex-col p-4">
        <Suspense fallback={<Loading />}>
          <ChatMessages
            messages={messages}
            isLoading={isLoading}
            reload={reload}
            stop={stop}
            append={append}
            updateMessageContent={updateMessageContent}
          />
        </Suspense>
        <Suspense fallback={<Loading />}>
          <ChatInput
            input={input}
            handleSubmit={handleSubmit}
            handleInputChange={handleInputChange}
            isLoading={isLoading}
            messages={messages}
            append={append}
            setInput={setInput}
          />
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
