import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/app/authProvider';
import { ConversationProvider } from '@/app/ConversationContext';
import { Analytics } from '@/components/analytics';
import { siteConfig } from '@/config/site';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';
import { Header } from '@/components/header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  ),
  // ... rest of your metadata
};
// export const metadata: Metadata = {
//   metadataBase: process.env.VERCEL_URL
//     ? new URL(`https://${process.env.VERCEL_URL}`)
//     : undefined,
//   title: {
//     default: siteConfig.name,
//     template: `%s | ${siteConfig.name}`,
//   },
//   description: siteConfig.description,
//   keywords: ['RAG', 'SAAS', 'RAG SAAS', 'AI SAAS', 'llamaindex'],
//   authors: [
//     {
//       name: 'Adithya S Kolavi',
//       url: 'https://adithyask.com',
//     },
//   ],
//   creator: 'Adithya S K',
//   manifest: `${siteConfig.url}/site.webmanifest`,
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <Analytics />
        <AuthProvider>
          <ConversationProvider>
            <body className={`${inter.className} flex flex-col h-screen`}>
              <Toaster position="top-center" />
              <Header />
              <main className="h-full overflow-y-hidden overflow-x-hidden">
                {children}
              </main>
            </body>
          </ConversationProvider>
        </AuthProvider>
      </ThemeProvider>
    </html>
  );
}
