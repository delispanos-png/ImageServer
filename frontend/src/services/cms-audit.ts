import { apiFetch } from './api';
import type { CmsAuditLog, PaginatedApiSuccessResponse } from '../types';

export interface AuditLogListParams {
  search?: string;
  user?: string;
  entity?: string;
  action?: string;
  date_from?: string;
  date_to?: string;
  page?: number;
  per_page?: number;
}

function buildQuery(params: AuditLogListParams) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      query.set(key, String(value));
    }
  });
  const encoded = query.toString();
  return encoded ? `?${encoded}` : '';
}

export async function fetchAuditLogs(params: AuditLogListParams = {}) {
  return apiFetch<PaginatedApiSuccessResponse<CmsAuditLog>>(`/cms/audit/logs${buildQuery(params)}`);
}
