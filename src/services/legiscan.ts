import { LegiscanBill } from '../types';

// LegiScan API integration for tracking firearm-related legislation
// API docs: https://legiscan.com/legiscan
// You'll need a free API key from https://legiscan.com/legiscan

const LEGISCAN_BASE_URL = 'https://api.legiscan.com';

// Replace with your actual API key
const LEGISCAN_API_KEY: string = 'YOUR_LEGISCAN_API_KEY';

// Search terms for gun-related legislation
const GUN_LAW_SEARCH_TERMS = [
  'concealed carry',
  'firearm',
  'second amendment',
  'gun',
  'CCW',
  'open carry',
  'permitless carry',
  'constitutional carry',
  'red flag',
  'magazine capacity',
];

interface LegiscanSearchResult {
  searchresult: Record<
    string,
    | {
        bill_id: number;
        bill_number: string;
        title: string;
        state: string;
        text_url: string;
        last_action: string;
        last_action_date: string;
      }
    | { summary: { count: number; page: number; page_total: number } }
  >;
}

interface LegiscanBillResult {
  bill: {
    bill_id: number;
    bill_number: string;
    title: string;
    description: string;
    state: string;
    status: number;
    status_date: string;
    url: string;
    history: Array<{
      date: string;
      action: string;
      chamber: string;
    }>;
  };
}

const STATUS_MAP: Record<number, string> = {
  1: 'Introduced',
  2: 'Engrossed',
  3: 'Enrolled',
  4: 'Passed',
  5: 'Vetoed',
  6: 'Failed',
};

async function legiscanFetch<T>(params: Record<string, string>): Promise<T> {
  const searchParams = new URLSearchParams({
    key: LEGISCAN_API_KEY,
    ...params,
  });

  const response = await fetch(`${LEGISCAN_BASE_URL}/?${searchParams}`);
  if (!response.ok) {
    throw new Error(`LegiScan API error: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

/**
 * Search for gun-related bills across all states or a specific state.
 */
export async function searchGunBills(
  stateCode?: string,
  query?: string
): Promise<LegiscanBill[]> {
  const searchQuery = query || GUN_LAW_SEARCH_TERMS.slice(0, 3).join(' OR ');

  const params: Record<string, string> = {
    op: 'search',
    query: searchQuery,
  };

  if (stateCode && stateCode !== 'DC') {
    params.state = stateCode;
  }

  try {
    const data = await legiscanFetch<LegiscanSearchResult>(params);
    const bills: LegiscanBill[] = [];

    for (const [key, value] of Object.entries(data.searchresult)) {
      if (key === 'summary' || !value || typeof value !== 'object') continue;
      if (!('bill_id' in value)) continue;

      bills.push({
        billId: value.bill_id,
        billNumber: value.bill_number,
        title: value.title,
        description: '',
        state: value.state,
        status: '',
        statusDate: '',
        url: value.text_url,
        lastAction: value.last_action,
        lastActionDate: value.last_action_date,
      });
    }

    return bills;
  } catch (error) {
    console.error('LegiScan search error:', error);
    return [];
  }
}

/**
 * Get detailed information about a specific bill.
 */
export async function getBillDetails(billId: number): Promise<LegiscanBill | null> {
  try {
    const data = await legiscanFetch<LegiscanBillResult>({
      op: 'getBill',
      id: billId.toString(),
    });

    const bill = data.bill;
    const lastHistory = bill.history?.[bill.history.length - 1];

    return {
      billId: bill.bill_id,
      billNumber: bill.bill_number,
      title: bill.title,
      description: bill.description,
      state: bill.state,
      status: STATUS_MAP[bill.status] || 'Unknown',
      statusDate: bill.status_date,
      url: bill.url,
      lastAction: lastHistory?.action || '',
      lastActionDate: lastHistory?.date || '',
    };
  } catch (error) {
    console.error('LegiScan bill fetch error:', error);
    return null;
  }
}

/**
 * Get recent gun-related legislation for a specific state.
 */
export async function getStateGunBills(stateCode: string): Promise<LegiscanBill[]> {
  return searchGunBills(stateCode, 'firearm OR "concealed carry" OR "gun"');
}

/**
 * Check if the API key is configured.
 */
export function isLegiscanConfigured(): boolean {
  return LEGISCAN_API_KEY !== 'YOUR_LEGISCAN_API_KEY' && LEGISCAN_API_KEY.length > 0;
}
