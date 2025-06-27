import prisma from '@/lib/prisma';
import Link from 'next/link';

// Force dynamic rendering to avoid build-time database issues
export const dynamic = 'force-dynamic';

async function getTutorials() {
  try {
    const tutorials = await prisma.tutorial.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        updatedAt: true,
      },
      orderBy: {
        order: 'asc',
      },
    });
    return tutorials || [];
  } catch (error) {
    console.log('Database not accessible during build for admin dashboard:', error);
    // Return empty array if database is not accessible during build
    return [];
  }
}

export default async function DashboardPage() {
  const tutorials = await getTutorials();

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