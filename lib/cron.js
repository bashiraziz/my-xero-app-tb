import cron from 'node-cron';
import { fetchTrialBalance } from './xero';

// Schedule the cron job to run every day at 9 AM
cron.schedule('0 9 * * *', async () => {
  console.log('Cron job running at 9 AM');
  await fetchTrialBalance();
});

export default cron;