import { apiFetch } from './api';

export type MissingBarcodeStatus = 'pending' | 'searching' | 'found' | 'not_found' | 'dismissed';

export interface MissingBarcodeEntry {
  _id: string;
  Barcode: string;
  request_count: number;
  first_requested_at: string;
  last_requested_at: string;
  last_endpoint?: string;
  client_domains?: string[];
  status: MissingBarcodeStatus;
  search_attempts?: number;
  searched_at?: string;
  status_updated_at?: string;
  notes?: string;
}

export interface MissingBarcodesListResponse {
  total: number;
  items: MissingBarcodeEntry[];
}

export interface MissingBarcodesListParams {
  status?: MissingBarcodeStatus;
  client_domain?: string;
  skip?: number;
  limit?: number;
  sort_field?: 'request_count' | 'last_requested_at' | 'first_requested_at' | 'search_attempts';
  sort_dir?: -1 | 1;
}

export interface SearchResult {
  barcode: string;
  status: MissingBarcodeStatus;
  source?: string;
  error?: string;
}

export interface BulkSearchResult {
  started: number;
  found?: number;
  results: SearchResult[];
}

function buildQuery(params: Record<string, string | number | undefined>) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      query.set(key, String(value));
    }
  });
  const encoded = query.toString();
  return encoded ? `?${encoded}` : '';
}

export async function fetchMissingBarcodes(params: MissingBarcodesListParams = {}) {
  return apiFetch<MissingBarcodesListResponse>(
    `/cms/missing-barcodes${buildQuery(params as Record<string, string | number | undefined>)}`,
  );
}

export async function searchMissingBarcode(barcode: string) {
  return apiFetch<SearchResult>(`/cms/missing-barcodes/${encodeURIComponent(barcode)}/search`, {
    method: 'POST',
  });
}

export async function bulkSearchMissingBarcodes(payload: {
  barcodes?: string[];
  top_n?: number;
  status?: 'pending' | 'not_found';
}) {
  return apiFetch<BulkSearchResult>('/cms/missing-barcodes/bulk-search', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function dismissMissingBarcode(barcode: string, notes = '') {
  return apiFetch<MissingBarcodeEntry>(`/cms/missing-barcodes/${encodeURIComponent(barcode)}/dismiss`, {
    method: 'POST',
    body: JSON.stringify({ notes }),
  });
}

export async function deleteMissingBarcode(barcode: string) {
  return apiFetch<{ deleted: number }>(`/cms/missing-barcodes/${encodeURIComponent(barcode)}`, {
    method: 'DELETE',
  });
}
