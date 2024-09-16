import { writeFileSync } from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { XeroClient } from 'xero-node';

// Use the in-memory token (replace with a secure method in production)
//import { tokenSet } from './callback'; // Adjust path as per your project structure

const xero = new XeroClient({
  clientId: process.env.XERO_CLIENT_ID,
  clientSecret: process.env.XERO_CLIENT_SECRET,
  redirectUris: [process.env.XERO_REDIRECT_URI],
  scopes: 'accounting.reports.read offline_access'.split(' '),
});

   

export async function GET() {
  try {
     // Set the token in the Xero client
     xero.setTokenSet(tokenSet);
     
    if (!tokenSet) {
      return new Response(JSON.stringify({ message: 'Token not found. Please authenticate first.' }), { status: 401 });
    }

    // Set the token for the Xero client
    xero.setTokenSet(tokenSet);
    
    await xero.updateTenants();
    const tenantId = xero.tenants[0].tenantId;
    
    // Fetch trial balance
    const trialBalanceResponse = await xero.accountingApi.getReportTrialBalance(tenantId);
    const trialBalance = trialBalanceResponse.body;

    const flattenedData = [];

    // Process the trial balance rows
    trialBalance.reports[0].rows.forEach((section) => {
      if (section.rowType === 'Section') {
        section.rows.forEach((row) => {
          if (row.rowType === 'Row') {
            const account = row.cells[0].value;
            const ytdDebit = row.cells[3]?.value || '';
            const ytdCredit = row.cells[4]?.value || '';

            // Extract account code and account name
            const accountCodeMatch = account.match(/\((\d+)\)/);
            const accountCode = accountCodeMatch ? accountCodeMatch[1] : '';
            const accountName = account.replace(/\(\d+\)/, '').trim();

            // Push to flattenedData array
            flattenedData.push([section.title, accountCode, accountName, ytdDebit, ytdCredit]);
          }
        });
      }
    });

    // Define CSV headers
    const headers = ['Section', 'Account Code', 'Account Name', 'YTD Debit', 'YTD Credit'];

    // Convert to CSV using PapaParse
    const csvData = Papa.unparse({
      fields: headers,
      data: flattenedData,
    });

    // Write CSV to file
    const filePath = path.join(process.cwd(), 'data', 'trial_balance.csv');
    writeFileSync(filePath, csvData);

    console.log('Trial balance saved to', filePath);
    return new Response(JSON.stringify({ message: 'Trial balance fetched and saved to CSV.' }), { status: 200 });
  } catch (error) {
    console.error('Error fetching trial balance:', error);
    return new Response(JSON.stringify({ message: 'Error fetching trial balance.', error: error.message }), { status: 500 });
  }
}
