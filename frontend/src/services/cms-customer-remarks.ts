import { apiFetch } from './api';
import type { ApiSuccessResponse, CmsCustomerRemark, PaginatedApiSuccessResponse } from '../types';

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

export interface CmsCustomerRemarksParams {
  search?: string;
  status_filter?: 'all' | 'new' | 'under_review' | 'resolved';
  client_id?: string;
  page?: number;
  per_page?: number;
}

export interface UpdateCustomerRemarkPayload {
  status: 'new' | 'under_review' | 'resolved';
  admin_response?: string;
  resolution_note?: string;
}

export async function fetchCustomerRemarks(params: CmsCustomerRemarksParams = {}) {
  return apiFetch<PaginatedApiSuccessResponse<CmsCustomerRemark>>(
    `/cms/customer-remarks${buildQuery(params as Record<string, string | number | undefined>)}`,
  );
}

export async function updateCustomerRemark(remarkId: string, payload: UpdateCustomerRemarkPayload) {
  const response = await apiFetch<ApiSuccessResponse<CmsCustomerRemark>>(`/cms/customer-remarks/${remarkId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return response.data;
}
