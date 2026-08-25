import { apiFetch } from './api';
import type {
  ApiSuccessResponse,
  CmsApiClientCredentialsResult,
  CmsClient,
  CmsClientPayload,
  PaginatedApiSuccessResponse,
} from '../types';

export interface ClientListParams {
  search?: string;
  status_filter?: 'all' | 'active' | 'inactive';
  subscription_filter?: 'all' | 'all_categories' | 'selected_categories';
  page?: number;
  per_page?: number;
  sort_by?: 'name' | 'email' | 'company' | 'status' | 'assigned_categories' | 'api_requests' | 'last_api_access_at' | 'created_at' | 'updated_at';
  sort_order?: 'asc' | 'desc';
}

function buildQuery(params: ClientListParams) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      query.set(key, String(value));
    }
  });
  const encoded = query.toString();
  return encoded ? `?${encoded}` : '';
}

export async function fetchClients(params: ClientListParams = {}) {
  return apiFetch<PaginatedApiSuccessResponse<CmsClient>>(`/cms/clients${buildQuery(params)}`);
}

export async function fetchClient(clientId: string): Promise<CmsClient> {
  const response = await apiFetch<ApiSuccessResponse<CmsClient>>(`/cms/clients/${clientId}`);
  return response.data;
}

export async function createClient(payload: CmsClientPayload): Promise<CmsClient> {
  const response = await apiFetch<ApiSuccessResponse<CmsClient>>('/cms/clients', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return response.data;
}

export async function updateClient(clientId: string, payload: CmsClientPayload): Promise<CmsClient> {
  const response = await apiFetch<ApiSuccessResponse<CmsClient>>(`/cms/clients/${clientId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return response.data;
}

export async function deleteClient(clientId: string): Promise<void> {
  await apiFetch<{ success: boolean; deleted_id: string }>(`/cms/clients/${clientId}`, {
    method: 'DELETE',
  });
}

export interface BulkDeleteResult {
  success: boolean;
  deleted_count: number;
  invalid_ids: string[];
  missing_ids: string[];
}

export async function bulkDeleteClients(clientIds: string[]): Promise<BulkDeleteResult> {
  return apiFetch<BulkDeleteResult>(`/cms/clients/bulk-delete`, {
    method: 'POST',
    body: JSON.stringify({ client_ids: clientIds }),
  });
}

export interface RevealedCredentials {
  success: boolean;
  password: string;
  api_username?: string;
  detail?: string;
}

export async function revealApiClientPassword(clientId: string): Promise<RevealedCredentials> {
  return apiFetch<RevealedCredentials>(`/cms/clients/${clientId}/api-credentials/reveal`);
}

export interface ResendCredentialsResult {
  success: boolean;
  email_sent: boolean;
  email_error: string;
  email: string;
}

export async function resendApiClientCredentials(clientId: string): Promise<ResendCredentialsResult> {
  return apiFetch<ResendCredentialsResult>(`/cms/clients/${clientId}/api-credentials/resend`, {
    method: 'POST',
  });
}

export interface TrialUsageResetResult {
  success: boolean;
  previous_count: number;
  current_count: number;
}

export async function resetTrialUsage(clientId: string): Promise<TrialUsageResetResult> {
  return apiFetch<TrialUsageResetResult>(`/cms/clients/${clientId}/reset-trial-usage`, {
    method: 'POST',
  });
}

export interface ApiClientCredentialsPayload {
  api_username: string;
  password?: string;
  generate_password?: boolean;
  send_email?: boolean;
}

export async function updateApiClientCredentials(
  clientId: string,
  payload: ApiClientCredentialsPayload,
): Promise<CmsApiClientCredentialsResult> {
  const response = await apiFetch<ApiSuccessResponse<CmsApiClientCredentialsResult>>(
    `/cms/clients/${clientId}/api-credentials`,
    {
      method: 'PUT',
      body: JSON.stringify(payload),
    },
  );
  return response.data;
}
