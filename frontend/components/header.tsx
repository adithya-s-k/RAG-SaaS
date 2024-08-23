'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from 'next-themes';

import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';
import { Github, Sun, Moon, Menu, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Header() {
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background backdrop-blur">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src={
                theme === 'dark'
                  ? '/images/logo_white.png'
                  : '/images/logo_dark.png'
              }
              alt="RAG SAAS Logo"
              width={32}
              height={32}
            />
            <span className="font-bold">RAG SAAS</span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme('light')}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('system')}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <a
            href="https://github.com/adithya-s-k/RAG-SaaS"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: 'outline', size: 'icon' }))}
          >
            <Github className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </a>
          <Button variant="ghost" asChild>
            <Link href="/signin">Sign In</Link>
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
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden">
          <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-background p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center space-x-2">
                <Image
                  src={
                    theme === 'dark'
                      ? '/images/logo_white.png'
                      : '/images/logo_dark.png'
                  }
                  alt="RAG SAAS Logo"
                  width={32}
                  height={32}
                />
                <span className="font-bold">RAG SAAS</span>
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
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
