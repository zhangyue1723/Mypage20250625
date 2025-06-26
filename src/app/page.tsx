export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <h1 className="text-4xl font-bold mb-4">Welcome to LAMMPS Tutorials</h1>
      <p className="text-lg text-gray-600">
        Please select a tutorial from the list on the left to get started.
      </p>
      <p className="mt-4 text-sm text-gray-500">
        (If the list is empty, an administrator needs to add tutorials via the admin dashboard.)
      </p>
    </div>
  );
}
