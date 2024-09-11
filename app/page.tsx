export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold">Welcome to the Xero Integration App</h1>
      <p>Please <a href="/auth" className="text-blue-600 underline">authenticate with Xero</a> to get started.</p>
    </div>
  );
}

