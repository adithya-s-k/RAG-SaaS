// 'use client';

// import * as React from 'react';
// import Link from 'next/link';
// import Image from 'next/image';
// import { useTheme } from 'next-themes';

// import { cn } from '@/lib/utils';
// import { Button, buttonVariants } from '@/components/ui/button';
// import { Github, Sun, Moon, Menu, X, AlignLeft } from 'lucide-react';

// export function Header() {
//   const { theme, setTheme } = useTheme();
//   const [isMenuOpen, setIsMenuOpen] = React.useState(false);

//   const toggleTheme = () => {
//     setTheme(theme === 'dark' ? 'light' : 'dark');
//   };

//   return (
//     <header className="sticky top-0 z-50 w-full border-b bg-background backdrop-blur">
//       <div className="container flex h-14 items-center justify-between">
//         <div className="flex items-center space-x-4">
//           {/* <Button variant="ghost" size="icon" className="md:hidden">
//             <AlignLeft className="h-5 w-5" />
//             <span className="sr-only">Toggle sidebar</span>
//           </Button> */}
//           <Link href="/" className="flex items-center space-x-2">
//             <Image
//               src={
//                 theme === 'dark'
//                   ? '/images/logo_white.png'
//                   : '/images/logo_dark.png'
//               }
//               alt="RAG SAAS Logo"
//               width={32}
//               height={32}
//             />
//             <span className="font-bold">RAG SAAS</span>
//           </Link>
//         </div>
//         <nav className="hidden md:flex items-center space-x-4">
//           <Button variant="outline" asChild>
//             <Link href="/signin">Sign In</Link>
//           </Button>
//           <a
//             href="https://github.com/adithya-s-k/RAG-SaaS"
//             target="_blank"
//             rel="noopener noreferrer"
//             className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }))}
//           >
//             <Github className="h-5 w-5" />
//             <span className="sr-only">GitHub</span>
//           </a>
//           <Button variant="ghost" size="icon" onClick={toggleTheme}>
//             {theme === 'dark' ? (
//               <Sun className="h-5 w-5" />
//             ) : (
//               <Moon className="h-5 w-5" />
//             )}
//             <span className="sr-only">Toggle theme</span>
//           </Button>
//         </nav>
//         <button
//           className="inline-flex items-center justify-center rounded-md p-2 text-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary md:hidden"
//           onClick={() => setIsMenuOpen(!isMenuOpen)}
//         >
//           <span className="sr-only">Toggle menu</span>
//           {isMenuOpen ? (
//             <X className="h-6 w-6" aria-hidden="true" />
//           ) : (
//             <Menu className="h-6 w-6" aria-hidden="true" />
//           )}
//         </button>
//       </div>
//       {isMenuOpen && (
//         <div className="fixed inset-0 z-50 bg-background backdrop-blur-sm md:hidden w-screen">
//           <div className="fixed inset-y-0 right-0 bg-muted p-6 shadow-lg h-fit w-screen">
//             <div className="flex items-center justify-between">
//               <Link href="/" className="flex items-center space-x-2">
//                 <Image
//                   src={
//                     theme === 'dark'
//                       ? '/images/logo_white.png'
//                       : '/images/logo_dark.png'
//                   }
//                   alt="RAG SAAS Logo"
//                   width={32}
//                   height={32}
//                 />
//                 <span className="font-bold">RAG SAAS</span>
//               </Link>
//               <button
//                 className="rounded-md p-2 text-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
//                 onClick={() => setIsMenuOpen(false)}
//               >
//                 <span className="sr-only">Close menu</span>
//                 <X className="h-6 w-6" aria-hidden="true" />
//               </button>
//             </div>
//             <div className="mt-6 flow-root">
//               <div className="space-y-4">
//                 <Button
//                   variant="ghost"
//                   asChild
//                   className="w-full justify-start"
//                 >
//                   <Link href="/signin">Sign In</Link>
//                 </Button>
//                 <a
//                   href="https://github.com/adithya-s-k/RAG-SaaS"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className={cn(
//                     buttonVariants({ variant: 'outline' }),
//                     'w-full justify-start'
//                   )}
//                 >
//                   <Github className="mr-2 h-5 w-5" />
//                   GitHub
//                 </a>
//                 <Button
//                   variant="ghost"
//                   onClick={toggleTheme}
//                   className="w-full justify-start"
//                 >
//                   {theme === 'dark' ? (
//                     <>
//                       <Sun className="mr-2 h-5 w-5" />
//                       Light Mode
//                     </>
//                   ) : (
//                     <>
//                       <Moon className="mr-2 h-5 w-5" />
//                       Dark Mode
//                     </>
//                   )}
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </header>
//   );
// }

'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from 'next-themes';

import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';
import ShinyButton from '@/components/magicui/shiny-button';

import {
  Github,
  Sun,
  Moon,
  Menu,
  X,
  AlignLeft,
  MessageSquare,
} from 'lucide-react';

export function Header() {
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChatHistoryOpen, setIsChatHistoryOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const toggleChatHistory = () => {
    setIsChatHistoryOpen(!isChatHistoryOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background backdrop-blur">
      <div className="px-4 flex h-14 items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <Image
              src={
                theme == 'dark'
                  ? '/images/logo_light.png'
                  : '/images/logo_dark.png'
              }
              alt="RAG SAAS Logo"
              width={200}
              height={100}
            />
          </Link>
          <Link href="/chat">
            <Button variant="ghost" size="icon" onClick={toggleChatHistory}>
              <MessageSquare className="h-5 w-5" />
              <span className="sr-only">Toggle chat history</span>
            </Button>
          </Link>
        </div>
        <nav className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/features">Features</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/signin">Sign In</Link>
          </Button>
          <a
            href="https://github.com/adithya-s-k/RAG-SaaS"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ShinyButton text="Star us on Github ⭐" className="" />
          </a>
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </nav>
        <button
          className="inline-flex items-center justify-center rounded-md p-2 text-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className="sr-only">Toggle menu</span>
          {isMenuOpen ? (
            <X className="h-6 w-6" aria-hidden="true" />
          ) : (
            <Menu className="h-6 w-6" aria-hidden="true" />
          )}
        </button>
      </div>
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-background backdrop-blur-sm md:hidden w-screen">
          <div className="fixed inset-y-0 right-0 bg-muted p-6 shadow-lg h-fit w-screen">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center space-x-2">
                <Image
                  src={
                    theme === 'dark'
                      ? '/images/logo_light.png'
                      : '/images/logo_dark.png'
                  }
                  alt="RAG SAAS Logo"
                  width={32}
                  height={32}
                />
              </Link>
              <button
                className="rounded-md p-2 text-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="space-y-4">
                <Button
                  variant="ghost"
                  asChild
                  className="w-full justify-start"
                >
                  <Link href="/features">Features</Link>
                </Button>
                <Button
                  variant="ghost"
                  asChild
                  className="w-full justify-start"
                >
                  <Link href="/signin">Sign In</Link>
                </Button>
                <a
                  href="https://github.com/adithya-s-k/RAG-SaaS"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    buttonVariants({ variant: 'outline' }),
                    'w-full justify-start'
                  )}
                >
                  <Github className="mr-2 h-5 w-5" />
                  GitHub
                </a>
                <Button
                  variant="ghost"
                  onClick={toggleTheme}
                  className="w-full justify-start"
                >
                  {theme === 'dark' ? (
                    <>
                      <Sun className="mr-2 h-5 w-5" />
                      Light Mode
                    </>
                  ) : (
                    <>
                      <Moon className="mr-2 h-5 w-5" />
                      Dark Mode
                    </>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  onClick={toggleChatHistory}
                  className="w-full justify-start"
                >
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Toggle Chat History
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
