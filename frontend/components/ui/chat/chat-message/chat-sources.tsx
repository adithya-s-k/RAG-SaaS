'use client';
'use client';
import React, { useMemo } from 'react';
import { Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { useCopyToClipboard } from '../hooks/use-copy-to-clipboard';
import PdfDialog from '../widgets/PdfDialog';

const SCORE_THRESHOLD = 0.3;

interface SourceNode {
  id: string;
  metadata: {
    url?: string;
    [key: string]: unknown;
  };
  score?: number;
  url?: string;
}

interface SourceData {
  nodes: SourceNode[];
}

interface NodeInfo {
  id: string;
  url?: string;
  metadata: {
    url?: string;
    [key: string]: unknown;
  };
}

interface SourceNumberButtonProps {
  index: number;
}

function SourceNumberButton({ index }: SourceNumberButtonProps) {
  return (
    <div className="text-xs w-5 h-5 rounded-full text-accent-foreground bg-background mb-2 flex items-center justify-center hover:text-primary-foreground hover:bg-secondary-foreground hover:cursor-pointer">
      {index + 1}
    </div>
  );
}

function prefixUrl(url: string): string {
  if (url.match(/^\/api\/file/)) {
    return `${process.env.NEXT_PUBLIC_SERVER_URL}${url}`;
  }
  return url;
}

interface NodeInfoProps {
  nodeInfo: NodeInfo;
}

function NodeInfo({ nodeInfo }: NodeInfoProps) {
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 1000 });
  const originalUrl = nodeInfo.metadata?.url || nodeInfo.url;
  const url = originalUrl ? prefixUrl(originalUrl) : undefined;

  if (url) {
    return (
      <div className="flex items-center my-2">
        <a
          className="hover:text-blue-900 truncate"
          href={url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>{url}</span>
        </a>
        <Button
          onClick={() => copyToClipboard(url)}
          size="icon"
          variant="ghost"
          className="h-12 w-12 shrink-0"
        >
          {isCopied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
    );
  }

  return (
    <p>
      Sorry, unknown node type. Please add a new renderer in the NodeInfo
      component.
    </p>
  );
}

interface ChatSourcesProps {
  data: SourceData;
}

export function ChatSources({ data }: ChatSourcesProps) {
  const sources: NodeInfo[] = useMemo(() => {
    const nodesByPath: Record<string, NodeInfo> = {};

    data.nodes
      .filter((node) => (node.score ?? 1) > SCORE_THRESHOLD)
      .sort((a, b) => (b.score ?? 1) - (a.score ?? 1))
      .forEach((node) => {
        const nodeInfo: NodeInfo = {
          id: node.id,
          url: node.metadata?.url || node.url,
          metadata: node.metadata,
        };
        const key = nodeInfo.url ?? nodeInfo.id;
        if (!nodesByPath[key]) {
          nodesByPath[key] = nodeInfo;
        }
      });

    return Object.values(nodesByPath);
  }, [data.nodes]);

  if (sources.length === 0) return null;

  return (
    <div className="space-x-2 text-sm">
      <span className="font-semibold">Sources:</span>
      <div className="inline-flex gap-1 items-center">
        {sources.map((nodeInfo, index) => {
          const originalUrl = nodeInfo.metadata?.url || nodeInfo.url;
          const url = originalUrl ? prefixUrl(originalUrl) : undefined;
          if (url?.endsWith('.pdf')) {
            return (
              <PdfDialog
                key={nodeInfo.id}
                documentId={nodeInfo.id}
                url={url}
                trigger={<SourceNumberButton index={index} />}
              />
            );
          }
          return (
            <div key={nodeInfo.id}>
              <HoverCard>
                <HoverCardTrigger>
                  <SourceNumberButton index={index} />
                </HoverCardTrigger>
                <HoverCardContent className="w-[320px]">
                  <NodeInfo nodeInfo={nodeInfo} />
                </HoverCardContent>
              </HoverCard>
            </div>
          );
        })}
      </div>
    </div>
  );
}
