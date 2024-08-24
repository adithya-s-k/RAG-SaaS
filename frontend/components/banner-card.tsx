import React from 'react';
import { Github, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button, buttonVariants } from './ui/button';
import { cn } from '@/lib/utils';
import { siteConfig } from '@/config/site';
import { useTheme } from 'next-themes';

const BannerCard: React.FC = () => {
  const { theme, setTheme } = useTheme();
  return (
    <div className="h-fit w-1/2 p-10 shadow-md bg-background rounded-xl  flex flex-col justify-center items-center gap-6">
      <Image
        src={
          theme === 'dark'
            ? '/images/banner_dark.png'
            : '/images/banner_light.png'
        }
        alt="Image"
        width="1080"
        height="1080"
        className="object-contain "
      />
      <h3>Proudly Open Source</h3>
      <Link href={siteConfig.links.github} target="_blank" className="w-full">
        <Button
          className={cn(
            buttonVariants({ variant: 'outline', size: 'icon' }),
            'w-full text-primary'
          )}
        >
          <Github className="mr-2 h-5 w-5" />
          Github
        </Button>
      </Link>
    </div>
  );
};

export default BannerCard;
