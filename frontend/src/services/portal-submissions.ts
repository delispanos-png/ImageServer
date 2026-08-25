import { apiFetch } from './api';

export interface PortalSubmissionPayload {
  barcode: string;
  title?: string;
  brand?: string;
  description?: string;
  image_url?: string;
  notes?: string;
}

export interface PortalSubmissionResult {
  id: string;
  Barcode: string;
  status: string;
  submitted: {
    title: string;
    brand: string;
    description: string;
    image_url: string;
    notes: string;
  };
  created_at: string;
}

export async function submitProduct(payload: PortalSubmissionPayload) {
  const response = await apiFetch<{ success: boolean; data: PortalSubmissionResult }>(
    '/portal/product-submissions',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
  );
  return response.data;
}

export async function listMySubmissions(params: { status?: string; skip?: number; limit?: number } = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') query.set(key, String(value));
  });
  const url = `/portal/product-submissions${query.toString() ? `?${query.toString()}` : ''}`;
  const response = await apiFetch<{ success: boolean; data: PortalSubmissionResult[]; total: number }>(url);
  return response;
}

export async function fetchPendingCount() {
  const response = await apiFetch<{ success: boolean; data: { pending: number } }>(
    '/portal/product-submissions/pending-count',
  );
  return response.data.pending;
}
