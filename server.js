import cron from 'node-cron';
import axios from 'axios';

// Define the function that fetches invoices
export async function fetchInvoices() {
  console.log('Fetching Xero data at', new Date().toLocaleTimeString());

  try {
    const response = await axios.get('http://localhost:3000/api/xero/fetch-trialBalance');
    console.log('Xero data fetched and saved successfully:', response.data);
  } catch (error) {
    console.error('Error fetching Xero data:', error.message);
  }
}

// Schedule the job to run at midnight every day
cron.schedule('0 0 * * *', fetchInvoices);
