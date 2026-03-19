import { apiFetch } from './api';
import type {
  ApiSuccessResponse,
  PaginatedApiSuccessResponse,
  PortalCategorySummary,
  PortalClient,
  PortalComment,
  PortalDashboardOverview,
  PortalItem,
} from '../types';

export interface PortalItemListParams {
  search?: string;
  category_1?: string;
  category_2?: string;
  category_3?: string;
  created_since_days?: number;
  page?: number;
  per_page?: number;
  sort_by?: 'title' | 'code' | 'barcode' | 'created_at' | 'updated_at';
  sort_order?: 'asc' | 'desc';
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

export async function fetchPortalProfile() {
  const response = await apiFetch<ApiSuccessResponse<PortalClient>>('/portal/profile', { method: 'GET' });
  return response.data;
}

export async function fetchPortalDashboardOverview() {
  const response = await apiFetch<ApiSuccessResponse<PortalDashboardOverview>>('/portal/dashboard/overview', { method: 'GET' });
  return response.data;
}

export async function fetchPortalItems(params: PortalItemListParams = {}) {
  return apiFetch<PaginatedApiSuccessResponse<PortalItem>>(
    `/portal/items${buildQuery(params as Record<string, string | number | undefined>)}`,
    {
      method: 'GET',
    },
  );
}

export async function fetchPortalItem(itemId: string) {
  const previewBypass = Date.now();
  const response = await apiFetch<ApiSuccessResponse<PortalItem>>(`/portal/items/${itemId}?preview_bypass=${previewBypass}`, {
    method: 'GET',
    cache: 'no-store',
    headers: {
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
    },
  });
  return response.data;
}

export async function fetchPortalCategories() {
  const response = await apiFetch<ApiSuccessResponse<PortalCategorySummary[]>>('/portal/categories', { method: 'GET' });
  return response.data;
}

export async function fetchPortalComments(params: { item_id?: string; status_filter?: 'all' | 'new' | 'under_review' | 'resolved' } = {}) {
  const response = await apiFetch<ApiSuccessResponse<PortalComment[]>>(`/portal/comments${buildQuery(params as Record<string, string | number | undefined>)}`, {
    method: 'GET',
  });
  return response.data;
}

export async function createPortalComment(itemId: string, payload: { comment_text: string; comment_type: string }) {
  const response = await apiFetch<ApiSuccessResponse<PortalComment>>(`/portal/items/${itemId}/comments`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return response.data;
}
