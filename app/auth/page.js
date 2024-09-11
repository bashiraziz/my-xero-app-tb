'use client'; // Required for using client-side event handlers

export default function AuthPage() {
  const handleXeroAuth = () => {
    window.location.href = '/api/xero/auth';  // Redirect to the Xero auth route
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Xero Authentication</h1>
      <button
        onClick={handleXeroAuth}
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        Connect to Xero
      </button>
    </div>
  );
}