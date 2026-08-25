import { apiFetch } from './api';
import type { ScannerResponse } from './cms-source-scanner';

export type SubmissionStatus =
  | 'pending'
  | 'searching'
  | 'needs_review'
  | 'approved'
  | 'rejected'
  | 'failed';

export interface ProductSubmission {
  id: string;
  Barcode: string;
  client_id: string;
  client_email: string;
  client_name: string;
  submitted: {
    title: string;
    brand: string;
    description: string;
    image_url: string;
    notes: string;
  };
  status: SubmissionStatus;
  auto_search_results: ScannerResponse | null;
  auto_search_status: string;
  auto_search_started_at: string;
  auto_search_finished_at: string;
  admin_notes: string;
  reviewed_by: string;
  reviewed_at: string;
  imported_source_key: string;
  created_at: string;
  updated_at: string;
}

interface ListResponse {
  success: boolean;
  data: ProductSubmission[];
  total: number;
}

interface DetailResponse {
  success: boolean;
  data: ProductSubmission;
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

export async function listSubmissions(params: {
  status?: SubmissionStatus;
  barcode?: string;
  client_id?: string;
  skip?: number;
  limit?: number;
} = {}) {
  return apiFetch<ListResponse>(`/cms/product-submissions${buildQuery(params as Record<string, string | number | undefined>)}`);
}

export async function getSubmission(id: string) {
  const response = await apiFetch<DetailResponse>(`/cms/product-submissions/${id}`);
  return response.data;
}

export async function approveSubmission(id: string, payload: { source_key: string; admin_notes?: string }) {
  const response = await apiFetch<DetailResponse>(`/cms/product-submissions/${id}/approve`, {
    method: 'POST',
    body: JSON.stringify({ source_key: payload.source_key, admin_notes: payload.admin_notes || '' }),
  });
  return response.data;
}

export async function rejectSubmission(id: string, admin_notes = '') {
  const response = await apiFetch<DetailResponse>(`/cms/product-submissions/${id}/reject`, {
    method: 'POST',
    body: JSON.stringify({ admin_notes }),
  });
  return response.data;
}

export async function rescanSubmission(id: string, download_images = false) {
  const response = await apiFetch<DetailResponse>(`/cms/product-submissions/${id}/rescan`, {
    method: 'POST',
    body: JSON.stringify({ download_images }),
  });
  return response.data;
}
