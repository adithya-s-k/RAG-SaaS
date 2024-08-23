import { Check, Copy, Pencil, ThumbsDown, ThumbsUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Message } from 'ai';
import { Fragment } from 'react';
import { Button } from '../../button';
import { useCopyToClipboard } from '../hooks/use-copy-to-clipboard';
import {
  ChatHandler,
  DocumentFileData,
  EventData,
  ImageData,
  MessageAnnotation,
  MessageAnnotationType,
  SourceData,
  SuggestedQuestionsData,
  ToolData,
  getAnnotationData,
} from '../index';
import ChatAvatar from './chat-avatar';
import { ChatEvents } from './chat-events';
import { ChatFiles } from './chat-files';
import { ChatImage } from './chat-image';
import { ChatSources } from './chat-sources';
import { SuggestedQuestions } from './chat-suggestedQuestions';
import ChatTools from './chat-tools';
import Markdown from './markdown';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

type ContentDisplayConfig = {
  order: number;
  component: JSX.Element | null;
};

function ChatMessageContent({
  message,
  isLoading,
  append,
}: {
  message: Message;
  isLoading: boolean;
  append: Pick<ChatHandler, 'append'>['append'];
}) {
  const annotations = message.annotations as MessageAnnotation[] | undefined;
  if (!annotations?.length) return <Markdown content={message.content} />;

  const imageData = getAnnotationData<ImageData>(
    annotations,
    MessageAnnotationType.IMAGE
  );
  const contentFileData = getAnnotationData<DocumentFileData>(
    annotations,
    MessageAnnotationType.DOCUMENT_FILE
  );
  const eventData = getAnnotationData<EventData>(
    annotations,
    MessageAnnotationType.EVENTS
  );
  const sourceData = getAnnotationData<SourceData>(
    annotations,
    MessageAnnotationType.SOURCES
  );
  const toolData = getAnnotationData<ToolData>(
    annotations,
    MessageAnnotationType.TOOLS
  );
  const suggestedQuestionsData = getAnnotationData<SuggestedQuestionsData>(
    annotations,
    MessageAnnotationType.SUGGESTED_QUESTIONS
  );

  const contents: ContentDisplayConfig[] = [
    {
      order: 1,
      component: imageData[0] ? <ChatImage data={imageData[0]} /> : null,
    },
    {
      order: -3,
      component:
        eventData.length > 0 ? (
          <ChatEvents isLoading={isLoading} data={eventData} />
        ) : null,
    },
    {
      order: 2,
      component: contentFileData[0] ? (
        <ChatFiles data={contentFileData[0]} />
      ) : null,
    },
    {
      order: -1,
      component: toolData[0] ? <ChatTools data={toolData[0]} /> : null,
    },
    {
      order: 0,
      component: <Markdown content={message.content} />,
    },
    {
      order: 3,
      component: sourceData[0] ? <ChatSources data={sourceData[0]} /> : null,
    },
    {
      order: 4,
      component: suggestedQuestionsData[0] ? (
        <SuggestedQuestions
          questions={suggestedQuestionsData[0]}
          append={append}
        />
      ) : null,
    },
  ];

  return (
    <div className="flex-1 gap-4 flex flex-col">
      {contents
        .sort((a, b) => a.order - b.order)
        .map((content, index) => (
          <Fragment key={index}>{content.component}</Fragment>
        ))}
    </div>
  );
}

export default function ChatMessage({
  chatMessage,
  isLoading,
  append,
  updateMessageContent,
}: // onSave,
{
  chatMessage: Message;
  isLoading: boolean;
  append: Pick<ChatHandler, 'append'>['append'];
  updateMessageContent: (
    id: string,
    oldContent: string,
    newContent: string
  ) => void;
  // onSave: (newContent: string) => void; // Add onSave prop
}) {
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedContent, setEditedContent] = useState(chatMessage.content);
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 });

  const handleSave = () => {
    console.log(chatMessage.id);
    console.log('Handling edit');
    updateMessageContent(chatMessage.id, chatMessage.content, editedContent);
    // onSave(editedContent); // Use the onSave prop
    setIsModalOpen(false);
  };
  const messageClass = chatMessage.role === 'user' ? 'bg-gray-400/10' : '';

  return (
    <div
      className={`flex items-start gap-4 py-5 pl-2 md:pr-5 md:pt-5 md:pb-5 md:pl-4 rounded-md ${messageClass}`}
    >
      <ChatAvatar role={chatMessage.role} />
      <div className="group flex flex-1 justify-between gap-2">
        <ChatMessageContent
          message={chatMessage}
          isLoading={isLoading}
          append={append}
        />
        {chatMessage.role == 'assistant' ? (
          <>
            <div className="hidden md:flex flex-col h-fit">
              <Button
                onClick={() => copyToClipboard(chatMessage.content)}
                size="icon"
                variant="ghost"
                className="h-8 w-8 opacity-0 group-hover:opacity-100"
              >
                {isCopied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 opacity-0 group-hover:opacity-100"
                onClick={() => setIsLiked(!isLiked)}
              >
                {isLiked ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <ThumbsUp className="h-4 w-4" />
                )}
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 opacity-0 group-hover:opacity-100"
                onClick={() => setIsDisliked(!isDisliked)}
              >
                {isDisliked ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <ThumbsDown className="h-4 w-4" />
                )}
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="hidden md:flex flex-row h-fit">
              {/* <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 opacity-0 group-hover:opacity-100"
                // onClick={() => setIsDisliked(!isDisliked)}
              >
                <Pencil className="h-4 w-4" />
              </Button> */}
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100"
                    onClick={() => setIsModalOpen(true)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Prompt</DialogTitle>
                    <DialogDescription>
                      Modify the prompt content below:
                    </DialogDescription>
                  </DialogHeader>
                  <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="w-full h-32 p-2 border rounded"
                  />
                  <div className="flex justify-end mt-4 gap-2">
                    <Button onClick={() => setIsModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSave}>Save</Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Button
                onClick={() => copyToClipboard(chatMessage.content)}
                size="icon"
                variant="ghost"
                className="h-8 w-8 opacity-0 group-hover:opacity-100"
              >
                {isCopied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
