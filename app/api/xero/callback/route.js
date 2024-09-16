import { XeroClient } from 'xero-node';
import { NextResponse } from 'next/server';

// Initialize Xero client
const xero = new XeroClient({
  clientId: process.env.XERO_CLIENT_ID,
  clientSecret: process.env.XERO_CLIENT_SECRET,
  redirectUris: [process.env.XERO_REDIRECT_URI],
  scopes: 'accounting.reports.read offline_access'.split(' '),
});

export async function GET(req) {
  try {
    // Handle the OAuth callback and get the tokenSet
    const tokenSet = await xero.apiCallback(req.url);

    // You must store the tokenSet somewhere after successful authentication
    // If you're not using sessions, you could store this in a database or some other persistent store.
    // For now, let's store it in memory for simplicity (but this is not recommended for production).
    global.tokenSet = tokenSet; // In-memory storage (temporary solution)

    // Fetch tenants info to confirm authentication
    await xero.updateTenants();

    // Redirect to dashboard after successful authentication
    const redirectUrl = 'http://localhost:3000/api/xero/fetch-trialBalance';
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}