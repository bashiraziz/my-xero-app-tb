import { XeroClient } from 'xero-node';
import { setXeroToken } from './xeroTokenStore'; // Import token setter

const xero = new XeroClient({
  clientId: process.env.XERO_CLIENT_ID,
  clientSecret: process.env.XERO_CLIENT_SECRET,
  redirectUris: [process.env.XERO_REDIRECT_URI],
  scopes: 'accounting.reports.read offline_access'.split(' '),
});

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');

    if (!code) {
      return new Response(JSON.stringify({ message: 'Authorization code missing.' }), { status: 400 });
    }

    // Get the token set using the code from the callback
    const tokenSet = await xero.apiCallback(request.url);

    if (!tokenSet) {
      return new Response(JSON.stringify({ message: 'Failed to retrieve token set from Xero.' }), { status: 500 });
    }

    // Save token set in the token store
    setXeroToken(tokenSet);

    xero.setTokenSet(tokenSet);
    await xero.updateTenants(); // Update tenants for the Xero client

    return new Response(null, {
      status: 302,
      headers: {
        Location: '/api/xero/fetch-trialBalance',
      },
    });
  } catch (error) {
    console.error('Error in Xero authentication callback:', error);
    return new Response(JSON.stringify({ message: 'Authentication error.', error: error.message }), {
      status: 500,
    });
  }
}