import { XeroClient } from 'xero-node';

const xero = new XeroClient({
  clientId: process.env.XERO_CLIENT_ID,
  clientSecret: process.env.XERO_CLIENT_SECRET,
  redirectUris: [process.env.XERO_REDIRECT_URI],
  scopes: 'openid profile email accounting.transactions accounting.reports.read offline_access'.split(' '),
});

export async function GET() {
  try {
    // Redirect the user to Xero's consent page to log in
    const consentUrl = await xero.buildConsentUrl();
    return Response.redirect(consentUrl);
  } catch (error) {
    console.error('Error building consent URL:', error);
    return new Response('Failed to initiate Xero authentication', { status: 500 });
  }
}