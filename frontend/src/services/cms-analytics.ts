import { apiFetch } from './api';

export interface ApiUsageTimelinePoint {
  date: string;
  count: number;
}

export interface ApiUsageBreakdown {
  endpoint?: string;
  client?: string;
  count: number;
}

export interface ApiUsageResponse {
  since: string;
  total_events: number;
  total_barcodes_requested: number;
  timeline: ApiUsageTimelinePoint[];
  top_endpoints: ApiUsageBreakdown[];
  top_clients: ApiUsageBreakdown[];
}

export interface TopMissingBarcodesResponse {
  items: Array<{
    barcode: string;
    request_count: number;
    client_domains: string[];
    first_requested_at: string;
    last_requested_at: string;
  }>;
}

export interface TopClientsResponse {
  items: Array<{
    username: string;
    domain: string;
    name: string;
    request_count: number;
    last_access_at: string;
    is_active: boolean;
  }>;
}

export async function fetchApiUsage(days = 7) {
  return apiFetch<ApiUsageResponse>(`/cms/analytics/api-usage?days=${days}`);
}

export async function fetchTopMissingBarcodes(limit = 20) {
  return apiFetch<TopMissingBarcodesResponse>(`/cms/analytics/top-missing-barcodes?limit=${limit}`);
}

export async function fetchTopClients(limit = 10) {
  return apiFetch<TopClientsResponse>(`/cms/analytics/top-clients?limit=${limit}`);
}
