import cron from 'node-cron';
import axios from 'axios';

// Define the function that fetches invoices
export async function fetchInvoices() {
  console.log('Fetching Xero data at', new Date().toLocaleTimeString());

  try {
    const response = await axios.post('http://localhost:3000/api/xero/fetch');
    console.log('Xero data fetched and saved successfully:', response.data);
  } catch (error) {
    console.error('Error fetching Xero data:', error.message);
  }
}

// Schedule the cron job to run every day at 9 AM
cron.schedule('0 09 * * *', async () => {
  await fetchInvoices();  // Reuse the fetchInvoices function here
});

console.log('Cron job scheduled to run at 9 AM daily.')