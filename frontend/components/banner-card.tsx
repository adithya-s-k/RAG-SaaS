// import React from 'react';
// import { Github, Loader2 } from 'lucide-react';
// import Image from 'next/image';
// import Link from 'next/link';
// import { Button, buttonVariants } from './ui/button';
// import { cn } from '@/lib/utils';
// import { siteConfig } from '@/config/site';
// import { useTheme } from 'next-themes';
// import ShinyButton from './magicui/shiny-button';

// const BannerCard: React.FC = () => {
//   const { theme, setTheme } = useTheme();
//   return (
//     <div className="relative h-fit md:1/2 lg:w-2/5 overflow-hidden rounded-2xl border-2 border-slate-500/10">
//       <div className="relative z-10  p-14 bg-background backdrop-blur-sm flex flex-col justify-center items-center gap-6">
//         <Image
//           src={
//             theme === 'dark'
//               ? '/images/banner_dark.png'
//               : '/images/banner_light.png'
//           }
//           alt="Image"
//           width="1080"
//           height="1080"
//           className="object-contain px-16"
//         />
//         <h3 className="text-lg font-semibold w-full text-center">
//           Ship RAG Solutions ⚡Quickly
//         </h3>
//         <Link
//           href={siteConfig.links.github}
//           target="_blank"
//           className="w-full flex items-center justify-center"
//         >
//           <ShinyButton text="⭐ STAR US ON GITHUB " className="" />
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default BannerCard;

import React from 'react';
import { Github, Zap } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import ShinyButton from './magicui/shiny-button';
import { siteConfig } from '@/config/site';
import HyperText from './magicui/hyper-text';

const BannerCard: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl border-2 border-primary/10 bg-card text-card-foreground shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative z-10 p-6 sm:p-6 flex flex-col justify-center items-center gap-4">
        <div className="relative w-full aspect-square max-w-[180px]">
          <Image
            src={
              theme === 'dark'
                ? '/images/banner_dark.png'
                : '/images/banner_light.png'
            }
            alt="RAG SAAS Logo"
            layout="fill"
            objectFit="contain"
            priority
          />
        </div>
        <h3 className="text-2xl font-bold text-center">
          Ship RAG Solutions{' '}
          <Zap className="inline-block w-6 h-6 text-yellow-400" /> Quickly
        </h3>

        <Link
          href={siteConfig.links.github}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center"
        >
          <ShinyButton text="⭐ STAR US ON GITHUB " className="" />
        </Link>
      </div>
      <div
        className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5"
        style={{
          maskImage:
            'radial-gradient(circle at center, transparent 0%, black 80%)',
          WebkitMaskImage:
            'radial-gradient(circle at center, transparent 0%, black 80%)',
        }}
      />
    </motion.div>
  );
};

export default BannerCard;
