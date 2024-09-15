  import { writeFileSync } from 'fs';
  import path from 'path';
  import Papa from 'papaparse'; // For CSV parsing
  import { XeroClient } from 'xero-node';

  const xero = new XeroClient({
    clientId: process.env.XERO_CLIENT_ID,
    clientSecret: process.env.XERO_CLIENT_SECRET,
    redirectUris: [process.env.XERO_REDIRECT_URI],
    scopes: 'accounting.reports.read offline_access'.split(' '),
  });

  export async function GET(request) {
    try {
      const tokenSet = await xero.apiCallback(request.url);
      xero.setTokenSet(tokenSet); // Set tokens for future requests
      await xero.updateTenants();

      const tenantId = xero.tenants[0].tenantId;
      const trialBalanceResponse = await xero.accountingApi.getReportTrialBalance(tenantId);
      const trialBalance = trialBalanceResponse.body;

      const flattenedData = [];

      // Extract rows from the trial balance
      trialBalance.reports[0].rows.forEach((section) => {
        if (section.rowType === 'Section') {
          section.rows.forEach((row) => {
            if (row.rowType === 'Row') {
              const account = row.cells[0].value; // The full account info
              const debit = row.cells[1].value || ''; // Debit value
              const credit = row.cells[2].value || ''; // Credit value
              const ytdDebit = row.cells[3].value || ''; // Year-to-Date Debit
              const ytdCredit = row.cells[4].value || ''; // Year-to-Date Credit

              // Extract account code from the account name (e.g., Sales (400))
              const accountCodeMatch = account.match(/\((\d+)\)/); // Extract the number in brackets
              const accountCode = accountCodeMatch ? accountCodeMatch[1] : ''; // Account code
              const accountName = account.replace(/\(\d+\)/, '').trim(); // Remove the brackets and number

              // Push the parsed data to the flattenedData array
              flattenedData.push([section.title, accountCode, accountName, debit, credit, ytdDebit, ytdCredit]);
            }
          });
        }
      });

      // Define CSV headers
      const headers = ['Section', 'Account Code', 'Account Name', 'Debit', 'Credit', 'YTD Debit', 'YTD Credit'];

      // Use PapaParse to convert JSON to CSV format
      const csvData = Papa.unparse({
        fields: headers,
        data: flattenedData,
      });

      // Define file path and save CSV file
      const filePath = path.join(process.cwd(), 'data', 'trial_balance.csv');
      writeFileSync(filePath, csvData);

      console.log('Trial balance saved to', filePath);
      return new Response(JSON.stringify({ message: 'Trial balance fetched and saved to CSV.' }), { status: 200 });
    } catch (error) {
      console.error('Error fetching trial balance:', error);
      return new Response(JSON.stringify({ message: 'Error fetching trial balance', error: error.message }), { status: 500 });
    }
  }
