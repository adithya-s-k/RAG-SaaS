// "use client";

// import { useEffect, useMemo, useState } from "react";

// export interface ChatConfig {
//   backend?: string;
//   starterQuestions?: string[];
// }

// export function useClientConfig(): ChatConfig {
//   const chatAPI = process.env.NEXT_PUBLIC_CHAT_API;
//   const [config, setConfig] = useState<ChatConfig>();

//   const backendOrigin = useMemo(() => {
//     return chatAPI ? new URL(chatAPI).origin : "";
//   }, [chatAPI]);

//   const configAPI = `${backendOrigin}/api/chat/config`;

//   useEffect(() => {
//     fetch(configAPI)
//       .then((response) => response.json())
//       .then((data) => setConfig({ ...data, chatAPI }))
//       .catch((error) => console.error("Error fetching config", error));
//   }, [chatAPI, configAPI]);

//   return {
//     backend: backendOrigin,
//     starterQuestions: config?.starterQuestions,
//   };
// }

'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/app/authProvider'; // Make sure to import useAuth from your AuthContext
import { useRouter } from 'next/navigation';

export interface ChatConfig {
  backend?: string;
  starterQuestions?: string[];
}

export function useClientConfig(): ChatConfig {
  const chatAPI = process.env.NEXT_PUBLIC_CHAT_API;
  const [config, setConfig] = useState<ChatConfig>();
  const { accessToken } = useAuth(); // Get the access token from the auth context
  const router = useRouter();
  const backendOrigin = useMemo(() => {
    return chatAPI ? new URL(chatAPI).origin : '';
  }, [chatAPI]);

  const configAPI = `${backendOrigin}/api/chat/config`;

  useEffect(() => {
    if (!accessToken) return; // Don't fetch if there's no access token

    fetch(configAPI, {
      headers: {
        Authorization: `Bearer ${accessToken}`, // Include the access token in the request
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => setConfig({ ...data, chatAPI }))
      .catch((error) => console.error('Error fetching config', error))
      .catch((error) => {
        router.push(`/signin`);
      });
  }, [chatAPI, configAPI, accessToken]);

  return {
    backend: backendOrigin,
    starterQuestions: config?.starterQuestions,
  };
}
