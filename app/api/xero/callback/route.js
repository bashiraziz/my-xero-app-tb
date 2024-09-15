import { XeroClient } from 'xero-node';
import path from 'path';
import { parse } from 'json2csv';
import fs from 'fs';

const xero = new XeroClient({
  clientId: process.env.XERO_CLIENT_ID,
  clientSecret: process.env.XERO_CLIENT_SECRET,
  redirectUris: [process.env.XERO_REDIRECT_URI],
  scopes: 'accounting.reports.read offline_access'.split(' '),
});

export async function GET(request) {
  try {
    const tokenSet = await xero.apiCallback(request.url);
    xero.setTokenSet(tokenSet);  // Set tokens for future requests
    await xero.updateTenants();

    const tenantId = xero.tenants[0].tenantId;
    const trialBalanceResponse = await xero.accountingApi.getReportTrialBalance(tenantId);
    const trialBalance = trialBalanceResponse.body;

    // Extract relevant data from the trialBalance object
    let flattenedData = [];
    trialBalance.reports[0].rows.forEach(section => {
      if (section.rowType === 'Section') {
        const sectionTitle = section.title;

        section.rows.forEach(row => {
          if (row.rowType === 'Row') {
            const account = row.cells[0].value;
            const debit = row.cells[1].value || '';
            const credit = row.cells[2].value || '';
            const ytdDebit = row.cells[3].value || '';
            const ytdCredit = row.cells[4].value || '';

            flattenedData.push({
              Section: sectionTitle,
              Account: account,
              Debit: debit,
              Credit: credit,
              YTD_Debit: ytdDebit,
              YTD_Credit: ytdCredit
            });
          }
        });
      }
    });

    // Convert the extracted data to CSV
    const csvFields = ['Section', 'Account', 'Debit', 'Credit', 'YTD_Debit', 'YTD_Credit'];
    const csv = parse(flattenedData, { fields: csvFields });

    // Save the CSV file
    const filePath = path.join(process.cwd(), 'data', 'trial_balance.csv');
    fs.writeFileSync(filePath, csv);

    return new Response(JSON.stringify({ message: 'Trial balance saved to CSV.', filePath }), { status: 200 });
  } catch (error) {
    console.error('Error fetching trial balance:', error);
    return new Response(JSON.stringify({ message: 'Error fetching trial balance.', error }), { status: 500 });
  }
}