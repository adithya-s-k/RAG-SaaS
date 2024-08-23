import { User2 } from 'lucide-react';
import Image from 'next/image';

export default function ChatAvatar({ role }: { role: string }) {
  if (role === 'user') {
    return (
      <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border bg-background shadow">
        <User2 className="h-4 w-4" />
      </div>
    );
  }

  return (
    <div className="hidden md:flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border bg-white text-white shadow">
      <Image
        className="rounded-md"
        src="/logo.svg"
        alt="logo"
        width={24}
        height={24}
        priority
      />
    </div>
  );
}
