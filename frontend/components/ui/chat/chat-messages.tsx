'use client';

import { Loader2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '../button';
import ChatActions from './chat-actions';
import ChatMessage from './chat-message';
import { ChatHandler } from './chat.interface';
import { useClientConfig } from './hooks/use-config';
import Image from 'next/image';

export default function ChatMessages(
  props: Pick<
    ChatHandler,
    | 'messages'
    | 'isLoading'
    | 'reload'
    | 'stop'
    | 'append'
    | 'updateMessageContent'
  >
) {
  const { starterQuestions } = useClientConfig();
  const scrollableChatContainerRef = useRef<HTMLDivElement>(null);
  const messageLength = props.messages.length;
  const lastMessage = props.messages[messageLength - 1];
  const [isMobile, setIsMobile] = useState(false);
  const scrollToBottom = () => {
    if (scrollableChatContainerRef.current) {
      scrollableChatContainerRef.current.scrollTop =
        scrollableChatContainerRef.current.scrollHeight;
    }
  };

  const isLastMessageFromAssistant =
    messageLength > 0 && lastMessage?.role !== 'user';
  const showReload =
    props.reload && !props.isLoading && isLastMessageFromAssistant;
  const showStop = props.stop && props.isLoading;

  // `isPending` indicate
  // that stream response is not yet received from the server,
  // so we show a loading indicator to give a better UX.
  const isPending = props.isLoading && !isLastMessageFromAssistant;

  useEffect(() => {
    scrollToBottom();
  }, [messageLength, lastMessage]);
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768); // Adjust this breakpoint as needed
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  return (
    <div
      className="flex-1 w-full p-4 relative overflow-y-auto"
      ref={scrollableChatContainerRef}
    >
      <div className="flex flex-col divide-y">
        {props.messages.map((m, i) => {
          const isLoadingMessage = i === messageLength - 1 && props.isLoading;
          return (
            <ChatMessage
              key={m.id}
              chatMessage={m}
              isLoading={isLoadingMessage}
              append={props.append!}
              updateMessageContent={props.updateMessageContent!}
            />
          );
        })}
        {isPending && (
          <div className="flex justify-center items-center pt-10">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        )}
      </div>
      {(showReload || showStop) && (
        <div className="flex justify-end py-4">
          <ChatActions
            reload={props.reload}
            stop={props.stop}
            showReload={showReload}
            showStop={showStop}
          />
        </div>
      )}
      {!messageLength && starterQuestions?.length && props.append && (
        <div className="absolute bottom-6 left-0 w-full">
          <div className="grid grid-cols-1 gap-2 mx-4 max-w-full overflow-auto">
            {starterQuestions
              .slice(0, isMobile ? 3 : starterQuestions.length)
              .map((question, i) => (
                <Button
                  variant="outline"
                  key={i}
                  onClick={() =>
                    props.append!({ role: 'user', content: question })
                  }
                  className="w-full whitespace-normal p-2 h-fit"
                >
                  {question}
                </Button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
