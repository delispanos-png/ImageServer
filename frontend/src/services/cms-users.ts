import { apiFetch } from './api';
import type { CmsAdminUser, ApiSuccessResponse, PaginatedApiSuccessResponse } from '../types';

export interface CmsUserCreatePayload {
  full_name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'editor' | 'client';
  password: string;
  is_active: boolean;
}

export interface CmsUserUpdatePayload {
  full_name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'editor' | 'client';
  password?: string;
  is_active: boolean;
}

interface FetchUsersParams {
  search?: string;
  role_filter?: string;
  status_filter?: 'all' | 'active' | 'inactive';
  page?: number;
  per_page?: number;
  sort_by?: 'name' | 'email' | 'role' | 'status' | 'last_login_at' | 'created_at' | 'updated_at';
  sort_order?: 'asc' | 'desc';
}

function buildQuery(params: FetchUsersParams) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    query.set(key, String(value));
  });
  const encoded = query.toString();
  return encoded ? `?${encoded}` : '';
}

export async function fetchUsers(params: FetchUsersParams = {}) {
  return apiFetch<PaginatedApiSuccessResponse<CmsAdminUser>>(`/cms/users${buildQuery(params)}`);
}

export async function fetchUser(userId: string) {
  const response = await apiFetch<ApiSuccessResponse<CmsAdminUser>>(`/cms/users/${userId}`);
  return response.data;
}

export async function createUser(payload: CmsUserCreatePayload) {
  const response = await apiFetch<ApiSuccessResponse<CmsAdminUser>>('/cms/users', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return response.data;
}

export async function updateUser(userId: string, payload: CmsUserUpdatePayload) {
  const response = await apiFetch<ApiSuccessResponse<CmsAdminUser>>(`/cms/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return response.data;
}
