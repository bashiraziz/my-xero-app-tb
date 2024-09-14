'use client';

import { useState } from 'react';
import axios from 'axios';

export default function ManualFetchPage() {
  const [status, setStatus] = useState('');

  const triggerManualFetch = async () => {
    setStatus('Fetching data...');

    try {
      const response = await axios.get('/api/xero/fetch-trialBalance');

      if (response.status === 200) {
        setStatus(`Success: ${response.data.message}`);
      } else {
        setStatus(`Error: ${response.data.message}`);
      }
    } catch (error) {
      setStatus(`Error: ${error.response?.data?.message || error.message}`);
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
