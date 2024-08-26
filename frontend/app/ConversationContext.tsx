'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

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

interface ConversationContextProps {
  conversationList: ConversationsByDate;
  setConversationList: React.Dispatch<
    React.SetStateAction<ConversationsByDate>
  >;
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <ConversationContext.Provider
      value={{
        conversationList,
        setConversationList,
        isSidebarOpen,
        setIsSidebarOpen,
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
};
