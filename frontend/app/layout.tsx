import type { Metadata } from 'next';
// import { Inter } from 'next/font/google';
import { Roboto } from 'next/font/google';
import { AuthProvider } from '@/app/authProvider';
import { ConversationProvider } from '@/app/ConversationContext';
import { Analytics } from '@/components/analytics';
import { siteConfig } from '@/config/site';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';
import { Header } from '@/components/header';

const roboto = Roboto({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(`${siteConfig.url}`),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ['RAG', 'SAAS', 'RAG SAAS', 'AI SAAS', 'llamaindex'],
  authors: [
    {
      name: 'Adithya S Kolavi',
      url: 'https://adithyask.com',
    },
  ],
  creator: 'Adithya S K',
};

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <Analytics />
        <AuthProvider>
          <ConversationProvider>
            <body className={`${roboto.className} flex flex-col h-screen`}>
              <Toaster position="top-right" />
              <Header />
              <main className="h-full overflow-x-hidden">{children}</main>
            </body>
          </ConversationProvider>
        </AuthProvider>
      </ThemeProvider>
    </html>
  );
}
