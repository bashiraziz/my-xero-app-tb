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
    xero.setTokenSet(tokenSet);  // Set tokens for future requests
    await xero.updateTenants();

    const tenantId = xero.tenants[0].tenantId;
    const trialBalanceResponse = await xero.accountingApi.getReportTrialBalance(tenantId);
    const trialBalance = trialBalanceResponse.body;

    return new Response(JSON.stringify({ message: 'Trial balance fetched', trialBalance }), { status: 200 });
  } catch (error) {
    console.error('Error fetching trial balance:', error);
    return new Response('Failed to fetch trial balance', { status: 500 });
  }
}


