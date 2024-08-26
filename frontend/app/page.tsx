// // page.tsx
// 'use client';

// import { Button } from '@/components/ui/button';
// import Image from 'next/image';
// import { useTheme } from 'next-themes';
// import { PlaceholdersAndVanishInput } from '@/components/ui/placeholders-and-vanish-input';
// import { Suspense, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import Loading from '@/components/loading';
// import { useAuth } from '@/app/authProvider';
// import Ripple from '@/components/magicui/ripple';
// import AnimatedGradientText from '@/components/magicui/animated-gradient-text';
// import { cn } from '@/lib/utils';
// import { ChevronRight } from 'lucide-react';
// import HyperText from '@/components/magicui/hyper-text';
// import GradualSpacing from '@/components/magicui/gradual-spacing';

// function HomeContent() {
//   const { theme, setTheme } = useTheme();
//   const [inputValue, setInputValue] = useState('');
//   const { isAuthenticated } = useAuth();
//   const router = useRouter();

//   const placeholders = [
//     'Hello there how are you doing',
//     'Tell me more about ...',
//   ];

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setInputValue(e.target.value);
//   };

//   const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     setTimeout(() => {
//       if (isAuthenticated) {
//         router.push(`/chat?query=${encodeURIComponent(inputValue)}`);
//       } else {
//         router.push(`/signin`);
//       }
//     }, 1500);
//   };

//   return (
//     <div className="h-full flex flex-col justify-center items-center relative">
//       <Ripple />
//       <div className="z-10 flex  items-center justify-center p-2">
//         <AnimatedGradientText>
//           ⚡ <hr className="mx-2 h-4 w-[1px] shrink-0 bg-gray-300" />{' '}
//           <span
//             className={cn(
//               `inline animate-gradient bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`
//             )}
//           >
//             Introducing RAG SAAS
//           </span>
//           <ChevronRight className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
//         </AnimatedGradientText>
//       </div>
//       <GradualSpacing
//         className="text-2xl md:text-4xl font-bold text-black dark:text-white w-full "
//         text="Ship RAG Solutions Quickly"
//       />
//       <div className="w-full md:w-[60%] p-4">
//         <PlaceholdersAndVanishInput
//           placeholders={placeholders}
//           onChange={handleChange}
//           onSubmit={onSubmit}
//           value={inputValue}
//           setValue={setInputValue}
//         />
//       </div>
//     </div>
//   );
// }

// export default function Home() {
//   return (
//     <Suspense fallback={<Loading />}>
//       <HomeContent />
//     </Suspense>
//   );
// }

// 'use client';

// import { Button } from '@/components/ui/button';
// import Image from 'next/image';
// import { useTheme } from 'next-themes';
// import { PlaceholdersAndVanishInput } from '@/components/ui/placeholders-and-vanish-input';
// import { Suspense, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import Loading from '@/components/loading';
// import { useAuth } from '@/app/authProvider';
// import Ripple from '@/components/magicui/ripple';
// import AnimatedGradientText from '@/components/magicui/animated-gradient-text';
// import { cn } from '@/lib/utils';
// import { ChevronRight } from 'lucide-react';
// import HyperText from '@/components/magicui/hyper-text';
// import GradualSpacing from '@/components/magicui/gradual-spacing';

// function HomeContent() {
//   const { theme, setTheme } = useTheme();
//   const [inputValue, setInputValue] = useState('');
//   const { isAuthenticated } = useAuth();
//   const router = useRouter();

//   const placeholders = [
//     'Hello there how are you doing',
//     'Tell me more about ...',
//   ];

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setInputValue(e.target.value);
//   };

//   const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     setTimeout(() => {
//       if (isAuthenticated) {
//         router.push(`/chat?query=${encodeURIComponent(inputValue)}`);
//       } else {
//         router.push(`/signin`);
//       }
//     }, 1500);
//   };

//   return (
//     <div className="h-full flex flex-col justify-center items-center relative">
//       <Ripple />
//       <div className="z-10 flex items-center justify-center p-2 ">
//         <AnimatedGradientText>
//           ⚡ <hr className="mx-2 h-4 w-[1px] shrink-0 bg-gray-300" />{' '}
//           <span
//             className={cn(
//               `inline animate-gradient bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`
//             )}
//           >
//             Ship RAG Solutions Quickly
//           </span>
//           <ChevronRight className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
//         </AnimatedGradientText>
//       </div>
//       <div className="relative w-full aspect-square max-w-[250px] h-fit">
//         <Image
//           src={
//             theme === 'dark'
//               ? '/images/banner_dark.png'
//               : '/images/banner_light.png'
//           }
//           alt="RAG SAAS Logo"
//           layout="fill"
//           objectFit="contain"
//           priority
//         />
//       </div>

//       <div className="w-full md:w-[70%] p-4">
//         <PlaceholdersAndVanishInput
//           placeholders={placeholders}
//           onChange={handleChange}
//           onSubmit={onSubmit}
//           value={inputValue}
//           setValue={setInputValue}
//         />
//       </div>
//     </div>
//   );
// }

// export default function Home() {
//   return (
//     <Suspense fallback={<Loading />}>
//       <HomeContent />
//     </Suspense>
//   );
// }

'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { PlaceholdersAndVanishInput } from '@/components/ui/placeholders-and-vanish-input';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/authProvider';
import Ripple from '@/components/magicui/ripple';
import AnimatedGradientText from '@/components/magicui/animated-gradient-text';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';

function HomeContent() {
  const { theme } = useTheme();
  const [inputValue, setInputValue] = useState('');
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [isAnimating, setIsAnimating] = useState(false);

  const placeholders = [
    'Hello there how are you doing',
    'Tell me more about ...',
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsAnimating(true);

    setTimeout(() => {
      if (isAuthenticated) {
        router.push(`/chat?query=${encodeURIComponent(inputValue)}`);
      } else {
        router.push(`/signin`);
      }
    }, 1500);
  };

  return (
    <div className="h-full flex flex-col justify-center items-center relative">
      <Ripple />
      <div
        className={`z-10 flex items-center justify-center p-2 transition-all duration-500 ${
          isAnimating ? 'opacity-0 -translate-y-10' : ''
        }`}
      >
        <AnimatedGradientText>
          ⚡ <hr className="mx-2 h-4 w-[1px] shrink-0 bg-gray-300" />{' '}
          <span
            className={cn(
              `inline animate-gradient bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`
            )}
          >
            Ship RAG Solutions Quickly
          </span>
          <ChevronRight className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
        </AnimatedGradientText>
      </div>
      <div
        className={`relative w-full aspect-square max-w-[250px] h-fit transition-all duration-500 ${
          isAnimating ? 'opacity-0 -translate-y-10' : ''
        }`}
      >
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

      <div
        className={`w-full md:w-[70%] p-4 transition-all duration-500 ${
          isAnimating ? 'md:translate-y-24 lg:md:translate-y-36' : ''
        }`}
      >
        <PlaceholdersAndVanishInput
          placeholders={placeholders}
          onChange={handleChange}
          onSubmit={onSubmit}
          value={inputValue}
          setValue={setInputValue}
        />
      </div>
    </div>
  );
}

export default HomeContent;
