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

import { Github, Menu, X, PanelLeft } from 'lucide-react';
import { Separator } from './ui/separator';
import { siteConfig } from '@/config/site';

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AuthContextType {
  isAuthenticated: boolean;
  logout: () => void;
}

export function MobileNavigation({
  isOpen,
  onClose,
}: MobileNavigationProps): JSX.Element | null {
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 mt-14">
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-10"
        onClick={onClose}
      />
      <div className="absolute inset-x-0 top-0 bg-background border-t px-4 shadow-lg">
        <div className="mt-4 space-y-4">
          <Button variant="outline" asChild className="w-full justify-start">
            <Link href="/features">Features</Link>
          </Button>
          {isAuthenticated ? (
            <Button
              variant="outline"
              onClick={handleLogout}
              className="w-full justify-start"
            >
              Logout
            </Button>
          ) : (
            <Button variant="ghost" asChild className="w-full justify-start">
              <Link href="/signin">Sign In</Link>
            </Button>
          )}
          <Separator />
          <Link
            href={siteConfig.links.github}
            target="_blank"
            className="w-full"
          >
            <ShinyButton
              text="⭐ STAR US ON GITHUB "
              className="w-full my-4 py-2"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}

export function Header() {
  const { theme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout, firstName } = useAuth();
  const { isSidebarOpen, setIsSidebarOpen } = useConversationContext();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <>
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
            {/* {isAuthenticated && (
            <Button
              variant="ghost"
              size="icon"
              className="bg-muted"
              onClick={toggleSidebar}
            >
              <PanelLeft className="h-5 w-5" />
              <span className="sr-only">Toggle sidebar</span>
            </Button>
          )} */}
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
            <Button variant="link" asChild>
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
      </header>
      <MobileNavigation
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </>
  );
}
