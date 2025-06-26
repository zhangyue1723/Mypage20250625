import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

async function getTutorial(slug: string) {
    const tutorial = await prisma.tutorial.findUnique({
        where: {
            slug,
        },
    });

    if (!tutorial) {
        notFound();
    }
    return tutorial;
}

export async function generateStaticParams() {
    const tutorials = await prisma.tutorial.findMany({
        select: {
            slug: true,
        },
    });

    return tutorials.map((tutorial) => ({
        slug: tutorial.slug,
    }));
}

export async function generateMetadata(props: { params: { slug: string } }): Promise<Metadata> {
    const tutorial = await getTutorial(props.params.slug);
    return {
        title: `${tutorial.title} - LAMMPS Tutorials`,
    };
}

export default async function TutorialPage(props: { params: { slug: string } }) {
    const tutorial = await getTutorial(props.params.slug);

    return (
        <article>
            <ReactMarkdown
                rehypePlugins={[rehypeHighlight]}
                components={{
                    h1: ({ node, ...props }) => <h1 className="text-4xl font-serif font-normal text-text-heading mb-6 pb-2 border-b border-border-main" {...props} />,
                    h2: ({ node, ...props }) => <h2 className="text-3xl font-serif font-normal text-text-heading mt-8 mb-4 pb-2 border-b border-border-main" {...props} />,
                    h3: ({ node, ...props }) => <h3 className="text-2xl font-serif font-normal text-text-heading mt-6 mb-3" {...props} />,
                    p: ({ node, ...props }) => <p className="text-base leading-relaxed mb-4" {...props} />,
                    a: ({ node, ...props }) => <a className="text-brand-blue hover:underline" {...props} />,
                    code: ({ node, inline, className, children, ...props }: any) => {
                        if (inline) {
                            return <code className="bg-bg-code text-red-700 font-mono text-sm px-1 py-0.5 rounded-sm" {...props}>{children}</code>
                        }
                        return <code className={className} {...props}>{children}</code>
                    },
                    pre: ({ node, ...props }) => <pre className="bg-bg-code border border-border-main rounded-md p-4 overflow-x-auto my-4" {...props} />,
                    ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-4" {...props} />,
                    li: ({ node, ...props }) => <li className="mb-2" {...props} />,
                    blockquote: ({ node, children }: any) => {
                        return (
                            <div className="bg-note-green-bg border-l-4 border-note-green-border rounded-r-md my-6 p-4">
                                <div className="text-gray-800 text-sm">{children}</div>
                            </div>
                        );
                    },
                }}
            >
                {tutorial.content}
            </ReactMarkdown>
        </article>
    );
} 