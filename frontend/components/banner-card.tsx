import React from 'react';
import { Github, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button, buttonVariants } from './ui/button';
import { cn } from '@/lib/utils';
import { siteConfig } from '@/config/site';
import { useTheme } from 'next-themes';
import ShinyButton from './magicui/shiny-button';

const BannerCard: React.FC = () => {
  const { theme, setTheme } = useTheme();
  return (
    <div className="relative h-fit md:1/2 lg:w-2/5 overflow-hidden rounded-xl drop-shadow-md">
      <div className="relative z-10 p-4 bg-background/80 backdrop-blur-sm flex flex-col justify-center items-center gap-6">
        <Image
          src={
            theme === 'dark'
              ? '/images/banner_dark.png'
              : '/images/banner_light.png'
          }
          alt="Image"
          width="1080"
          height="1080"
          className="object-contain px-16"
        />
        <h3 className="text-lg font-semibold w-full text-center">
          Ship RAG Solutions ⚡Quickly
        </h3>
        <Link
          href={siteConfig.links.github}
          target="_blank"
          className="w-full flex items-center justify-center"
        >
          <ShinyButton text="⭐ STAR US ON GITHUB " className="" />
        </Link>
      </div>
    </div>
  );
};

export default BannerCard;
