/* eslint-disable react-hooks/exhaustive-deps */
// import { ScrollShadow } from "@nextui-org/react";
'use client';

import { useEffect, useState } from 'react';
import { useChat } from 'ai/react';
import { ChatInput, ChatMessages } from '@/components/ui/chat';
import { useClientConfig } from '@/components/ui/chat/hooks/use-config';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useConversationContext } from '@/app/ConversationContext';
import useAuthenticatedFetch from '@/utils/authenticatedFetch';
import { useAuth } from '@/app/authProvider';
import Loading from '@/components/loading';

function Chat() {
  const { fetchUsage } = useConversationContext();
  const authenticatedFetch = useAuthenticatedFetch();
  const { isAuthenticated, accessToken } = useAuth();
  const { backend } = useClientConfig();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [conversationId, setConversationId] = useState<string | null>(null);
  const { conversationList, setConversationList } = useConversationContext();

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
      const response = await authenticatedFetch('/conversation', {
        method: 'GET',
      });
      if (!response) return;
      if (!response.ok) {
        throw new Error(
          `Failed to create new conversation: ${response.statusText}`
        );
      }

      const data = await response.json();
      const newConversationId = data.conversation_id;
      router.push(`/chat?conversation_id=${newConversationId}`);
    } catch (error) {
      console.error('Error creating new conversation:', error);
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
    // api: `${backend}/api/chat?conversation_id=${conversationId}`,
    api: `${backend}/api/chat`,
    // headers: {
    //   'Content-Type': 'application/json',
    //   Authorization: `Bearer ${accessToken}`,
    // },

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

      alert(errorMessage);
    },
  });

  return (
    <>
      <div className="w-screen h-full flex justify-center items-center bg-muted">
        <div className="space-y-4 lg:w-[75%] h-full flex flex-col p-4">
          <ChatMessages
            messages={messages}
            isLoading={isLoading}
            reload={reload}
            stop={stop}
            append={append}
            updateMessageContent={updateMessageContent}
          />
          <ChatInput
            input={input}
            handleSubmit={handleSubmit}
            handleInputChange={handleInputChange}
            isLoading={isLoading}
            messages={messages}
            append={append}
            setInput={setInput}
          />
        </div>
      </div>
    </>
  );
}

export default function UsingChatTest() {
  return (
    <Suspense fallback={<Loading />}>
      <Chat />
    </Suspense>
  );
}
