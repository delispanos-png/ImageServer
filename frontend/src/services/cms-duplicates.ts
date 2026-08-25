import { apiFetch } from './api';

export type DuplicateStatus = 'pending' | 'merged' | 'dismissed' | 'stale';

export interface DuplicateGroup {
  _id: string;
  group_key: string;
  barcodes: string[];
  barcode_count: number;
  keeper_recommended: string;
  sample_title: string;
  shared_tokens: string[];
  items_active_count: number;
  items_with_image: number;
  first_seen_at: string;
  last_scanned_at: string;
  status: DuplicateStatus;
  resolved_at?: string;
  keeper_barcode?: string;
  retired_barcodes?: string[];
  dismiss_reason?: string;
}

export interface DuplicateProduct {
  Barcode: string;
  Title?: string;
  cms_title?: string;
  cms_status?: string;
  cms_description?: string;
  Brand?: string;
  Category_1?: string;
  Category_2?: string;
  Img_src?: string;
  Image_Path?: string;
  cms_updated_at?: string;
  barcode_aliases?: string[];
}

export interface DuplicateListResponse {
  total: number;
  items: DuplicateGroup[];
}

export interface DuplicateGroupDetail {
  group: DuplicateGroup;
  products: DuplicateProduct[];
}

function buildQuery(params: Record<string, string | number | undefined>) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') query.set(key, String(value));
  });
  const encoded = query.toString();
  return encoded ? `?${encoded}` : '';
}

export async function fetchDuplicateGroups(params: {
  status?: DuplicateStatus | 'all';
  skip?: number;
  limit?: number;
  sort_field?: string;
  sort_dir?: -1 | 1;
} = {}) {
  return apiFetch<DuplicateListResponse>(
    `/cms/duplicates${buildQuery(params as Record<string, string | number | undefined>)}`,
  );
}

export async function fetchDuplicateGroupDetail(groupId: string) {
  return apiFetch<DuplicateGroupDetail>(`/cms/duplicates/${groupId}/products`);
}

export async function mergeDuplicateGroup(groupId: string, payload: {
  keeper_barcode: string;
  retire_barcodes: string[];
}) {
  return apiFetch<{ status: 'merged'; keeper: string; retired: string[]; retired_deleted: number }>(
    `/cms/duplicates/${groupId}/merge`,
    { method: 'POST', body: JSON.stringify(payload) },
  );
}

export async function dismissDuplicateGroup(groupId: string, reason = '') {
  return apiFetch<{ status: 'dismissed' }>(
    `/cms/duplicates/${groupId}/dismiss`,
    { method: 'POST', body: JSON.stringify({ reason }) },
  );
}

export async function deleteDuplicateGroup(groupId: string) {
  return apiFetch<{ deleted: number }>(
    `/cms/duplicates/${groupId}`,
    { method: 'DELETE' },
  );
}
