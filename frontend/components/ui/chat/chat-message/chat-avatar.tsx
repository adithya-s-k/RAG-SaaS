import { User2 } from 'lucide-react';
import Image from 'next/image';
import { useTheme } from 'next-themes';

export default function ChatAvatar({ role }: { role: string }) {
  const { theme, setTheme } = useTheme();
  if (role === 'user') {
    return (
      <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border bg-background shadow">
        <User2 className="h-4 w-4" />
      </div>
    );
  }

  return (
    <div className="hidden md:flex h-fit w-fit shrink-0 select-none items-center justify-center rounded-xl border bg-white text-white shadow">
      <Image
        src={
          theme == 'dark' ? '/images/icon_light.png' : '/images/icon_dark.png'
        }
        alt="logo"
        width={30}
        height={30}
        priority
      />
    </div>
  );
}
