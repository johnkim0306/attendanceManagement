import { NextResponse } from 'next/server';
import { BetaAnalyticsDataClient, RunReportRequest } from '@google-analytics/data';
import * as dotenv from 'dotenv';

dotenv.config();

const propertyId = "323129999";
const endingDate = "yesterday";

const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

if (!credentialsPath) {
  throw new Error("Google application credentials are not defined!");
}

const client = new BetaAnalyticsDataClient({
  keyFilename: credentialsPath,
});

export async function GET(req) {
  const url = new URL(req.url);
  const timeRange = url.searchParams.get('timeRange') || '28daysAgo';

  let startingDate;
  switch (timeRange) {
    case 'yearly':
      startingDate = '365daysAgo';
      break;
    case 'monthly':
      startingDate = '30daysAgo';
      break;
    case 'weekly':
      startingDate = '7daysAgo';
      break;
    default:
      startingDate = '28daysAgo';
  }

  const requestApi: RunReportRequest = {
    property: `properties/${propertyId}`,
    dimensions: [{ name: "deviceCategory" }],
    metrics: [{ name: "sessions" }],
    dateRanges: [{ startDate: startingDate, endDate: endingDate }],
  };

  try {
    const [response] = await client.runReport(requestApi);
    const data = response.rows?.map(row => ({
      deviceCategory: row.dimensionValues?.[0]?.value || '',
      sessions: parseInt(row.metricValues?.[0]?.value || '0', 10),
    })) || [];

    return NextResponse.json(data);
  } catch (e) {
    const error = e as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
