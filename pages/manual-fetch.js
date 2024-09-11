'use client';

import { useState } from 'react';

export default function ManualFetchPage() {
  const [status, setStatus] = useState('');

  const triggerManualFetch = async () => {
    setStatus('Fetching data...');

    try {
      const response = await fetch('/api/xero/fetch-trialBalance', {
        method: 'GET',
      });

      if (response.ok) {
        const data = await response.json();
        setStatus(`Success: ${data.message}`);
      } else {
        const errorData = await response.json();
        setStatus(`Error: ${errorData.message}`);
      }
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <h1>Manual Xero Trial Balance Fetch</h1>
      <button onClick={triggerManualFetch} className="bg-blue-500 text-white p-4 rounded">
        Fetch Trial Balance
      </button>
      <p>{status}</p>
    </div>
  );
}
