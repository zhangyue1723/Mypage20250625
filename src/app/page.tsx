import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">LAMMPS Tutorials</h1>
            <Link 
              href="/admin" 
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Admin
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Available Tutorials</h2>
              <p className="text-gray-600">
                Welcome to LAMMPS Tutorials! This is a simple tutorial management system.
              </p>
              <div className="mt-4">
                <p className="text-sm text-gray-500">
                  No tutorials available yet. Please contact the administrator to add content.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
