'use client';

import Link from 'next/link';

import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { HoverEffect } from '@/components/ui/card-hover-effect';
import { Features } from '@/config/features';
import ShimmerButton from '@/components/magicui/shimmer-button';

// async function getGitHubStars(): Promise<string | null> {
//   try {
//     const response = await fetch(
//       'https://api.github.com/repos/shadcn/taxonomy',
//       {
//         headers: {
//           Accept: 'application/vnd.github+json',
//           Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
//         },
//         next: {
//           revalidate: 60,
//         },
//       }
//     );

//     if (!response?.ok) {
//       return null;
//     }

//     const json = await response.json();

//     return parseInt(json['stargazers_count']).toLocaleString();
//   } catch (error) {
//     return null;
//   }
// }

// eslint-disable-next-line @next/next/no-async-client-component
export default function IndexPage() {
  // const stars = await getGitHubStars();

  return (
    <>
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <Link
            href={siteConfig.links.twitter}
            className="rounded-2xlpx-4 py-1.5 text-sm font-medium"
            target="_blank"
          >
            <button className="bg-slate-800 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-full p-px text-xs font-semibold leading-6  text-white inline-block">
              <span className="absolute inset-0 overflow-hidden rounded-full">
                <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </span>
              <div className="relative flex space-x-2 items-center z-10 rounded-full bg-zinc-950 py-0.5 px-4 ring-1 ring-white/10 ">
                <span> Follow on Twitter</span>
                <svg
                  fill="none"
                  height="16"
                  viewBox="0 0 24 24"
                  width="16"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10.75 8.75L14.25 12L10.75 15.25"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
              <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40" />
            </button>
          </Link>

          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
            Ship RAG Solutions ⚡Quickly
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            RAG-SaaS offers a ready-to-use template for building
            Retrieval-Augmented Generation applications. It streamlines
            deployment for developers, handling infrastructure so you can focus
            on your RAG system.
          </p>
          <div className="space-x-4">
            <Link href="/signin" className={cn(buttonVariants({ size: 'lg' }))}>
              Get Started
            </Link>
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
              className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}
            >
              GitHub
            </Link>
          </div>
        </div>
      </section>
      <section
        id="features"
        className="container space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24"
      >
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            Features
          </h2>
        </div>
        <HoverEffect items={Features} />
      </section>
      <section id="open-source" className="container py-8 md:py-12 lg:py-24 ">
        <div className="container mx-auto px-4 py-8 flex flex-col justify-center items-center">
          <h2 className="text-3xl font-bold mb-4">Proudly Open Source</h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7 mb-4">
            RAG-SaaS is open source and powered by open source software.
          </p>
          <ul className="list-none space-y-2 mb-4">
            <li>
              <span className="mr-2">🦙</span>
              <strong>LlamaIndex:</strong> For building and deploying RAG
              pipelines
            </li>
            <li>
              <span className="mr-2">📦</span>
              <strong>MongoDB:</strong> Used as both a normal database and a
              vector database
            </li>
            <li>
              <span className="mr-2">⚡</span>
              <strong>FastAPI:</strong> Backend API framework
            </li>
            <li>
              <span className="mr-2">⚛️</span>
              <strong>Next.js:</strong> Frontend framework
            </li>
          </ul>
          <p className="text-muted-foreground sm:text-lg sm:leading-7">
            The code is available on{' '}
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4"
            >
              GitHub
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
