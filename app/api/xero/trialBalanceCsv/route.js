import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'trial_balance.csv');
    if (!fs.existsSync(filePath)) {
      return new Response('CSV file not found', { status: 404 });
    }

    const csvData = fs.readFileSync(filePath, 'utf-8');
    return new Response(csvData, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="trial_balance.csv"',
      },
    });
  } catch (error) {
    console.error('Error serving CSV:', error);
    return new Response('Error serving CSV', { status: 500 });
  }
}