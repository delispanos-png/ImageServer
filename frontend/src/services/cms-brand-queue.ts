import { apiFetch } from './api';

export type BrandQueueStatus = 'pending' | 'approved' | 'dismissed' | 'duplicate';

export interface BrandQueueItem {
  _id: string;
  brand: string;
  title: string;
  title_key: string;
  image?: string;
  source_url?: string;
  categories?: {
    Category_1?: string;
    Category_2?: string;
    Category_3?: string;
  };
  first_seen_at: string;
  last_seen_at: string;
  seen_count: number;
  status: BrandQueueStatus;
  resolved_at?: string;
  resolved_to_barcode?: string;
  resolved_by?: string;
  match_score?: number;
  dismiss_reason?: string;
}

export interface BrandQueueListResponse {
  total: number;
  items: BrandQueueItem[];
}

export interface BrandQueueListParams {
  status?: BrandQueueStatus | 'all';
  brand?: string;
  skip?: number;
  limit?: number;
  sort_field?: 'seen_count' | 'last_seen_at' | 'first_seen_at' | 'brand';
  sort_dir?: -1 | 1;
}

export interface ApprovePayload {
  barcode: string;
  title?: string;
  description?: string;
  category_1?: string;
  category_2?: string;
  category_3?: string;
}

export interface ApproveResult {
  status: 'approved' | 'duplicate';
  barcode: string;
  product?: Record<string, unknown>;
  existing_product_id?: string;
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

export async function fetchBrandQueue(params: BrandQueueListParams = {}) {
  return apiFetch<BrandQueueListResponse>(
    `/cms/brand-queue${buildQuery(params as Record<string, string | number | undefined>)}`,
  );
}

export async function approveBrandQueueItem(queueId: string, payload: ApprovePayload) {
  return apiFetch<ApproveResult>(`/cms/brand-queue/${queueId}/approve`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function dismissBrandQueueItem(queueId: string, reason = '') {
  return apiFetch<{ status: 'dismissed' }>(`/cms/brand-queue/${queueId}/dismiss`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  });
}

export async function deleteBrandQueueItem(queueId: string) {
  return apiFetch<{ deleted: number }>(`/cms/brand-queue/${queueId}`, {
    method: 'DELETE',
  });
}

export interface BulkActionResult {
  action: 'dismiss' | 'delete';
  matched: number;
  modified: number;
}

export async function bulkBrandQueueAction(payload: {
  queue_ids: string[];
  action: 'dismiss' | 'delete';
  reason?: string;
}) {
  return apiFetch<BulkActionResult>('/cms/brand-queue/bulk', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
