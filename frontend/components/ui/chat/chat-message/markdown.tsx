// import 'katex/dist/katex.min.css';
// import { FC, memo } from 'react';
// import ReactMarkdown, { Options } from 'react-markdown';
// import rehypeKatex from 'rehype-katex';
// import remarkGfm from 'remark-gfm';
// import remarkMath from 'remark-math';

// import { CodeBlock } from './codeblock';
// import Link from 'next/link';

// const MemoizedReactMarkdown: FC<Options> = memo(
//   ReactMarkdown,
//   (prevProps, nextProps) =>
//     prevProps.children === nextProps.children &&
//     prevProps.className === nextProps.className
// );

// const preprocessLaTeX = (content: string) => {
//   // Replace block-level LaTeX delimiters \[ \] with $$ $$
//   const blockProcessedContent = content.replace(
//     /\\\[([\s\S]*?)\\\]/g,
//     (_, equation) => `$$${equation}$$`
//   );
//   // Replace inline LaTeX delimiters \( \) with $ $
//   const inlineProcessedContent = blockProcessedContent.replace(
//     /\\\[([\s\S]*?)\\\]/g,
//     (_, equation) => `$${equation}$`
//   );
//   return inlineProcessedContent;
// };

// const preprocessMedia = (content: string) => {
//   // Remove `sandbox:` from the beginning of the URL
//   // to fix OpenAI's models issue appending `sandbox:` to the relative URL
//   return content.replace(/(sandbox|attachment|snt):/g, '');
// };

// const preprocessContent = (content: string) => {
//   return preprocessMedia(preprocessLaTeX(content));
// };

// export default function Markdown({ content }: { content: string }) {
//   const processedContent = preprocessContent(content);

//   return (
//     <MemoizedReactMarkdown
//       className="prose dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 break-words custom-markdown"
//       remarkPlugins={[remarkGfm, remarkMath]}
//       rehypePlugins={[rehypeKatex as any]}
//       components={{
//         p({ children }) {
//           return <p className="mb-2 last:mb-0">{children}</p>;
//         },

//         a: ({ children, href, ...props }) => (
//           <a
//             href={href}
//             target="_blank"
//             className="text-blue-400 hover:underline"
//             {...props}
//           >
//             {children}
//           </a>
//         ),

//         code({ node, inline, className, children, ...props }) {
//           if (children.length) {
//             if (children[0] == '▍') {
//               return (
//                 <span className="mt-1 animate-pulse cursor-default">▍</span>
//               );
//             }

//             children[0] = (children[0] as string).replace('`▍`', '▍');
//           }

//           const match = /language-(\w+)/.exec(className || '');

//           if (inline) {
//             return (
//               <code className={className} {...props}>
//                 {children}
//               </code>
//             );
//           }

//           return (
//             <CodeBlock
//               key={Math.random()}
//               language={(match && match[1]) || ''}
//               value={String(children).replace(/\n$/, '')}
//               {...props}
//             />
//           );
//         },
//       }}
//     >
//       {processedContent}
//     </MemoizedReactMarkdown>
//   );
// }

import 'katex/dist/katex.min.css';
import { FC, memo } from 'react';
import ReactMarkdown, { Options } from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

import { CodeBlock } from './codeblock';
import Link from 'next/link';

const MemoizedReactMarkdown: FC<Options> = memo(
  ReactMarkdown,
  (prevProps, nextProps) =>
    prevProps.children === nextProps.children &&
    prevProps.className === nextProps.className
);

const preprocessLaTeX = (content: string) => {
  // Replace block-level LaTeX delimiters \[ \] with $$ $$
  let processedContent = content.replace(
    /\\\[([\s\S]*?)\\\]/g,
    (_, equation) => `$$${equation}$$`
  );
  // Replace inline LaTeX delimiters \( \) with $ $
  processedContent = processedContent.replace(
    /\\\(([\s\S]*?)\\\)/g,
    (_, equation) => `$${equation}$`
  );
  // Replace \begin{equation} and \end{equation} with $$ $$
  processedContent = processedContent.replace(
    /\\begin\{equation\}([\s\S]*?)\\end\{equation\}/g,
    (_, equation) => `$$${equation}$$`
  );
  // Replace \begin{align} and \end{align} with $$ $$
  processedContent = processedContent.replace(
    /\\begin\{align\}([\s\S]*?)\\end\{align\}/g,
    (_, equation) => `$$\\begin{aligned}${equation}\\end{aligned}$$`
  );
  return processedContent;
};

const preprocessMedia = (content: string) => {
  // Remove `sandbox:`, `attachment:`, and `snt:` from the beginning of URLs
  return content.replace(/(sandbox|attachment|snt):/g, '');
};

const preprocessContent = (content: string) => {
  return preprocessMedia(preprocessLaTeX(content));
};

export default function Markdown({ content }: { content: string }) {
  const processedContent = preprocessContent(content);

  return (
    <MemoizedReactMarkdown
      className="prose dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 break-words custom-markdown"
      // remarkPlugins={[remarkGfm, remarkMath]}
      remarkPlugins={[remarkMath]}
      rehypePlugins={[rehypeKatex as any]}
      components={{
        h1({ children }) {
          return <h1 className="text-3xl font-bold mt-6 mb-4">{children}</h1>;
        },
        h2({ children }) {
          return (
            <h2 className="text-2xl font-semibold mt-5 mb-3">{children}</h2>
          );
        },
        h3({ children }) {
          return <h3 className="text-xl font-medium mt-4 mb-2">{children}</h3>;
        },
        p({ children }) {
          return <p className="mb-2 last:mb-0">{children}</p>;
        },
        a: ({ children, href, ...props }) => (
          <a
            href={href}
            target="_blank"
            className="text-blue-400 hover:underline"
            {...props}
          >
            {children}
          </a>
        ),
        // code({ node, inline, className, children, ...props }) {
        //   if (children.length) {
        //     if (children[0] == '▍') {
        //       return (
        //         <span className="mt-1 animate-pulse cursor-default">▍</span>
        //       );
        //     }

        //     children[0] = (children[0] as string).replace('`▍`', '▍');
        //   }

        //   const match = /language-(\w+)/.exec(className || '');

        //   if (inline) {
        //     return (
        //       <code className={className} {...props}>
        //         {children}
        //       </code>
        //     );
        //   }

        //   return (
        //     <CodeBlock
        //       key={Math.random()}
        //       language={(match && match[1]) || ''}
        //       value={String(children).replace(/\n$/, '')}
        //       {...props}
        //     />
        //   );
        // },
        table({ children }) {
          return (
            <div className="overflow-x-auto">
              <table className="border-collapse border border-gray-800 dark:border-gray-200">
                {children}
              </table>
            </div>
          );
        },
        th({ children }) {
          return (
            <th className="border border-gray-800 dark:border-gray-200 px-4 py-2 bg-gray-100 dark:bg-gray-700">
              {children}
            </th>
          );
        },
        td({ children }) {
          return (
            <td className="border border-gray-800 dark:border-gray-200 px-4 py-2">
              {children}
            </td>
          );
        },
      }}
    >
      {processedContent}
    </MemoizedReactMarkdown>
  );
}
