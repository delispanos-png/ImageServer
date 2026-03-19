import { apiFetch } from './api';
import type { ApiSuccessResponse, CmsServerOverview } from '../types';

export async function fetchServerOverview(): Promise<CmsServerOverview> {
  const response = await apiFetch<ApiSuccessResponse<CmsServerOverview>>('/cms/server/overview');
  return response.data;
}
