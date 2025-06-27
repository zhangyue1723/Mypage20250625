'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import prisma from '@/lib/prisma';
import Link from 'next/link';

// Force dynamic rendering to avoid build-time database issues
export const dynamic = 'force-dynamic';

async function getTutorials() {
  try {
    const response = await fetch('/api/tutorials', {
      method: 'GET',
      credentials: 'include', // Include cookies
    });
    
    if (response.ok) {
      return await response.json();
    } else {
      console.error('Failed to fetch tutorials:', response.status);
      return [];
    }
  } catch (error) {
    console.log('Error fetching tutorials:', error);
    return [];
  }
}

export default function DashboardPage() {
  const [tutorials, setTutorials] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    console.log('Dashboard component mounted');
    
    // Check authentication
    const checkAuth = () => {
      const cookies = document.cookie;
      console.log('Checking cookies:', cookies);
      
      const tokenMatch = cookies.match(/(?:^|; )token=([^;]*)/);
      const token = tokenMatch ? decodeURIComponent(tokenMatch[1]) : null;
      
      if (token) {
        console.log('Token found, user authenticated');
        setIsAuthenticated(true);
        // Load tutorials
        getTutorials().then(data => {
          setTutorials(data || []);
          setIsLoading(false);
        });
      } else {
        console.log('No token found, redirecting to login');
        router.push('/admin/login');
      }
    };

    checkAuth();
  }, [router]);

  if (!isAuthenticated) {
    return <div className="p-8">Checking authentication...</div>;
  }

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-text-heading">Admin Dashboard</h1>
        <Link
          href="/admin/editor/new"
          className="bg-brand-blue hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Create New Tutorial
        </Link>
      </div>

      <div className="bg-white shadow-md rounded">
        <table className="min-w-full table-auto">
          <thead className="bg-bg-sidebar">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Slug
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Updated
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tutorials.length > 0 ? (
              tutorials.map((tutorial) => (
                <tr key={tutorial.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-main">
                    {tutorial.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {tutorial.slug}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(tutorial.updatedAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      href={`/admin/editor/${tutorial.slug}`}
                      className="text-brand-blue hover:text-blue-800 mr-4"
                    >
                      Edit
                    </Link>
                    <button className="text-red-600 hover:text-red-800">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                  No tutorials available. Create your first tutorial!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 