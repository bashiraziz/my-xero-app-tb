import { XeroClient } from 'xero-node';
import fs from 'fs';
import path from 'path';
import { parse } from 'json2csv';

const xero = new XeroClient({
  clientId: process.env.XERO_CLIENT_ID,
  clientSecret: process.env.XERO_CLIENT_SECRET,
  redirectUris: [process.env.XERO_REDIRECT_URI],
  scopes: 'openid profile email accounting.transactions accounting.reports.read offline_access'.split(' '),
});

export async function GET() {
  try {
    await xero.updateTenants();
    const tenantId = xero.tenants[0].tenantId;

    const trialBalanceResponse = await xero.accountingApi.getReportTrialBalance(tenantId, { date: '2023-12-31' });
    const trialBalance = trialBalanceResponse.body;

    // Convert the trial balance to CSV
    const csv = parse(trialBalance);
    const filePath = path.join(process.cwd(), 'data', 'trial_balance.csv');

    // Save the CSV file
    fs.writeFileSync(filePath, csv);

    return new Response(JSON.stringify({ message: 'Trial balance saved to CSV.', filePath }), { status: 200 });
  } catch (error) {
    console.error('Error fetching trial balance:', error);
    return new Response(JSON.stringify({ message: 'Error fetching trial balance.', error }), { status: 500 });
  }
}
