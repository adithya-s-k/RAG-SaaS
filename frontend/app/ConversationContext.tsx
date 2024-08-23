'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import useAuthenticatedFetch from '@/utils/authenticatedFetch';
interface Conversation {
  _id: string;
  summary: string;
  created_at?: string;
  updated_at?: string;
}

interface ConversationsByDate {
  today: Conversation[];
  yesterday: Conversation[];
  last_7_days: Conversation[];
  before_that: Conversation[];
}

interface UsageData {
  chats: number;
  total_chats: number;
  file_uploads: number;
  total_file_uploads: number;
  history: number;
  total_history: number;
}

interface ConversationContextProps {
  conversationList: ConversationsByDate;
  setConversationList: React.Dispatch<
    React.SetStateAction<ConversationsByDate>
  >;
  usageData: UsageData;
  setUsageData: React.Dispatch<React.SetStateAction<UsageData>>;
  fetchUsage: () => Promise<void>;
}

const ConversationContext = createContext<ConversationContextProps | undefined>(
  undefined
);

export const useConversationContext = () => {
  const context = useContext(ConversationContext);
  if (context === undefined) {
    throw new Error(
      'useConversationContext must be used within a ConversationProvider'
    );
  }
  return context;
};

interface ConversationProviderProps {
  children: React.ReactNode;
}

export const ConversationProvider: React.FC<ConversationProviderProps> = ({
  children,
}) => {
  const [conversationList, setConversationList] = useState<ConversationsByDate>(
    {
      today: [],
      yesterday: [],
      last_7_days: [],
      before_that: [],
    }
  );
  const authenticatedFetch = useAuthenticatedFetch();
  const [usageData, setUsageData] = useState<UsageData>({
    chats: 0,
    total_chats: 0,
    file_uploads: 0,
    total_file_uploads: 0,
    history: 0,
    total_history: 0,
  });
  // const fetchUsage = async () => {
  //   try {
  //     const response = await authenticatedFetch('/api/chat/usage');
  //     if (!response) return;
  //     if (!response.ok) {
  //       throw new Error(
  //         `Failed to fetch conversations: ${response.statusText}`
  //       );
  //     }
  //     const data = await response.json();
  //     console.log('Usage of the user:', data);
  //   } catch (error) {
  //     console.error('Error fetching conversations:', error);
  //   }
  // };

  const fetchUsage = async () => {
    try {
      const response = await authenticatedFetch('/api/chat/usage');
      if (!response?.ok) {
        throw new Error(`Failed to fetch usage: ${response?.statusText}`);
      }
      const data = await response.json();
      setUsageData(data);
    } catch (error) {
      console.error('Error fetching usage:', error);
    }
  };

  useEffect(() => {
    fetchUsage();
  }, []);

  return (
    <ConversationContext.Provider
      value={{
        conversationList,
        setConversationList,
        usageData,
        setUsageData,
        fetchUsage,
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
};
