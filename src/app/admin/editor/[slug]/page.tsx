'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
// import type { Tutorial } from '@prisma/client';

const MarkdownEditor = dynamic(
  () => import('../MarkdownEditor'),
  { ssr: false }
);

type EditTutorialPageProps = {
  params: {
    slug: string;
  };
};

export default function EditTutorialPage({
  params,
}: EditTutorialPageProps) {
  const [tutorial, setTutorial] = useState<any | null>(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const { slug: currentSlug } = params;

  useEffect(() => {
    if (currentSlug) {
      fetch(`/api/tutorials/${currentSlug}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error('Failed to fetch tutorial');
          }
          return res.json();
        })
        .then((data) => {
          setTutorial(data);
          setTitle(data.title);
          setSlug(data.slug);
          setContent(data.content);
        })
        .catch((error) => {
          console.error(error);
          alert('Could not load tutorial data.');
          router.push('/admin/dashboard');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [currentSlug, router]);
  
  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const newSlug = value
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
    setSlug(newSlug);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await fetch(`/api/tutorials/${currentSlug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, slug, content }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update tutorial');
      }

      router.push('/admin/dashboard');
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('An unknown error occurred');
      }
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this tutorial?')) {
        setIsSaving(true);
        try {
            const response = await fetch(`/api/tutorials/${currentSlug}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete tutorial');
            }

            router.push('/admin/dashboard');
        } catch (error) {
            if (error instanceof Error) {
                alert(error.message);
            } else {
                alert('An unknown error occurred');
            }
        } finally {
            setIsSaving(false);
        }
    }
  };

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!tutorial) {
    return <div className="p-8">Tutorial not found.</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-text-heading mb-8">
        Edit Tutorial
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
            required
          />
        </div>
        <div>
          <label
            htmlFor="slug"
            className="block text-sm font-medium text-gray-700"
          >
            Slug
          </label>
          <input
            type="text"
            id="slug"
            value={slug}
            onChange={handleSlugChange}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
            required
          />
        </div>
        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700"
          >
            Content (Markdown)
          </label>
          <div className="mt-1">
            <MarkdownEditor value={content} onChange={setContent} />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <button
            type="submit"
            disabled={isSaving}
            className="bg-brand-blue hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-400"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isSaving}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-400"
            >
            {isSaving ? 'Deleting...' : 'Delete Tutorial'}
            </button>
        </div>
      </form>
    </div>
  );
} 