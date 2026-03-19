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
