'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useAuth } from '@/app/authProvider';
import { useConversationContext } from '@/app/ConversationContext';
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
  LogOut,
  User,
  PanelRightClose,
  PanelLeft,
} from 'lucide-react';
import { Separator } from './ui/separator';

export function Header() {
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChatHistoryOpen, setIsChatHistoryOpen] = useState(false);
  const { isAuthenticated, logout, firstName } = useAuth();
  const { isSidebarOpen, setIsSidebarOpen } = useConversationContext();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background backdrop-blur">
      <div className="px-4 flex h-14 items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="bg-muted"
            onClick={toggleSidebar}
          >
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
          <Link href="/" className="flex items-center">
            <Image
              src={
                theme == 'dark'
                  ? '/images/logo_light.png'
                  : '/images/logo_dark.png'
              }
              alt="RAG SAAS Logo"
              width={200}
              height={70}
            />
          </Link>
        </div>
        <nav className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/features">Features</Link>
          </Button>
          <a
            href="https://github.com/adithya-s-k/RAG-SaaS"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ShinyButton text="Github ⭐" className="" />
          </a>
          {isAuthenticated ? (
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <Button variant="outline" asChild>
              <Link href="/signin">Sign In</Link>
            </Button>
          )}
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
        <div className="fixed inset-0 z-50  backdrop-blur-sm md:hidden w-screen">
          <div className="fixed inset-y-0 right-0 bg-primary-foreground p-2 shadow-lg h-fit w-screen">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center space-x-2">
                <Image
                  src={
                    theme === 'dark'
                      ? '/images/logo_light.png'
                      : '/images/logo_dark.png'
                  }
                  alt="RAG SAAS Logo"
                  width={200}
                  height={100}
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
                {isAuthenticated ? (
                  <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="w-full justify-start"
                  >
                    Logout
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    asChild
                    className="w-full justify-start"
                  >
                    <Link href="/signin">Sign In</Link>
                  </Button>
                )}
                <Separator />
                <Link
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
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
